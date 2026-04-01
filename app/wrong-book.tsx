import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SecondaryButton, Tag, WhiteCard, palette } from '@/components/huxuebao-ui';
import { useHuxuebao } from '@/contexts/huxuebao-context';

export default function WrongBookScreen() {
  const router = useRouter();
  const { wrongQuestions, markWrongQuestionMastered } = useHuxuebao();

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons color={palette.text} name="arrow-back" size={22} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>错题回刷</Text>
            <Text style={styles.headerSubtitle}>回看做错题目，逐个消灭易错点</Text>
          </View>
        </View>

        {wrongQuestions.length === 0 ? (
          <WhiteCard style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>当前没有待回顾错题</Text>
            <Text style={styles.emptyText}>继续做题后，这里会自动更新需要回看的题目。</Text>
          </WhiteCard>
        ) : (
          wrongQuestions.map((question) => (
            <WhiteCard key={question.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Tag text={question.knowledgePoint} tone="peach" />
                <Tag text={question.type === 'multiple' ? '多选题' : '单选题'} tone="light" />
              </View>
              <Text style={styles.title}>{question.stem}</Text>
              <Text style={styles.text}>{question.explanation}</Text>
              <Text style={styles.tip}>{question.recommendation}</Text>
              <SecondaryButton onPress={() => markWrongQuestionMastered(question.id)} text="标记已掌握" />
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
    gap: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: palette.text,
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
