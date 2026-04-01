import { useMemo, useState, type ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AppScreen,
  HeaderBlock,
  SectionTitle,
  SecondaryButton,
  Tag,
  WhiteCard,
  palette,
} from '@/components/huxuebao-ui';
import { useHuxuebao } from '@/contexts/huxuebao-context';

type PracticeModule = {
  key: string;
  title: string;
  subtitle: string;
  badge: string;
  sideLabel: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  tone: 'green' | 'peach' | 'light';
  onPress: () => void;
};

export default function PracticeScreen() {
  const router = useRouter();
  const { wrongQuestions, weakPoints, latestExam, aiScenarios, latestAiSession, directionCourses } =
    useHuxuebao();
  const [selectedScenarioId, setSelectedScenarioId] = useState(aiScenarios[0]?.id ?? '');
  const scenario =
    useMemo(
      () => aiScenarios.find((item) => item.id === selectedScenarioId) ?? aiScenarios[0],
      [aiScenarios, selectedScenarioId]
    );

  const modules: PracticeModule[] = [
    {
      key: 'chapter',
      title: '章节练习',
      subtitle: '跟着课程章节刷题，边学边练',
      badge: '立即开始',
      sideLabel: `${directionCourses.length} 门课`,
      icon: 'book-outline',
      tone: 'green',
      onPress: () => router.push({ pathname: '/practice-session', params: { mode: 'chapter' } }),
    },
    {
      key: 'special',
      title: '专项练习',
      subtitle: '按弱项和高频知识点集中突破',
      badge: '重点强化',
      sideLabel: `${weakPoints.length} 个弱点`,
      icon: 'medkit-outline',
      tone: 'light',
      onPress: () => router.push({ pathname: '/practice-session', params: { mode: 'special' } }),
    },
    {
      key: 'random',
      title: '随机模拟',
      subtitle: '打散出题，适合下班前自测',
      badge: '快速刷题',
      sideLabel: '4 题快测',
      icon: 'shuffle-outline',
      tone: 'light',
      onPress: () => router.push({ pathname: '/practice-session', params: { mode: 'random' } }),
    },
    {
      key: 'exam',
      title: '模拟考试',
      subtitle: '限时组卷，交卷后统一出分',
      badge: '限时出分',
      sideLabel: latestExam ? `最近 ${latestExam.score} 分` : '目标 85 分',
      icon: 'document-text-outline',
      tone: 'peach',
      onPress: () => router.push({ pathname: '/practice-session', params: { mode: 'exam' } }),
    },
    {
      key: 'wrong-book',
      title: '错题回刷',
      subtitle: '回看做错题目，逐个消灭易错点',
      badge: wrongQuestions.length > 0 ? '待回顾' : '已清空',
      sideLabel: `${wrongQuestions.length} 题`,
      icon: 'refresh-circle-outline',
      tone: wrongQuestions.length > 0 ? 'peach' : 'light',
      onPress: () => router.push('/wrong-book'),
    },
    {
      key: 'weak-points',
      title: '薄弱点强化',
      subtitle: '按正确率排序，优先补齐短板',
      badge: '自动分析',
      sideLabel: weakPoints[0] ? `${weakPoints[0].accuracy}%` : '等待生成',
      icon: 'analytics-outline',
      tone: 'green',
      onPress: () => router.push('/weak-points'),
    },
  ];

  return (
    <AppScreen>
      <HeaderBlock title="练习中心" subtitle="六种练习入口，按今天的学习目标直接开始" />

      <SectionTitle
        action={latestAiSession ? `${latestAiSession.accuracy}% 完成度` : '完整演练'}
        title="AI 情景演练"
      />
      <WhiteCard style={styles.aiCard}>
        <View style={styles.aiCardLeft}>
          <Tag text={`${scenario.department} · ${scenario.level}`} tone="peach" />
          <Text style={styles.aiTitle}>{scenario.title}</Text>
          <Text style={styles.aiText}>
            {latestAiSession ? latestAiSession.nextAction : scenario.objective}
          </Text>
          <Text style={styles.aiText}>评分方式：{scenario.scoreRule}</Text>
        </View>
        <Pressable
          onPress={() => router.push({ pathname: '/ai-drill', params: { scenarioId: scenario.id } })}
          style={({ pressed }) => [styles.aiCta, pressed && styles.modulePressed]}>
          <View style={styles.aiCtaIcon}>
            <Ionicons color="#FFFFFF" name="chatbubbles-outline" size={22} />
          </View>
          <Text style={styles.aiCtaLabel}>{latestAiSession ? '继续演练' : '立即开始'}</Text>
        </Pressable>
      </WhiteCard>

      <View style={styles.scenarioSwitch}>
        {aiScenarios.map((item) => {
          const active = item.id === scenario.id;

          return (
            <Pressable
              key={item.id}
              onPress={() => setSelectedScenarioId(item.id)}
              style={({ pressed }) => [
                styles.scenarioChip,
                active && styles.scenarioChipActive,
                pressed && styles.modulePressed,
              ]}>
              <Text style={[styles.scenarioChipText, active && styles.scenarioChipTextActive]}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle action="6 个入口" title="练习模块" />
      <View style={styles.moduleList}>
        {modules.map((item) => (
          <Pressable key={item.key} onPress={item.onPress}>
            {({ pressed }) => (
              <WhiteCard style={[styles.moduleCard, pressed && styles.modulePressed]}>
                <View style={styles.moduleMain}>
                  <Tag text={item.badge} tone={item.tone} />
                  <Text style={styles.moduleTitle}>{item.title}</Text>
                  <Text style={styles.moduleSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.moduleSide}>
                  <View style={styles.moduleIconWrap}>
                    <Ionicons color={palette.green} name={item.icon} size={24} />
                  </View>
                  <Text style={styles.moduleSideLabel}>{item.sideLabel}</Text>
                  <Ionicons color="#8FA5BC" name="chevron-forward" size={18} />
                </View>
              </WhiteCard>
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.switchRow}>
        {aiScenarios.map((item) => (
          <SecondaryButton
            key={item.id}
            onPress={() => router.push({ pathname: '/ai-drill', params: { scenarioId: item.id } })}
            text={item.department}
          />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  aiCard: {
    padding: 16,
    gap: 14,
  },
  aiCardLeft: {
    gap: 8,
  },
  aiTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: palette.text,
  },
  aiText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: palette.muted,
  },
  aiCta: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: palette.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  aiCtaIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCtaLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scenarioSwitch: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: -4,
  },
  scenarioChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scenarioChipActive: {
    borderColor: '#A9C7EB',
    backgroundColor: '#EAF4FF',
  },
  scenarioChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.muted,
  },
  scenarioChipTextActive: {
    color: palette.green,
  },
  moduleList: {
    gap: 12,
  },
  moduleCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    minHeight: 116,
  },
  moduleMain: {
    flex: 1,
    gap: 8,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.text,
    letterSpacing: -0.2,
  },
  moduleSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: palette.muted,
  },
  moduleSide: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    alignSelf: 'stretch',
    borderRadius: 16,
    backgroundColor: palette.greenTextSoft,
    paddingVertical: 14,
  },
  moduleIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleSideLabel: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    color: palette.green,
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  modulePressed: {
    opacity: 0.94,
  },
  switchRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
