import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppScreen, PrimaryButton, SecondaryButton, Tag, WhiteCard, palette } from '@/components/huxuebao-ui';
import { useHuxuebao } from '@/contexts/huxuebao-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useHuxuebao();
  const [name, setName] = useState('林护士');

  const handleLogin = () => {
    login(name.trim() || '林护士');
    router.replace('/');
  };

  return (
    <AppScreen contentStyle={styles.content}>
      <View style={styles.hero}>
        <Tag text="护士端 MVP" tone="light" />
        <Text style={styles.title}>护学宝</Text>
        <Text style={styles.subtitle}>系统化备考 + AI 情景模拟，学完即练，练完即考。</Text>
      </View>

      <WhiteCard style={styles.card}>
        <Text style={styles.label}>姓名</Text>
        <TextInput
          onChangeText={setName}
          placeholder="请输入护士姓名"
          placeholderTextColor="#8CA1B9"
          style={styles.input}
          value={name}
        />

        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>演示账号信息</Text>
          <Text style={styles.infoText}>医院：市一医院</Text>
          <Text style={styles.infoText}>科室：ICU</Text>
          <Text style={styles.infoText}>岗位：主管护师</Text>
        </View>

        <PrimaryButton onPress={handleLogin} text="进入护学宝" />
        <SecondaryButton onPress={() => setName('林护士')} text="恢复默认账号" />
      </WhiteCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 32,
    justifyContent: 'center',
  },
  hero: {
    gap: 16,
    paddingVertical: 10,
  },
  title: {
    fontSize: 52,
    fontWeight: '800',
    color: palette.text,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 19,
    lineHeight: 30,
    color: palette.muted,
    fontWeight: '600',
  },
  card: {
    padding: 24,
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  input: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 20,
    fontWeight: '600',
    color: palette.text,
  },
  infoBlock: {
    borderRadius: 22,
    backgroundColor: palette.greenTextSoft,
    padding: 18,
    gap: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: palette.muted,
    fontWeight: '600',
  },
});
