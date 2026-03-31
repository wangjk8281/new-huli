import { Redirect } from 'expo-router';

import { useHuxuebao } from '@/contexts/huxuebao-context';

export default function RootIndex() {
  const { user, selectedDirectionId } = useHuxuebao();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!selectedDirectionId) {
    return <Redirect href="/direction-select" />;
  }

  return <Redirect href="/(tabs)" />;
}
