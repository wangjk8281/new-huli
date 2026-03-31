import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const palette = {
  bg: '#F5F4F1',
  card: '#FFFFFF',
  text: '#1A1918',
  muted: '#6D6C6A',
  line: '#E5E4E1',
  green: '#3D8A5A',
  greenSoft: '#C8F0D8',
  greenTint: '#E7F4EB',
  greenTextSoft: '#EAF7EE',
  peach: '#FFF6F1',
  peachText: '#D89575',
  shadow: '#1A191808',
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
    paddingHorizontal: 24,
    paddingBottom: 176,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  pageTitle: {
    color: palette.text,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 4,
    color: palette.muted,
    fontSize: 13,
    fontWeight: '500',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A1918',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    borderRadius: 16,
    backgroundColor: palette.card,
    padding: 16,
    gap: 8,
  },
  cardShadow: {
    shadowColor: '#1A1918',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
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
    fontWeight: '700',
  },
  sectionAction: {
    color: palette.green,
    fontSize: 12,
    fontWeight: '600',
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagGreen: {
    backgroundColor: palette.greenSoft,
  },
  tagPeach: {
    backgroundColor: '#FFF0E8',
  },
  tagLight: {
    backgroundColor: '#EAF7EE',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tagTextGreen: {
    color: palette.green,
  },
  tagTextPeach: {
    color: palette.peachText,
  },
  tagTextLight: {
    color: '#5C946F',
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: palette.green,
    minHeight: 68,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFFFF',
    minHeight: 68,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  secondaryButtonSelected: {
    borderColor: '#CFE8D8',
    backgroundColor: '#EEF9F1',
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 18,
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
    fontWeight: '500',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#EDECEA',
    overflow: 'hidden',
  },
  progressValue: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.green,
  },
});
