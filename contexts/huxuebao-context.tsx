import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import {
  aiScenarios,
  courses,
  directions,
  examTemplates,
  questions,
  seedAttempts,
  type PracticeMode,
} from '@/data/huxuebao-data';

type UserProfile = {
  name: string;
  hospital: string;
  department: string;
  title: string;
};

type PracticeAttempt = {
  questionId: string;
  selectedIds: string[];
  source: PracticeMode;
  correct: boolean;
};

type ExamRecord = {
  examId: string;
  score: number;
  completedAt: string;
  correctCount: number;
  totalCount: number;
};

type WeakPoint = {
  knowledgePoint: string;
  total: number;
  correct: number;
  accuracy: number;
  recommendation: string;
};

type AiSessionRecord = {
  scenarioId: string;
  title: string;
  department: string;
  level: string;
  score: number;
  maxScore: number;
  accuracy: number;
  completedAt: string;
  strengths: string[];
  misses: string[];
  nextAction: string;
};

type HuxuebaoContextValue = {
  user: UserProfile | null;
  directions: typeof directions;
  selectedDirectionId: string | null;
  activeDirection: (typeof directions)[number] | null;
  courses: typeof courses;
  directionCourses: typeof courses;
  activeCourse: (typeof courses)[number] | null;
  completedLessonIds: string[];
  lessonCompletionCount: number;
  attempts: PracticeAttempt[];
  wrongQuestions: typeof questions;
  weakPoints: WeakPoint[];
  examRecords: ExamRecord[];
  latestExam: ExamRecord | null;
  dailyGoalMinutes: number;
  streakDays: number;
  aiScenarios: typeof aiScenarios;
  aiSessionRecords: AiSessionRecord[];
  latestAiSession: AiSessionRecord | null;
  login: (name?: string) => void;
  logout: () => void;
  selectDirection: (directionId: string) => void;
  completeLesson: (lessonId: string) => void;
  submitAnswer: (questionId: string, selectedIds: string[], source: PracticeMode) => boolean;
  markWrongQuestionMastered: (questionId: string) => void;
  saveExamResult: (examId: string, correctCount: number, totalCount: number) => void;
  saveAiSession: (record: Omit<AiSessionRecord, 'accuracy' | 'completedAt'>) => void;
  setDailyGoalMinutes: (minutes: number) => void;
  questions: typeof questions;
  examTemplates: typeof examTemplates;
};

const HuxuebaoContext = createContext<HuxuebaoContextValue | null>(null);

