import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

export default function HomeScreen() {
  const router = useRouter();
  const [offres, setOffres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function chargerOffres() {
      const { data, error } = await supabase.from('offres').select('*');
      if (data) setOffres(data);
      setLoading(false);
    }
    chargerOffres();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#7C5CFC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PitchMe</Text>
      <ScrollView style={styles.feed}>
        {offres.map((offre) => (
          <View key={offre.id} style={[styles.card, { backgroundColor: offre.couleur }]}>
            <View style={styles.badge}>
              <Text style={[styles.badgeText, { color: offre.type === 'offre' ? '#7C5CFC' : '#FC5C7D' }]}>
                {offre.type === 'offre' ? '● Offre' : '● Candidature'}
              </Text>
            </View>
            <Text style={styles.titre}>{offre.titre}</Text>
            <Text style={styles.entreprise}>{offre.entreprise}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>📍 {offre.lieu}</Text>
              {offre.salaire ? <Text style={styles.meta}>💰 {offre.salaire}</Text> : null}
            </View>
            <TouchableOpacity
              style={styles.bouton}
              onPress={() => router.push('/postuler')}
            >
              <Text style={styles.boutonText}>
                {offre.type === 'offre' ? 'Postuler →' : 'Contacter →'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    paddingTop: 60,
  },
  loading: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7C5CFC',
    textAlign: 'center',
    marginBottom: 20,
  },
  feed: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  badge: {
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  titre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 6,
  },
  entreprise: {
    fontSize: 14,
    color: '#7C5CFC',
    fontWeight: '600',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  meta: {
    fontSize: 13,
    color: '#8888AA',
  },
  bouton: {
    backgroundColor: '#7C5CFC',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
  },
  boutonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});