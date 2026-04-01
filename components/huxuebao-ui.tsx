import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const palette = {
  bg: '#EEF6FF',
  card: '#FFFFFF',
  text: '#19365A',
  muted: '#7A95B2',
  line: '#D8E6F5',
  green: '#2B74E4',
  greenSoft: '#DCEAFF',
  greenTint: '#EAF4FF',
  greenTextSoft: '#F4F9FF',
  peach: '#EEF3FF',
  peachText: '#6688C2',
  shadow: '#2059A61A',
};

type AppScreenProps = PropsWithChildren<{
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}>;

export function AppScreen({ children, scroll = true, contentStyle }: AppScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          style={styles.fill}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.scrollContent, styles.fill, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function HeaderBlock({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.headerRow}>
      <View style={styles.fill}>
        <Text style={styles.pageTitle}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function IconCircle({ children }: PropsWithChildren) {
  return <View style={styles.iconCircle}>{children}</View>;
}

export function WhiteCard({
  children,
  style,
  bordered = false,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle>; bordered?: boolean }>) {
  return (
    <View style={[styles.card, bordered ? styles.cardBordered : styles.cardShadow, style]}>
      {children}
    </View>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

export function Tag({
  text,
  tone = 'green',
}: {
  text: string;
  tone?: 'green' | 'peach' | 'light';
}) {
  return (
    <View
      style={[
        styles.tag,
        tone === 'green' && styles.tagGreen,
        tone === 'peach' && styles.tagPeach,
        tone === 'light' && styles.tagLight,
      ]}>
      <Text
        style={[
          styles.tagText,
          tone === 'green' && styles.tagTextGreen,
          tone === 'peach' && styles.tagTextPeach,
          tone === 'light' && styles.tagTextLight,
        ]}>
        {text}
      </Text>
    </View>
  );
}

export function PrimaryButton({
  text,
  onPress,
  disabled = false,
}: {
  text: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.primaryButtonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}>
      <Text style={styles.primaryButtonText}>{text}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  text,
  onPress,
  selected = false,
}: {
  text: string;
  onPress?: () => void;
  selected?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondaryButton,
        selected && styles.secondaryButtonSelected,
        pressed && styles.buttonPressed,
      ]}>
      <Text style={[styles.secondaryButtonText, selected && styles.secondaryButtonTextSelected]}>{text}</Text>
    </Pressable>
  );
}

export function RowMeta({ left, right }: { left: string; right: ReactNode | string }) {
  return (
    <View style={styles.rowMeta}>
      <Text style={styles.metaText}>{left}</Text>
      {typeof right === 'string' ? <Text style={styles.metaText}>{right}</Text> : right}
    </View>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressValue, { width: `${Math.max(0, Math.min(value, 100))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  fill: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 176,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  pageTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 4,
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16324F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    borderRadius: 20,
    backgroundColor: palette.card,
    padding: 16,
    gap: 8,
  },
  cardShadow: {
    shadowColor: '#16324F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 4,
  },
  cardBordered: {
    borderWidth: 1,
    borderColor: palette.line,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionAction: {
    color: palette.green,
    fontSize: 12,
    fontWeight: '700',
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagGreen: {
    backgroundColor: palette.greenSoft,
  },
  tagPeach: {
    backgroundColor: palette.peach,
  },
  tagLight: {
    backgroundColor: palette.greenTextSoft,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tagTextGreen: {
    color: palette.green,
  },
  tagTextPeach: {
    color: palette.peachText,
  },
  tagTextLight: {
    color: '#4E78B5',
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: palette.green,
    minHeight: 54,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFFFF',
    minHeight: 54,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  secondaryButtonSelected: {
    borderColor: '#BDD3EE',
    backgroundColor: '#EAF3FF',
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButtonTextSelected: {
    color: palette.green,
  },
  buttonPressed: {
    opacity: 0.86,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  metaText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#DCE7F3',
    overflow: 'hidden',
  },
  progressValue: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.green,
  },
});
