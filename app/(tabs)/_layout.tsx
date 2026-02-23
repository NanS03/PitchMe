import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { supabase } from '../../supabase';

export default function TabLayout() {
  const [nonLues, setNonLues] = useState(0);

  useEffect(() => {
    async function chargerNonLues() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('lu', false);
      setNonLues(count || 0);
    }
    chargerNonLues();

    const channel = supabase
      .channel('notifs-badge')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
      }, () => { chargerNonLues(); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D0D0D',
          borderTopColor: 'transparent',
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#444455',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.4 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifs',
          tabBarIcon: ({ focused }) => (
            <View style={{ position: 'relative' }}>
              <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.4 }}>🔔</Text>
              {nonLues > 0 && (
                <View style={{
                  position: 'absolute', top: -2, right: -6,
                  width: 16, height: 16, borderRadius: 8,
                  backgroundColor: '#FF2D55',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: '#FFF', fontSize: 9, fontWeight: '900' }}>{nonLues}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="postuler"
        options={{
          title: 'Postuler',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.4 }}>🎬</Text>
          ),
          tabBarItemStyle: {
            backgroundColor: '#7C5CFC',
            borderRadius: 16,
            margin: 8,
          },
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.4 }}>💬</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.4 }}>👤</Text>
          ),
        }}
      />
      <Tabs.Screen name="recherche" options={{ href: null }} />
      <Tabs.Screen name="dashboard" options={{ href: null }} />
      <Tabs.Screen name="poster" options={{ href: null }} />
      <Tabs.Screen name="matching" options={{ href: null }} />
      <Tabs.Screen name="onboarding" options={{ href: null }} />
    </Tabs>
  );
}