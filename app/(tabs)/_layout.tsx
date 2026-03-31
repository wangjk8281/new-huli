import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/components/huxuebao-ui';
import { useHuxuebao } from '@/contexts/huxuebao-context';

function TabBarIcon({
  color,
  focused,
  label,
  icon,
}: {
  color: string;
  focused: boolean;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <Ionicons color={color} name={icon} size={28} />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive, { color }]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { user, selectedDirectionId } = useHuxuebao();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!selectedDirectionId) {
    return <Redirect href="/direction-select" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#E9E6DF' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} icon={focused ? 'home' : 'home-outline'} label="首页" />
          ),
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: '学习',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              icon={focused ? 'book' : 'book-outline'}
              label="学习"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: '练习',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              icon={focused ? 'git-network' : 'git-network-outline'}
              label="练习"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: '我的',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              icon={focused ? 'stats-chart' : 'stats-chart-outline'}
              label="我的"
            />
          ),
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.tabBarOuter, { bottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            typeof options.title === 'string' ? options.title : route.name;

          const iconMap: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
            index: isFocused ? 'home' : 'home-outline',
            course: isFocused ? 'book' : 'book-outline',
            practice: isFocused ? 'git-network' : 'git-network-outline',
            report: isFocused ? 'stats-chart' : 'stats-chart-outline',
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabBarItem}>
              <TabBarIcon
                color={isFocused ? '#FFFFFF' : '#9C9B99'}
                focused={isFocused}
                icon={iconMap[route.name]}
                label={label}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarOuter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  tabBar: {
    width: '100%',
    maxWidth: 372,
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#E8E4DD',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#1A1918',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 8,
  },
  tabBarItem: {
    flex: 1,
    minHeight: 70,
  },
  tabItem: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  tabItemActive: {
    backgroundColor: palette.green,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
