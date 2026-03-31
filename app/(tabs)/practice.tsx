import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AppScreen,
  HeaderBlock,
  PrimaryButton,
  ProgressBar,
  SectionTitle,
  SecondaryButton,
  Tag,
  WhiteCard,
  palette,
} from '@/components/huxuebao-ui';
import { type PracticeMode, type Question } from '@/data/huxuebao-data';
import { useHuxuebao } from '@/contexts/huxuebao-context';

type SessionState = {
  mode: PracticeMode;
  questions: Question[];
  index: number;
  answerMap: Record<string, string[]>;
  submittedQuestionIds: string[];
  correctCount: number;
  reviewingQuestionId?: string;
};

const modeConfig: {
  mode: PracticeMode;
  title: string;
  subtitle: string;
}[] = [
  { mode: 'chapter', title: '章节练习', subtitle: '跟着课程章节刷题，边学边练' },
  { mode: 'special', title: '专项练习', subtitle: '按弱项和高频知识点集中突破' },
  { mode: 'random', title: '随机模拟', subtitle: '打散出题，适合下班前自测' },
  { mode: 'exam', title: '模拟考试', subtitle: '限时组卷，交卷后统一出分' },
];

export default function PracticeScreen() {
  const {
    directionCourses,
    questions,
    examTemplates,
    submitAnswer,
    wrongQuestions,
    weakPoints,
    markWrongQuestionMastered,
    saveExamResult,
    latestExam,
    aiScenarios,
  } = useHuxuebao();
  const [session, setSession] = useState<SessionState | null>(null);
  const [lastFeedback, setLastFeedback] = useState<{ correct: boolean; explanation: string; recommendation: string } | null>(
    null
  );

  const questionPool = useMemo(
    () =>
      questions.filter((question) =>
        directionCourses.some((course) => course.id === question.courseId)
      ),
    [directionCourses, questions]
  );

  const currentQuestion = session ? session.questions[session.index] : null;
  const selectedIds = currentQuestion ? session?.answerMap[currentQuestion.id] ?? [] : [];
  const examTemplate = examTemplates[0];

  const buildSession = (mode: PracticeMode) => {
    let pool: Question[] = [];

    if (mode === 'exam') {
      pool = examTemplate.questionIds
        .map((questionId) => questionPool.find((question) => question.id === questionId))
        .filter(Boolean) as Question[];
    } else {
      pool = questionPool.filter((question) => question.modes.includes(mode));
      if (mode === 'special' && weakPoints[0]) {
        pool = [
          ...pool.filter((question) => question.knowledgePoint === weakPoints[0]?.knowledgePoint),
          ...pool.filter((question) => question.knowledgePoint !== weakPoints[0]?.knowledgePoint),
        ];
      }
      pool = pool.slice(0, 4);
    }

    setLastFeedback(null);
    setSession({
      mode,
      questions: pool,
      index: 0,
      answerMap: {},
      submittedQuestionIds: [],
      correctCount: 0,
      reviewingQuestionId: undefined,
    });
  };

  const updateSelection = (optionId: string) => {
    if (!session || !currentQuestion) {
      return;
    }

    if (session.reviewingQuestionId === currentQuestion.id) {
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

  const sessionFinished =
    !!session && session.submittedQuestionIds.length === session.questions.length;

  return (
    <AppScreen>
      <HeaderBlock title="练习中心" subtitle="章节练习、错题回刷、薄弱点强化和模拟考试" />

      <View style={styles.modeList}>
        {modeConfig.map((item) => (
          <Pressable key={item.mode} onPress={() => buildSession(item.mode)}>
            <WhiteCard bordered={session?.mode !== item.mode} style={styles.modeCard}>
              <Tag text={item.mode === 'exam' ? '限时出分' : '立即开始'} tone={item.mode === 'exam' ? 'peach' : 'green'} />
              <Text style={styles.modeTitle}>{item.title}</Text>
              <Text style={styles.modeSubtitle}>{item.subtitle}</Text>
            </WhiteCard>
          </Pressable>
        ))}
      </View>

      {currentQuestion && session && !sessionFinished ? (
        <WhiteCard style={styles.sessionCard}>
          <View style={styles.sessionHead}>
            <Tag text={modeConfig.find((item) => item.mode === session.mode)?.title ?? '练习'} tone="green" />
            <Text style={styles.sessionProgress}>
              第 {session.index + 1} / {session.questions.length} 题
            </Text>
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

      {sessionFinished && session ? (
        <WhiteCard style={styles.resultCard}>
          <Tag text={session.mode === 'exam' ? '模拟考试结果' : '本轮练习完成'} tone="light" />
          <Text style={styles.resultScore}>
            {session.mode === 'exam'
              ? `${Math.round((session.correctCount / session.questions.length) * 100)} 分`
              : `答对 ${session.correctCount} / ${session.questions.length} 题`}
          </Text>
          <Text style={styles.resultText}>
            {session.mode === 'exam'
              ? `最新模考 ${latestExam?.score ?? 0} 分，目标证书：${examTemplate.targetCertificate}`
              : '系统已同步更新错题本和薄弱点分析。'}
          </Text>
          <View style={styles.buttonRow}>
            <PrimaryButton onPress={() => setSession(null)} text="返回练习中心" />
            <SecondaryButton onPress={() => buildSession(session.mode)} text="再来一轮" />
          </View>
        </WhiteCard>
      ) : null}

      <SectionTitle action={`${wrongQuestions.length} 题`} title="错题本" />
      <View style={styles.stack}>
        {wrongQuestions.length === 0 ? (
          <WhiteCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>当前没有待回顾错题，继续做题会自动更新这里。</Text>
          </WhiteCard>
        ) : (
          wrongQuestions.slice(0, 3).map((question) => (
            <WhiteCard key={question.id} style={styles.listCard}>
              <Text style={styles.listTitle}>{question.stem}</Text>
              <Text style={styles.listText}>{question.explanation}</Text>
              <View style={styles.buttonRow}>
                <Tag text={question.knowledgePoint} tone="peach" />
                <SecondaryButton onPress={() => markWrongQuestionMastered(question.id)} text="标记已掌握" />
              </View>
            </WhiteCard>
          ))
        )}
      </View>

      <SectionTitle action="自动生成" title="薄弱点分析" />
      <View style={styles.stack}>
        {weakPoints.slice(0, 3).map((weakPoint) => (
          <WhiteCard key={weakPoint.knowledgePoint} style={styles.listCard}>
            <View style={styles.sessionHead}>
              <Text style={styles.listTitle}>{weakPoint.knowledgePoint}</Text>
              <Text style={styles.sessionProgress}>{weakPoint.accuracy}%</Text>
            </View>
            <ProgressBar value={weakPoint.accuracy} />
            <Text style={styles.listText}>
              连续答题 {weakPoint.total} 次，答对 {weakPoint.correct} 次。建议：{weakPoint.recommendation}
            </Text>
          </WhiteCard>
        ))}
      </View>

      <SectionTitle action="V1.0" title="AI 情景演练预告" />
      <WhiteCard style={styles.listCard}>
        <Tag text={`${aiScenarios[0].department} · ${aiScenarios[0].level}`} tone="peach" />
        <Text style={styles.listTitle}>{aiScenarios[0].title}</Text>
        <Text style={styles.listText}>{aiScenarios[0].patient}</Text>
        <Text style={styles.listText}>评分方式：{aiScenarios[0].scoreRule}</Text>
      </WhiteCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  modeList: {
    gap: 12,
  },
  modeCard: {
    padding: 16,
    gap: 8,
  },
  modeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.text,
  },
  modeSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.muted,
    fontWeight: '500',
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
    borderColor: '#CFE8D8',
    backgroundColor: '#F4FBF6',
  },
  optionCardLocked: {
    opacity: 0.7,
  },
  optionMark: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#CAC9C5',
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
    backgroundColor: '#FFF5EE',
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
  stack: {
    gap: 12,
  },
  listCard: {
    padding: 16,
    gap: 10,
  },
  listTitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    color: palette.text,
  },
  listText: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.muted,
    fontWeight: '500',
  },
  emptyCard: {
    padding: 16,
  },
  emptyText: {
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
