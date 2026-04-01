import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  PrimaryButton,
  SecondaryButton,
  Tag,
  WhiteCard,
  palette,
} from '@/components/huxuebao-ui';
import { useHuxuebao } from '@/contexts/huxuebao-context';
import type { PracticeMode, Question } from '@/data/huxuebao-data';

type SessionState = {
  mode: PracticeMode;
  questions: Question[];
  index: number;
  answerMap: Record<string, string[]>;
  submittedQuestionIds: string[];
  correctCount: number;
  reviewingQuestionId?: string;
};

const modeConfig: Record<
  PracticeMode,
  { title: string; subtitle: string; accent: string; badge: string }
> = {
  chapter: { title: '章节练习', subtitle: '跟着课程章节刷题，边学边练', accent: 'book-outline', badge: '立即开始' },
  special: { title: '专项练习', subtitle: '按弱项和高频知识点集中突破', accent: 'medkit-outline', badge: '重点强化' },
  random: { title: '随机模拟', subtitle: '打散出题，适合下班前自测', accent: 'shuffle-outline', badge: '快速刷题' },
  exam: { title: '模拟考试', subtitle: '限时组卷，交卷后统一出分', accent: 'document-text-outline', badge: '限时出分' },
};

export default function PracticeSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = isPracticeMode(params.mode) ? params.mode : 'chapter';
  const {
    directionCourses,
    questions,
    examTemplates,
    submitAnswer,
    weakPoints,
    saveExamResult,
    latestExam,
  } = useHuxuebao();
  const [session, setSession] = useState<SessionState | null>(null);
  const [lastFeedback, setLastFeedback] = useState<{
    correct: boolean;
    explanation: string;
    recommendation: string;
  } | null>(null);

  const questionPool = useMemo(
    () => questions.filter((question) => directionCourses.some((course) => course.id === question.courseId)),
    [directionCourses, questions]
  );
  const examTemplate = examTemplates[0];

  const createSession = useCallback((nextMode: PracticeMode): SessionState => {
    let pool: Question[] = [];

    if (nextMode === 'exam') {
      pool = examTemplate.questionIds
        .map((questionId) => questionPool.find((question) => question.id === questionId))
        .filter(Boolean) as Question[];
    } else {
      pool = questionPool.filter((question) => question.modes.includes(nextMode));
      if (nextMode === 'special' && weakPoints[0]) {
        pool = [
          ...pool.filter((question) => question.knowledgePoint === weakPoints[0]?.knowledgePoint),
          ...pool.filter((question) => question.knowledgePoint !== weakPoints[0]?.knowledgePoint),
        ];
      }
      pool = pool.slice(0, 4);
    }

    return {
      mode: nextMode,
      questions: pool,
      index: 0,
      answerMap: {},
      submittedQuestionIds: [],
      correctCount: 0,
      reviewingQuestionId: undefined,
    };
  }, [examTemplate.questionIds, questionPool, weakPoints]);

  useEffect(() => {
    setLastFeedback(null);
    setSession(createSession(mode));
  }, [createSession, mode]);

  const currentQuestion = session ? session.questions[session.index] : null;
  const selectedIds = currentQuestion ? session.answerMap[currentQuestion.id] ?? [] : [];
  const sessionFinished = !!session && session.submittedQuestionIds.length === session.questions.length;

  const updateSelection = (optionId: string) => {
    if (!session || !currentQuestion || session.reviewingQuestionId === currentQuestion.id) {
      return;
    }

    const current = session.answerMap[currentQuestion.id] ?? [];
    const next =
      currentQuestion.type === 'multiple'
        ? current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId]
        : [optionId];

    setSession({
      ...session,
      answerMap: {
        ...session.answerMap,
        [currentQuestion.id]: next,
      },
    });
  };

  const submitCurrent = () => {
    if (!session || !currentQuestion || selectedIds.length === 0) {
      return;
    }

    if (session.reviewingQuestionId === currentQuestion.id) {
      setLastFeedback(null);
      setSession({
        ...session,
        index: session.index + 1,
        reviewingQuestionId: undefined,
      });
      return;
    }

    const correct = submitAnswer(currentQuestion.id, selectedIds, session.mode);
    const nextCorrectCount = session.correctCount + (correct ? 1 : 0);
    const submittedQuestionIds = [...session.submittedQuestionIds, currentQuestion.id];

    setLastFeedback({
      correct,
      explanation: currentQuestion.explanation,
      recommendation: currentQuestion.recommendation,
    });

    if (session.index === session.questions.length - 1) {
      if (session.mode === 'exam') {
        saveExamResult(examTemplate.id, nextCorrectCount, session.questions.length);
      }

      setSession({
        ...session,
        correctCount: nextCorrectCount,
        submittedQuestionIds,
        reviewingQuestionId: currentQuestion.id,
      });
      return;
    }

    setSession({
      ...session,
      correctCount: nextCorrectCount,
      submittedQuestionIds,
      reviewingQuestionId: currentQuestion.id,
    });
  };

  if (!session) {
    return null;
  }

  const config = modeConfig[session.mode];

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons color={palette.text} name="arrow-back" size={22} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{config.title}</Text>
            <Text style={styles.headerSubtitle}>{config.subtitle}</Text>
          </View>
        </View>

        <WhiteCard style={styles.heroCard}>
          <View style={styles.heroTop}>
            <Tag text={config.badge} tone={session.mode === 'exam' ? 'peach' : 'green'} />
            <View style={styles.heroIcon}>
              <Ionicons color={palette.green} name={config.accent as never} size={22} />
            </View>
          </View>
          <Text style={styles.heroMeta}>
            {session.mode === 'exam'
              ? `最近模考 ${latestExam?.score ?? 0} 分`
              : `共 ${session.questions.length} 题，开始后会自动记录到学习画像`}
          </Text>
        </WhiteCard>

        {currentQuestion && !sessionFinished ? (
          <WhiteCard style={styles.sessionCard}>
            <View style={styles.sessionHead}>
              <Tag text={`${session.index + 1} / ${session.questions.length}`} tone="light" />
              <Text style={styles.sessionProgress}>{currentQuestion.type === 'multiple' ? '多选题' : '单选题'}</Text>
            </View>
            <Text style={styles.questionStem}>{currentQuestion.stem}</Text>
            <Text style={styles.tipText}>
              {currentQuestion.type === 'multiple' ? '本题可多选' : '本题单选'}
            </Text>

            <View style={styles.optionList}>
              {currentQuestion.options.map((option) => {
                const active = selectedIds.includes(option.id);

                return (
                  <Pressable key={option.id} onPress={() => updateSelection(option.id)}>
                    <View
                      style={[
                        styles.optionCard,
                        active && styles.optionCardActive,
                        session.reviewingQuestionId === currentQuestion.id && styles.optionCardLocked,
                      ]}>
                      <View style={[styles.optionMark, active && styles.optionMarkActive]} />
                      <Text style={[styles.optionText, active && styles.optionTextActive]}>{option.text}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <PrimaryButton
              disabled={selectedIds.length === 0}
              onPress={submitCurrent}
              text={
                session.reviewingQuestionId === currentQuestion.id
                  ? '下一题'
                  : session.index === session.questions.length - 1
                    ? '提交并完成'
                    : '提交本题'
              }
            />

            {lastFeedback ? (
              <View style={[styles.feedbackBox, lastFeedback.correct ? styles.correctBox : styles.wrongBox]}>
                <Text style={styles.feedbackTitle}>{lastFeedback.correct ? '回答正确' : '需要回看'}</Text>
                <Text style={styles.feedbackText}>{lastFeedback.explanation}</Text>
                <Text style={styles.feedbackTip}>{lastFeedback.recommendation}</Text>
              </View>
            ) : null}
          </WhiteCard>
        ) : null}

        {sessionFinished ? (
          <WhiteCard style={styles.resultCard}>
            <Tag text={session.mode === 'exam' ? '模拟考试结果' : '本轮练习完成'} tone="light" />
            <Text style={styles.resultScore}>
              {session.mode === 'exam'
                ? `${Math.round((session.correctCount / session.questions.length) * 100)} 分`
                : `答对 ${session.correctCount} / ${session.questions.length} 题`}
            </Text>
            <Text style={styles.resultText}>
              {session.mode === 'exam'
                ? `最新模考 ${latestExam?.score ?? 0} 分，继续冲刺 85 分证书线。`
                : '系统已同步更新错题本和薄弱点分析。'}
            </Text>
            <View style={styles.buttonRow}>
              <PrimaryButton onPress={() => router.replace('/practice')} text="返回练习中心" />
              <SecondaryButton
                onPress={() => {
                  setLastFeedback(null);
                  setSession(createSession(session.mode));
                }}
                text="再来一轮"
              />
            </View>
          </WhiteCard>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function isPracticeMode(value?: string): value is PracticeMode {
  return value === 'chapter' || value === 'special' || value === 'random' || value === 'exam';
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 176,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: palette.text,
  },
  headerSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    color: palette.muted,
  },
  heroCard: {
    padding: 18,
    gap: 12,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.greenTextSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMeta: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    color: palette.muted,
  },
  sessionCard: {
    padding: 18,
    gap: 14,
  },
  sessionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sessionProgress: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.green,
  },
  questionStem: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    color: palette.text,
  },
  tipText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.muted,
  },
  optionList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFFFF',
    padding: 14,
  },
  optionCardActive: {
    borderColor: '#BDD3EE',
    backgroundColor: '#F2F8FF',
  },
  optionCardLocked: {
    opacity: 0.7,
  },
  optionMark: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#B8C9DD',
    backgroundColor: '#FFFFFF',
  },
  optionMarkActive: {
    borderColor: palette.green,
    backgroundColor: palette.green,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: palette.text,
    fontWeight: '500',
  },
  optionTextActive: {
    fontWeight: '700',
  },
  feedbackBox: {
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  correctBox: {
    backgroundColor: palette.greenTint,
  },
  wrongBox: {
    backgroundColor: '#EEF4FF',
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
  },
  feedbackText: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.text,
    fontWeight: '500',
  },
  feedbackTip: {
    fontSize: 12,
    lineHeight: 18,
    color: palette.muted,
    fontWeight: '500',
  },
  resultCard: {
    padding: 18,
    gap: 12,
  },
  resultScore: {
    fontSize: 34,
    fontWeight: '800',
    color: palette.text,
    letterSpacing: -0.8,
  },
  resultText: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.muted,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
