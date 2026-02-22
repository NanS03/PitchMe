import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#13131A',
          borderTopColor: '#2A2A3A',
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#7C5CFC',
        tabBarInactiveTintColor: '#555570',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="postuler"
        options={{
          title: 'Postuler',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🎬</Text>,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text>,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'RH',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="poster"
        options={{
          title: 'Poster',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>➕</Text>,
        }}
      />
    </Tabs>
  );
}