export function HuxuebaoProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedDirectionId, setSelectedDirectionId] = useState<string | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['ventilator-video', 'shock-video']);
  const [attempts, setAttempts] = useState<PracticeAttempt[]>(seedAttempts);
  const [masteredWrongIds, setMasteredWrongIds] = useState<string[]>([]);
  const [examRecords, setExamRecords] = useState<ExamRecord[]>([
    {
      examId: 'exam-icu-basic',
      score: 84,
      completedAt: '2026-03-30 19:40',
      correctCount: 4,
      totalCount: 5,
    },
  ]);
  const [aiSessionRecords, setAiSessionRecords] = useState<AiSessionRecord[]>([]);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(30);
  const [streakDays] = useState(21);

  const activeDirection = useMemo(
    () => directions.find((direction) => direction.id === selectedDirectionId) ?? null,
    [selectedDirectionId]
  );

  const directionCourses = useMemo(() => {
    if (!selectedDirectionId) {
      return courses;
    }

    return courses.filter((course) => course.directionId === selectedDirectionId);
  }, [selectedDirectionId]);

  const activeCourse = directionCourses[0] ?? courses[0] ?? null;

  const wrongQuestions = useMemo(() => {
    const wrongIds = new Set(
      attempts
        .filter((attempt) => !attempt.correct && !masteredWrongIds.includes(attempt.questionId))
        .map((attempt) => attempt.questionId)
    );

    return questions.filter((question) => wrongIds.has(question.id));
  }, [attempts, masteredWrongIds]);

  const weakPoints = useMemo(() => {
    const stats = new Map<
      string,
      {
        total: number;
        correct: number;
        recommendation: string;
      }
    >();

    for (const attempt of attempts) {
      const question = questions.find((item) => item.id === attempt.questionId);

      if (!question) {
        continue;
      }

      const current = stats.get(question.knowledgePoint) ?? {
        total: 0,
        correct: 0,
        recommendation: question.recommendation,
      };

      current.total += 1;
      current.correct += attempt.correct ? 1 : 0;
      current.recommendation = question.recommendation;
      stats.set(question.knowledgePoint, current);
    }

    return Array.from(stats.entries())
      .map(([knowledgePoint, value]) => ({
        knowledgePoint,
        total: value.total,
        correct: value.correct,
        accuracy: Math.round((value.correct / value.total) * 100),
        recommendation: value.recommendation,
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [attempts]);

  const latestExam = examRecords[0] ?? null;
  const latestAiSession = aiSessionRecords[0] ?? null;

  const lessonCompletionCount = completedLessonIds.length;

  const value = useMemo<HuxuebaoContextValue>(
    () => ({
      user,
      directions,
      selectedDirectionId,
      activeDirection,
      courses,
      directionCourses,
      activeCourse,
      completedLessonIds,
      lessonCompletionCount,
      attempts,
      wrongQuestions,
      weakPoints,
      examRecords,
      latestExam,
      dailyGoalMinutes,
      streakDays,
      aiScenarios,
      aiSessionRecords,
      latestAiSession,
      login: (name = '林护士') => {
        setUser({
          name,
          hospital: '市一医院',
          department: 'ICU',
          title: '主管护师',
        });
      },
      logout: () => {
        setUser(null);
        setSelectedDirectionId(null);
      },
      selectDirection: (directionId: string) => {
        setSelectedDirectionId(directionId);
      },
      completeLesson: (lessonId: string) => {
        setCompletedLessonIds((current) =>
          current.includes(lessonId) ? current : [...current, lessonId]
        );
      },
      submitAnswer: (questionId: string, selectedIds: string[], source: PracticeMode) => {
        const question = questions.find((item) => item.id === questionId);

        if (!question) {
          return false;
        }

        const isCorrect =
          selectedIds.length === question.answerIds.length &&
          selectedIds.every((id) => question.answerIds.includes(id));

        setAttempts((current) => [
          {
            questionId,
            selectedIds,
            source,
            correct: isCorrect,
          },
          ...current,
        ]);

        return isCorrect;
      },
      markWrongQuestionMastered: (questionId: string) => {
        setMasteredWrongIds((current) =>
          current.includes(questionId) ? current : [...current, questionId]
        );
      },
      saveExamResult: (examId: string, correctCount: number, totalCount: number) => {
        const score = Math.round((correctCount / totalCount) * 100);

        setExamRecords((current) => [
          {
            examId,
            score,
            completedAt: new Date().toLocaleString('zh-CN', {
              hour12: false,
            }),
            correctCount,
            totalCount,
          },
          ...current,
        ]);
      },
      saveAiSession: (record) => {
        setAiSessionRecords((current) => [
          {
            ...record,
            accuracy: Math.round((record.score / record.maxScore) * 100),
            completedAt: new Date().toLocaleString('zh-CN', {
              hour12: false,
            }),
          },
          ...current,
        ]);
      },
      setDailyGoalMinutes,
      questions,
      examTemplates,
    }),
    [
      activeCourse,
      activeDirection,
      attempts,
      aiSessionRecords,
      completedLessonIds,
      dailyGoalMinutes,
      directionCourses,
      examRecords,
      latestAiSession,
      latestExam,
      lessonCompletionCount,
      selectedDirectionId,
      streakDays,
      user,
      weakPoints,
      wrongQuestions,
    ]
  );

  return <HuxuebaoContext.Provider value={value}>{children}</HuxuebaoContext.Provider>;
}

export function useHuxuebao() {
  const context = useContext(HuxuebaoContext);

  if (!context) {
    throw new Error('useHuxuebao must be used within HuxuebaoProvider');
  }

  return context;
}
