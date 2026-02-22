import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const offresDemo = [
  { id: 1, titre: 'Product Designer Senior', entreprise: 'Ekino Paris', lieu: 'Paris 9e', salaire: '55-70k€', type: 'offre', couleur: '#2D0A5E' },
  { id: 2, titre: 'Développeur React Native', entreprise: 'Capgemini', lieu: 'Lyon / Remote', salaire: '45-55k€', type: 'offre', couleur: '#0A1A2E' },
  { id: 3, titre: 'Head of Sales', entreprise: 'Scaleway', lieu: 'Paris / Hybrid', salaire: '65-85k€', type: 'offre', couleur: '#0A1A1A' },
  { id: 4, titre: 'UX Researcher', entreprise: 'BNP Paribas', lieu: 'Paris', salaire: '40-50k€', type: 'offre', couleur: '#1A0A2E' },
  { id: 5, titre: 'Je cherche un poste React/Node.js', entreprise: 'Candidature spontanée', lieu: 'Lyon / Remote', salaire: '', type: 'candidature', couleur: '#1A0A20' },
  { id: 6, titre: 'DevOps Engineer', entreprise: 'OVH Cloud', lieu: 'Bordeaux', salaire: '50-65k€', type: 'offre', couleur: '#0A2A1A' },
];

const filtresTypes = ['Tout', 'Offres', 'Candidatures'];
const filtresLieux = ['Tout', 'Paris', 'Lyon', 'Remote', 'Hybrid'];

export default function RechercheScreen() {
  const router = useRouter();
  const [recherche, setRecherche] = useState('');
  const [typeActif, setTypeActif] = useState('Tout');
  const [lieuActif, setLieuActif] = useState('Tout');

  const resultats = offresDemo.filter(o => {
    const matchRecherche = o.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      o.entreprise.toLowerCase().includes(recherche.toLowerCase());
    const matchType = typeActif === 'Tout' ||
      (typeActif === 'Offres' && o.type === 'offre') ||
      (typeActif === 'Candidatures' && o.type === 'candidature');
    const matchLieu = lieuActif === 'Tout' || o.lieu.includes(lieuActif);
    return matchRecherche && matchType && matchLieu;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Recherche 🔍</Text>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Poste, entreprise..."
          placeholderTextColor="#555570"
          value={recherche}
          onChangeText={setRecherche}
        />
        {recherche.length > 0 && (
          <TouchableOpacity onPress={() => setRecherche('')}>
            <Text style={{ color: '#555570', fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.filtreLabel}>Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtreRow}>
        {filtresTypes.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filtrePill, typeActif === f && styles.filtrePillActif]}
            onPress={() => setTypeActif(f)}
          >
            <Text style={[styles.filtrePillText, typeActif === f && styles.filtrePillTextActif]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.filtreLabel}>Lieu</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtreRow}>
        {filtresLieux.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filtrePill, lieuActif === f && styles.filtrePillActif]}
            onPress={() => setLieuActif(f)}
          >
            <Text style={[styles.filtrePillText, lieuActif === f && styles.filtrePillTextActif]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.resultatsCount}>{resultats.length} résultat{resultats.length > 1 ? 's' : ''}</Text>

      <ScrollView style={styles.resultats}>
        {resultats.map(offre => (
          <TouchableOpacity key={offre.id} style={[styles.card, { backgroundColor: offre.couleur }]}>
            <Text style={[styles.cardBadge, { color: offre.type === 'offre' ? '#7C5CFC' : '#FC5C7D' }]}>
              {offre.type === 'offre' ? '● Offre' : '● Candidature'}
            </Text>
            <Text style={styles.cardTitre}>{offre.titre}</Text>
            <Text style={styles.cardEntreprise}>{offre.entreprise}</Text>
            <View style={styles.cardMeta}>
              <Text style={styles.metaText}>📍 {offre.lieu}</Text>
              {offre.salaire ? <Text style={styles.metaText}>💰 {offre.salaire}</Text> : null}
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: 16,
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13131A',
    borderRadius: 14,
    marginBottom: 20,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F0F0F8',
    fontSize: 15,
    paddingVertical: 12,
  },
  filtreLabel: {
    color: '#555570',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  filtreRow: {
    marginBottom: 16,
  },
  filtrePill: {
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2A2A3A',
    marginRight: 8,
    backgroundColor: '#13131A',
  },
  filtrePillActif: {
    backgroundColor: '#7C5CFC',
    borderColor: '#7C5CFC',
  },
  filtrePillText: {
    color: '#8888AA',
    fontSize: 13,
    fontWeight: '600',
  },
  filtrePillTextActif: {
    color: '#FFFFFF',
  },
  resultatsCount: {
    color: '#555570',
    fontSize: 13,
    marginBottom: 12,
  },
  resultats: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  cardBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardTitre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 4,
  },
  cardEntreprise: {
    fontSize: 13,
    color: '#7C5CFC',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  metaText: {
    fontSize: 12,
    color: '#8888AA',
  },
});