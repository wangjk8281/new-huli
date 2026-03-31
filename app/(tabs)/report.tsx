import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

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
import { useHuxuebao } from '@/contexts/huxuebao-context';

export default function ReportScreen() {
  const router = useRouter();
  const {
    user,
    dailyGoalMinutes,
    setDailyGoalMinutes,
    streakDays,
    weakPoints,
    latestExam,
    latestAiSession,
    lessonCompletionCount,
    activeDirection,
    logout,
  } = useHuxuebao();

  const studyCompletion = Math.min(100, lessonCompletionCount * 20);
  const certificateUnlocked = (latestExam?.score ?? 0) >= 85;

  return (
    <AppScreen>
      <HeaderBlock title="我的报告" subtitle="学习情况、证书状态和每日计划" />

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>本周综合评分</Text>
        <Text style={styles.heroScore}>{latestExam?.score ?? 0} 分</Text>
        <Text style={styles.heroDesc}>
          当前路径：{activeDirection?.name ?? '未选择'} · 连续打卡 {streakDays} 天
        </Text>
      </View>

      <WhiteCard style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.slice(0, 1) ?? '护'}</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileMeta}>
              {user?.hospital} · {user?.department} · {user?.title}
            </Text>
          </View>
        </View>
      </WhiteCard>

      <View style={styles.metricRow}>
        <WhiteCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>已学内容</Text>
          <Text style={styles.metricValue}>{lessonCompletionCount} 节</Text>
        </WhiteCard>
        <WhiteCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>待加强</Text>
          <Text style={styles.metricValue}>{weakPoints.filter((item) => item.accuracy < 60).length} 项</Text>
        </WhiteCard>
      </View>

      <SectionTitle title="学习报告" />
      <WhiteCard style={styles.card}>
        <Text style={styles.cardTitle}>阶段完成率</Text>
        <ProgressBar value={studyCompletion} />
        <Text style={styles.cardText}>
          当前已完成 {lessonCompletionCount} 节核心内容，最近模考 {latestExam?.correctCount ?? 0} /{' '}
          {latestExam?.totalCount ?? 0} 题答对。
        </Text>
      </WhiteCard>

      <SectionTitle title="证书状态" />
      <WhiteCard style={styles.card}>
        <Tag text={certificateUnlocked ? '已达成' : '待解锁'} tone={certificateUnlocked ? 'green' : 'peach'} />
        <Text style={styles.cardTitle}>ICU 基础护理阶段证书</Text>
        <Text style={styles.cardText}>
          {certificateUnlocked
            ? '已满足基础领取条件，可用于下载、分享和编码验真展示。'
            : '需要模考达到 85 分后解锁证书。'}
        </Text>
      </WhiteCard>

      <SectionTitle title="AI 演练表现" />
      <WhiteCard style={styles.card}>
        <Tag text={latestAiSession ? '最新结果' : '待开始'} tone={latestAiSession ? 'green' : 'peach'} />
        <Text style={styles.cardTitle}>
          {latestAiSession ? `${latestAiSession.title} · ${latestAiSession.score} 分` : '还没有 AI 演练记录'}
        </Text>
        <Text style={styles.cardText}>
          {latestAiSession
            ? latestAiSession.nextAction
            : '建议先完成 1 次 AI 情景演练，系统会把结果同步到这里。'}
        </Text>
        <PrimaryButton onPress={() => router.push('/ai-drill')} text={latestAiSession ? '再练一次' : '去开始'} />
      </WhiteCard>

      <SectionTitle title="打卡与学习计划" />
      <WhiteCard style={styles.card}>
        <Text style={styles.cardTitle}>每日学习目标</Text>
        <View style={styles.goalRow}>
          {[20, 30, 45].map((minute) => {
            const active = dailyGoalMinutes === minute;

            return (
              <SecondaryButton
                key={minute}
                onPress={() => setDailyGoalMinutes(minute)}
                selected={active}
                text={active ? `${minute} 分钟` : `${minute} 分钟`}
              />
            );
          })}
        </View>
        <Text style={styles.cardText}>系统会按你的目标，在首页优先推荐适合今天完成的课程和练习。</Text>
      </WhiteCard>

      <View style={styles.actionRow}>
        <PrimaryButton onPress={() => router.push('/practice')} text="继续模考" />
        <SecondaryButton
          onPress={() => {
            logout();
            router.replace('/login');
          }}
          text="退出账号"
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 20,
    padding: 20,
    gap: 10,
    backgroundColor: palette.green,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EAF7EE',
  },
  heroScore: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroDesc: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    color: '#F3FBF6',
  },
  profileCard: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: palette.greenTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.green,
  },
  profileText: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  profileMeta: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.muted,
    fontWeight: '500',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    gap: 6,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: palette.muted,
  },
  metricValue: {
    fontSize: 30,
    fontWeight: '700',
    color: palette.text,
  },
  card: {
    padding: 18,
    gap: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.text,
  },
  cardText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    color: palette.muted,
  },
  goalRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
