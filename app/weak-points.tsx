import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressBar, Tag, WhiteCard, palette } from '@/components/huxuebao-ui';
import { useHuxuebao } from '@/contexts/huxuebao-context';

export default function WeakPointsScreen() {
  const router = useRouter();
  const { weakPoints } = useHuxuebao();

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons color={palette.text} name="arrow-back" size={22} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>薄弱点强化</Text>
            <Text style={styles.headerSubtitle}>按正确率排序，优先补齐短板</Text>
          </View>
        </View>

        {weakPoints.length === 0 ? (
          <WhiteCard style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>还没有生成薄弱点</Text>
            <Text style={styles.emptyText}>完成几轮练习后，系统会自动把准确率最低的知识点列出来。</Text>
          </WhiteCard>
        ) : (
          weakPoints.map((weakPoint, index) => (
            <WhiteCard key={weakPoint.knowledgePoint} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardLeft}>
                  <Tag text={index === 0 ? '优先补齐' : '继续提升'} tone={index === 0 ? 'peach' : 'light'} />
                  <Text style={styles.title}>{weakPoint.knowledgePoint}</Text>
                </View>
                <Text style={styles.score}>{weakPoint.accuracy}%</Text>
              </View>
              <ProgressBar value={weakPoint.accuracy} />
              <Text style={styles.text}>
                连续答题 {weakPoint.total} 次，答对 {weakPoint.correct} 次。
              </Text>
              <Text style={styles.tip}>{weakPoint.recommendation}</Text>
            </WhiteCard>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
    gap: 16,
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
  card: {
    padding: 18,
    gap: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardLeft: {
    flex: 1,
    gap: 10,
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    color: palette.text,
  },
  score: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.green,
  },
  text: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    color: palette.muted,
  },
  tip: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: palette.green,
  },
  emptyCard: {
    padding: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    color: palette.muted,
  },
});
