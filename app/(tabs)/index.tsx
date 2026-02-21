import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const offres = [
  {
    id: 1,
    type: 'offre',
    titre: 'Product Designer Senior',
    entreprise: 'Ekino Paris',
    lieu: 'Paris 9e',
    salaire: '55-70k€',
    couleur: '#2D0A5E',
  },
  {
    id: 2,
    type: 'candidature',
    titre: 'Je cherche un poste React/Node.js',
    entreprise: 'Candidature spontanée',
    lieu: 'Lyon / Remote',
    salaire: '',
    couleur: '#1A0A20',
  },
  {
    id: 3,
    type: 'offre',
    titre: 'Head of Sales',
    entreprise: 'Scaleway',
    lieu: 'Paris / Hybrid',
    salaire: '65-85k€',
    couleur: '#0A1A1A',
  },
];

export default function HomeScreen() {
  const router = useRouter();

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