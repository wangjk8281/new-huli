import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
          placeholderTextColor="#A7A6A3"
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

      <WhiteCard style={styles.card}>
        <Text style={styles.infoTitle}>本次已落地的主流程</Text>
        <View style={styles.checkList}>
          {['登录', '学习方向选择', '课程学习', '刷题练习', '错题与薄弱点', '模拟考试', '学习报告'].map(
            (item) => (
              <Pressable key={item} style={styles.checkItem}>
                <View style={styles.dot} />
                <Text style={styles.checkText}>{item}</Text>
              </Pressable>
            )
          )}
        </View>
      </WhiteCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 28,
    justifyContent: 'center',
  },
  hero: {
    gap: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: palette.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: palette.muted,
    fontWeight: '500',
  },
  card: {
    padding: 18,
    gap: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.text,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: palette.text,
  },
  infoBlock: {
    borderRadius: 16,
    backgroundColor: palette.greenTint,
    padding: 14,
    gap: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.muted,
    fontWeight: '500',
  },
  checkList: {
    gap: 10,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: palette.green,
  },
  checkText: {
    fontSize: 14,
    color: palette.text,
    fontWeight: '600',
  },
});
