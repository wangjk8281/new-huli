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
    paddingTop: 32,
    gap: 18,
  },
  header: {
    gap: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    color: palette.text,
    letterSpacing: -0.9,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: palette.muted,
    fontWeight: '600',
  },
  list: {
    gap: 12,
  },
  card: {
    padding: 22,
    gap: 12,
  },
  cardActive: {
    backgroundColor: '#EEF6FF',
    borderWidth: 1,
    borderColor: '#BDD3EE',
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
    fontSize: 21,
    fontWeight: '800',
    color: palette.text,
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: palette.muted,
    fontWeight: '600',
  },
  target: {
    fontSize: 14,
    lineHeight: 21,
    color: palette.text,
    fontWeight: '600',
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
    borderColor: '#B8C9DD',
    backgroundColor: '#FFFFFF',
  },
  radioActive: {
    borderColor: palette.green,
    backgroundColor: palette.green,
  },
});
