import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SecondaryButton, Tag, WhiteCard, palette } from '@/components/huxuebao-ui';
import { useHuxuebao } from '@/contexts/huxuebao-context';
import type { AiScenario } from '@/data/huxuebao-data';
import { detectInvalidClinicalInput } from '@/lib/ai-validation';
import { requestAiTurn } from '@/lib/openrouter';

type ChatMessage = {
  id: string;
  speaker: 'AI患者' | 'AI考官' | '你';
  text: string;
  kind: 'bubble' | 'score';
};

type RoundResult = {
  stepId: string;
  score: number;
  maxScore: number;
  matched: string[];
  missed: string[];
};

type ChatSession = {
  scenarioId: string;
  stepIndex: number;
  score: number;
  messages: ChatMessage[];
  rounds: RoundResult[];
  completed: boolean;
  waiting: boolean;
};

export default function AiDrillScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ scenarioId?: string }>();
  const scrollRef = useRef<ScrollView | null>(null);
  const inputRef = useRef<TextInput | null>(null);
  const draftRef = useRef('');
  const { aiScenarios, saveAiSession } = useHuxuebao();
  const [selectedScenarioId, setSelectedScenarioId] = useState(params.scenarioId ?? aiScenarios[0]?.id ?? '');
  const [session, setSession] = useState<ChatSession | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (typeof params.scenarioId === 'string' && params.scenarioId !== selectedScenarioId) {
      setSelectedScenarioId(params.scenarioId);
    }
  }, [params.scenarioId, selectedScenarioId]);

  const selectedScenario =
    aiScenarios.find((scenario) => scenario.id === selectedScenarioId) ?? aiScenarios[0];

  const summary = useMemo(() => {
    if (!selectedScenario || !session?.completed) {
      return null;
    }

    return summarizeConversation(selectedScenario, session.rounds, session.score);
  }, [selectedScenario, session]);

  useEffect(() => {
    if (!selectedScenario) {
      return;
    }

    clearComposer();
    setErrorText('');
    setSession(buildInitialSession(selectedScenario));
  }, [selectedScenarioId, selectedScenario]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 30);

    return () => clearTimeout(timer);
  }, [session]);

  const handleSend = async () => {
    if (!selectedScenario || !session || session.completed || session.waiting) {
      return;
    }

    const content = draftRef.current.trim();

    if (!content) {
      return;
    }

    const step = selectedScenario.steps[session.stepIndex];
    const invalidReason = detectInvalidClinicalInput(content, step);

    if (invalidReason) {
      console.log('[AI] screen:skip-invalid', {
        scenarioId: selectedScenario.id,
        stepId: step.id,
        content,
        reason: invalidReason,
      });
      setSession({
        ...session,
        messages: [
          ...session.messages,
          createBubbleMessage('你', content),
          createBubbleMessage('AI考官', invalidReason),
          createScoreMessage('0分 输入不是有效处置方案，请重新输入'),
        ],
      });
      clearComposer();
      setErrorText('');
      return;
    }

    const nextHistory = [...session.messages, createBubbleMessage('你', content)];

    console.log('[AI] screen:send', {
      scenarioId: selectedScenario.id,
      stepId: step.id,
      content,
      historyCount: nextHistory.length,
    });

    setErrorText('');
    setSession({
      ...session,
      waiting: true,
      messages: nextHistory,
    });

    try {
      const aiTurn = await requestAiTurn({
        scenario: selectedScenario,
        step,
        history: nextHistory.map((message) => ({
          speaker: message.speaker,
          text: message.text,
        })),
        userInput: content,
      });
      console.log('[AI] screen:result', aiTurn);
      const nextRounds = [
        ...session.rounds,
        {
          stepId: step.id,
          score: aiTurn.scoreDelta,
          maxScore: step.maxScore,
          matched: aiTurn.matched,
          missed: aiTurn.missed,
        },
      ];
      const totalScore = session.score + aiTurn.scoreDelta;
      const nextMessages: ChatMessage[] = [
        ...nextHistory,
        createBubbleMessage(aiTurn.replyLabel, aiTurn.reply),
        createScoreMessage(aiTurn.scoreNote),
      ];
      clearComposer();
      const isLastStep = session.stepIndex === selectedScenario.steps.length - 1;

      if (isLastStep) {
        const finalSummary = summarizeConversation(selectedScenario, nextRounds, totalScore);

        saveAiSession({
          scenarioId: selectedScenario.id,
          title: selectedScenario.title,
          department: selectedScenario.department,
          level: selectedScenario.level,
          score: totalScore,
          maxScore: finalSummary.maxScore,
          strengths: finalSummary.strengths,
          misses: finalSummary.misses,
          nextAction: finalSummary.nextAction,
        });

        setSession({
          ...session,
          score: totalScore,
          rounds: nextRounds,
          messages: [
            ...nextMessages,
            createBubbleMessage(
              'AI考官',
              `本轮演练结束。你拿到 ${totalScore} / ${finalSummary.maxScore} 分，我已经把结果整理好了。`
            ),
          ],
          completed: true,
          waiting: false,
        });
        return;
      }

      const nextStep = selectedScenario.steps[session.stepIndex + 1];

      setSession({
        scenarioId: session.scenarioId,
        stepIndex: session.stepIndex + 1,
        score: totalScore,
        rounds: nextRounds,
        completed: false,
        waiting: false,
        messages: [...nextMessages, createBubbleMessage(nextStep.promptLabel, nextStep.prompt)],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI 暂时没有响应';

      setErrorText(message);
      console.log('[AI] screen:error', { message });
      setSession({
        ...session,
        waiting: false,
        messages: session.messages,
      });
      inputRef.current?.focus();
    }
  };

  const resetConversation = () => {
    if (!selectedScenario) {
      return;
    }

    clearComposer();
    setErrorText('');
    setSession(buildInitialSession(selectedScenario));
  };

  const handleDraftChange = (text: string) => {
    draftRef.current = text;
    const nextHasDraft = text.trim().length > 0;

    setHasDraft((current) => (current === nextHasDraft ? current : nextHasDraft));
  };

  const clearComposer = () => {
    draftRef.current = '';
    setHasDraft(false);
    inputRef.current?.clear();
  };

  if (!selectedScenario || !session) {
    return null;
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
        style={styles.keyboardShell}>
        <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons color="#285D97" name="arrow-back" size={24} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>AI情景演练</Text>
            <Text style={styles.headerSubtitle}>
              {selectedScenario.department}科 · {selectedScenario.level}难度
            </Text>
          </View>
          <View style={styles.headerButton}>
            <Ionicons color="#4F82C9" name="help-circle-outline" size={26} />
          </View>
        </View>

        <View style={styles.scenarioSwitch}>
          {aiScenarios.map((scenario) => (
            <SecondaryButton
              key={scenario.id}
              onPress={() => setSelectedScenarioId(scenario.id)}
              selected={selectedScenarioId === scenario.id}
              text={scenario.department}
            />
          ))}
        </View>

        <WhiteCard style={styles.patientCard}>
          <View style={styles.patientTopRow}>
            <View style={styles.avatar}>
              <Ionicons color="#FFFFFF" name="person-outline" size={24} />
            </View>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>
                患者: {selectedScenario.patientName}，{selectedScenario.patientMeta}
              </Text>
              <Text style={styles.patientComplaint}>主诉: {selectedScenario.chiefComplaint}</Text>
            </View>
          </View>
          <View style={styles.vitalGrid}>
            {selectedScenario.vitalCards.map((item) => (
              <View key={`${item.label}-${item.value}`} style={styles.vitalCard}>
                <Text
                  style={[
                    styles.vitalValue,
                    item.tone === 'danger' && styles.vitalValueDanger,
                    item.tone === 'warning' && styles.vitalValueWarning,
                  ]}>
                  {item.value}
                </Text>
                <Text style={styles.vitalLabel}>
                  {item.label} {item.unit}
                </Text>
              </View>
            ))}
          </View>
        </WhiteCard>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.chatContent}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.chatScroll}>
          {session.messages.map((message) =>
            message.kind === 'score' ? (
              <View key={message.id} style={styles.scoreRow}>
                <View style={styles.scoreChip}>
                  <Ionicons color="#2E6FBE" name="checkmark-circle" size={20} />
                  <Text style={styles.scoreChipText}>{message.text}</Text>
                </View>
              </View>
            ) : (
              <View
                key={message.id}
                style={[
                  styles.messageWrap,
                  message.speaker === '你' ? styles.messageWrapUser : styles.messageWrapAi,
                ]}>
                <Text
                  style={[
                    styles.messageLabel,
                    message.speaker === '你' ? styles.messageLabelUser : styles.messageLabelAi,
                  ]}>
                  {message.speaker}
                </Text>
                <View
                  style={[
                    styles.messageBubble,
                    message.speaker === '你' ? styles.messageBubbleUser : styles.messageBubbleAi,
                  ]}>
                  <Text
                    style={[
                      styles.messageText,
                      message.speaker === '你' && styles.messageTextUser,
                    ]}>
                    {message.text}
                  </Text>
                </View>
              </View>
            )
          )}

          {summary ? (
            <WhiteCard style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <Tag
                  text={summary.score >= selectedScenario.passingScore ? '已达标' : '待加强'}
                  tone={summary.score >= selectedScenario.passingScore ? 'green' : 'peach'}
                />
                <Text style={styles.summaryScore}>
                  {summary.score} / {summary.maxScore}
                </Text>
              </View>
              <Text style={styles.summaryText}>{summary.summary}</Text>
              <Text style={styles.summaryLabel}>这轮做得比较稳</Text>
              {summary.strengths.map((item) => (
                <Text key={item} style={styles.summaryItem}>
                  {`• ${item}`}
                </Text>
              ))}
              <Text style={styles.summaryLabel}>下一步建议</Text>
              <Text style={styles.summaryAdvice}>{summary.nextAction}</Text>
              <Pressable onPress={resetConversation} style={styles.restartButton}>
                <Text style={styles.restartButtonText}>重新开始这一轮</Text>
              </Pressable>
            </WhiteCard>
          ) : null}
        </ScrollView>

        <View style={styles.composerArea}>
          <Text style={styles.helperText}>
            {session.completed
              ? '本轮已结束，你可以切换场景或重新开始。'
              : session.waiting
                ? 'AI 正在回复，请稍等。'
                : selectedScenario.objective}
          </Text>
          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
          <View style={styles.composer}>
            <TextInput
              ref={inputRef}
              editable={!session.completed && !session.waiting}
              onChangeText={handleDraftChange}
              onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
              onSubmitEditing={handleSend}
              placeholder="输入处置方案..."
              placeholderTextColor="#9AA9C3"
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              blurOnSubmit={false}
              enablesReturnKeyAutomatically
              returnKeyType="send"
              selectionColor="#4E6CF8"
            />
            <Pressable
              disabled={session.completed || session.waiting || !hasDraft}
              onPress={handleSend}
              style={[
                styles.sendButton,
                (session.completed || session.waiting || !hasDraft) && styles.sendButtonDisabled,
              ]}>
              <Ionicons color="#FFFFFF" name="paper-plane-outline" size={22} />
            </Pressable>
          </View>
        </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function buildInitialSession(scenario: AiScenario): ChatSession {
  const firstStep = scenario.steps[0];

  return {
    scenarioId: scenario.id,
    stepIndex: 0,
    score: 0,
    rounds: [],
    completed: false,
    waiting: false,
    messages: [createBubbleMessage(firstStep.promptLabel, firstStep.prompt)],
  };
}

function createBubbleMessage(speaker: ChatMessage['speaker'], text: string): ChatMessage {
  return {
    id: `${speaker}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    speaker,
    text,
    kind: 'bubble',
  };
}

function createScoreMessage(text: string): ChatMessage {
  return {
    id: `score-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    speaker: 'AI考官',
    text,
    kind: 'score',
  };
}

function summarizeConversation(
  scenario: AiScenario,
  rounds: RoundResult[],
  score: number
) {
  const maxScore = rounds.reduce((total, round) => total + round.maxScore, 0);
  const strengths = uniqueList(rounds.flatMap((round) => round.matched));
  const misses = uniqueList(
    rounds
      .flatMap((round) => round.missed)
      .filter((item) => !strengths.includes(item))
  );
  const summary =
    score >= scenario.passingScore
      ? `你这轮整体处理顺序比较稳，核心动作基本都抓住了，已经接近真实床旁沟通的节奏。`
      : `你已经有一些关键动作意识了，但处理顺序和关键点还不够完整，继续练会明显更顺。`;
  const nextAction =
    misses.length > 0
      ? `优先补上 ${misses.slice(0, 2).join('、')}，然后再把 ${scenario.title} 重新完整走一遍。`
      : `可以切到 ${scenario.focus.join('、')} 相关场景继续往上练。`;

  return {
    score,
    maxScore,
    strengths: strengths.length > 0 ? strengths : scenario.focus,
    misses,
    summary,
    nextAction,
  };
}

function uniqueList(items: string[]) {
  return Array.from(new Set(items));
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F6FD',
  },
  keyboardShell: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#F0F6FD',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFFD9',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#16324F',
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6F87A3',
  },
  scenarioSwitch: {
    flexDirection: 'row',
    gap: 10,
  },
  patientCard: {
    padding: 16,
    gap: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  patientTopRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6CA8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientInfo: {
    flex: 1,
    gap: 4,
  },
  patientName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#16324F',
  },
  patientComplaint: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: '#6F87A3',
  },
  vitalGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  vitalCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#F6FAFE',
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#285D97',
  },
  vitalValueDanger: {
    color: '#D85C6F',
  },
  vitalValueWarning: {
    color: '#B98528',
  },
  vitalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F96B2',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    gap: 14,
    paddingBottom: 8,
  },
  messageWrap: {
    gap: 6,
  },
  messageWrapAi: {
    alignItems: 'flex-start',
  },
  messageWrapUser: {
    alignItems: 'flex-end',
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  messageLabelAi: {
    color: '#8AA1BC',
  },
  messageLabelUser: {
    color: '#6E88A4',
  },
  messageBubble: {
    maxWidth: '88%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  messageBubbleAi: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 8,
  },
  messageBubbleUser: {
    backgroundColor: '#2E6FBE',
    borderTopRightRadius: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '700',
    color: '#16324F',
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  scoreRow: {
    alignItems: 'flex-start',
  },
  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BDD3EE',
    backgroundColor: '#EDF5FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scoreChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E6FBE',
  },
  summaryCard: {
    padding: 16,
    gap: 10,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryScore: {
    fontSize: 20,
    fontWeight: '800',
    color: '#16324F',
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#69839F',
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '800',
    color: '#16324F',
  },
  summaryItem: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    color: '#69839F',
  },
  summaryAdvice: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
    color: '#2E6FBE',
  },
  restartButton: {
    marginTop: 6,
    borderRadius: 16,
    backgroundColor: '#EAF3FF',
    alignItems: 'center',
    paddingVertical: 12,
  },
  restartButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2E6FBE',
  },
  composerArea: {
    gap: 10,
    paddingBottom: 4,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: '#7B93AF',
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    color: '#C44C64',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#CCD9E8',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
  },
  sendButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E6FBE',
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
});
