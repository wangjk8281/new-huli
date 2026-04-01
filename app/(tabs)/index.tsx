import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  AppScreen,
  HeaderBlock,
  IconCircle,
  PrimaryButton,
  ProgressBar,
  RowMeta,
  SectionTitle,
  SecondaryButton,
  Tag,
  WhiteCard,
  palette,
} from '@/components/huxuebao-ui';
import { useHuxuebao } from '@/contexts/huxuebao-context';

export default function HomeScreen() {
  const router = useRouter();
  const {
    user,
    activeDirection,
    directionCourses,
    weakPoints,
    streakDays,
    dailyGoalMinutes,
    latestExam,
    aiScenarios,
    latestAiSession,
  } =
    useHuxuebao();

  const recommendedCourse = directionCourses[0];
  const weakPoint = weakPoints[0];

  return (
    <AppScreen>
      <HeaderBlock
        title={`早安，${user?.name ?? '护士'}`}
        subtitle={`${activeDirection?.name ?? '当前路径'} · 今日建议先学 1 节课，再练 6 题`}
        right={
          <IconCircle>
            <Feather color={palette.text} name="bell" size={18} />
          </IconCircle>
        }
      />

      <View style={styles.hero}>
        <Tag text="今日学习主线" tone="light" />
        <Text style={styles.heroTitle}>{recommendedCourse?.title ?? '开始你的学习主线'}</Text>
        <Text style={styles.heroDesc}>{recommendedCourse?.description}</Text>
        <View style={styles.heroMetaRow}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{dailyGoalMinutes} 分钟目标</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>连续打卡 {streakDays} 天</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <WhiteCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>当前方向</Text>
          <Text style={styles.metricValue}>{activeDirection?.name ?? '未选择'}</Text>
        </WhiteCard>
        <WhiteCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>最近模考</Text>
          <Text style={styles.metricValue}>{latestExam ? `${latestExam.score} 分` : '未参加'}</Text>
        </WhiteCard>
      </View>

      <SectionTitle action="去学习" title="推荐课程" />

      <WhiteCard style={styles.card}>
        <Tag text={recommendedCourse?.subtitle ?? '课程'} tone="green" />
        <Text style={styles.cardTitle}>{recommendedCourse?.title}</Text>
        <Text style={styles.cardDesc}>{recommendedCourse?.completionHint}</Text>
        <RowMeta
          left={`${recommendedCourse?.lessons.length ?? 0} 节内容`}
          right={<PrimaryButton onPress={() => router.push('/course')} text="继续学习" />}
        />
      </WhiteCard>

      <SectionTitle action="去练习" title="今日待加强" />

      <WhiteCard style={styles.card}>
        <Text style={styles.cardTitle}>{weakPoint?.knowledgePoint ?? '继续做题形成画像'}</Text>
        <Text style={styles.cardDesc}>
          {weakPoint ? `当前正确率 ${weakPoint.accuracy}% · ${weakPoint.recommendation}` : '完成练习后这里会自动出现弱项回顾。'}
        </Text>
        {weakPoint ? <ProgressBar value={weakPoint.accuracy} /> : null}
        <View style={styles.buttonRow}>
          <PrimaryButton onPress={() => router.push('/practice')} text="立即刷题" />
          <SecondaryButton onPress={() => router.push('/course')} text="回看课程" />
        </View>
      </WhiteCard>

      <SectionTitle action={latestAiSession ? `最近 ${latestAiSession.score} 分` : '现在可用'} title="AI 情景演练" />

      <WhiteCard style={styles.card}>
        <Tag text={`${aiScenarios[0]?.department} · ${aiScenarios[0]?.level}`} tone="peach" />
        <Text style={styles.cardTitle}>{aiScenarios[0]?.title}</Text>
        <Text style={styles.cardDesc}>{latestAiSession ? latestAiSession.nextAction : aiScenarios[0]?.patient}</Text>
        <View style={styles.aiMetaRow}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>{aiScenarios[0]?.steps.length ?? 0} 轮演练</Text>
          </View>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>通过线 {aiScenarios[0]?.passingScore ?? 0} 分</Text>
          </View>
        </View>
        <PrimaryButton onPress={() => router.push('/ai-drill')} text={latestAiSession ? '继续 AI 演练' : '开始 AI 演练'} />
        <Text style={styles.tip}>仅供学习参考，不构成临床诊疗建议。</Text>
      </WhiteCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 22,
    padding: 18,
    gap: 10,
    backgroundColor: palette.green,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  heroDesc: {
    color: '#EAF4FF',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  heroBadge: {
    borderRadius: 999,
    backgroundColor: '#FFFFFF22',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroBadgeText: {
    color: '#EAF4FF',
    fontSize: 12,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: palette.muted,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.text,
    letterSpacing: -0.3,
  },
  card: {
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.text,
    letterSpacing: -0.2,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.muted,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tip: {
    fontSize: 12,
    lineHeight: 17,
    color: palette.muted,
    fontWeight: '600',
  },
  aiMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  aiBadge: {
    borderRadius: 999,
    backgroundColor: palette.greenTint,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.green,
  },
});
