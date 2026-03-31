import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { AppScreen, PrimaryButton, Tag, WhiteCard, palette } from '@/components/huxuebao-ui';
import { useHuxuebao } from '@/contexts/huxuebao-context';

export default function DirectionSelectScreen() {
  const router = useRouter();
  const { directions, selectedDirectionId, selectDirection } = useHuxuebao();

  return (
    <AppScreen contentStyle={styles.content}>
      <View style={styles.header}>
        <Tag text="学习方向选择" tone="green" />
        <Text style={styles.title}>先确认你的本轮学习主线</Text>
        <Text style={styles.subtitle}>首次进入可按科室和目标选择路径，后续首页会自动推荐课程和练习。</Text>
      </View>

      <View style={styles.list}>
        {directions.map((direction) => {
          const active = selectedDirectionId === direction.id;

          return (
            <Pressable key={direction.id} onPress={() => selectDirection(direction.id)}>
              <WhiteCard bordered={!active} style={[styles.card, active && styles.cardActive]}>
                <View style={styles.cardTop}>
                  <View style={styles.fill}>
                    <Text style={styles.cardTitle}>{direction.name}</Text>
                    <Text style={styles.cardSubtitle}>{direction.subtitle}</Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioActive]} />
                </View>
                <Text style={styles.target}>{direction.target}</Text>
                <View style={styles.tagRow}>
                  {direction.tags.map((tag) => (
                    <Tag key={tag} text={tag} tone={active ? 'light' : 'peach'} />
                  ))}
                </View>
              </WhiteCard>
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton
        disabled={!selectedDirectionId}
        onPress={() => router.replace('/')}
        text="开始学习"
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 28,
    gap: 16,
  },
  header: {
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 34,
    color: palette.text,
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: palette.muted,
    fontWeight: '500',
  },
  list: {
    gap: 12,
  },
  card: {
    padding: 18,
    gap: 10,
  },
  cardActive: {
    backgroundColor: '#F2FBF5',
    borderWidth: 1,
    borderColor: '#CFE8D8',
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  fill: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: palette.muted,
    fontWeight: '500',
  },
  target: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.text,
    fontWeight: '500',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#D7D6D2',
    backgroundColor: '#FFFFFF',
  },
  radioActive: {
    borderColor: palette.green,
    backgroundColor: palette.green,
  },
});
