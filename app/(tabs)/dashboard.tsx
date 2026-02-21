import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const candidats = [
  {
    id: 1,
    nom: 'Sara Morin',
    role: 'Dev Full Stack · Lyon · 4 ans xp',
    tags: ['React', 'Node.js', 'Remote'],
    avatar: '👩‍💻',
    nouveau: true,
  },
  {
    id: 2,
    nom: 'Lucas Bernard',
    role: 'UX/UI Designer · Paris · 6 ans xp',
    tags: ['Figma', 'Design Sys.'],
    avatar: '👨‍🎨',
    nouveau: true,
  },
  {
    id: 3,
    nom: 'Emma Petit',
    role: 'Product Designer · Bordeaux · 3 ans xp',
    tags: ['Figma', 'Prototyping'],
    avatar: '👩‍🦰',
    nouveau: false,
  },
];

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Bonjour, Antoine 👋</Text>
      <Text style={styles.titre}>Dashboard Recruteur</Text>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderColor: '#7C5CFC' }]}>
          <Text style={[styles.statNum, { color: '#7C5CFC' }]}>47</Text>
          <Text style={styles.statLabel}>Candidatures reçues</Text>
        </View>
        <View style={[styles.statCard, { borderColor: '#FC5C7D' }]}>
          <Text style={[styles.statNum, { color: '#FC5C7D' }]}>8</Text>
          <Text style={styles.statLabel}>Nouvelles ce mois</Text>
        </View>
        <View style={[styles.statCard, { borderColor: '#5CF4C8' }]}>
          <Text style={[styles.statNum, { color: '#5CF4C8' }]}>2.4k</Text>
          <Text style={styles.statLabel}>Vues sur annonce</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>3</Text>
          <Text style={styles.statLabel}>Entretiens prevus</Text>
        </View>
      </View>

      <Text style={styles.sectionTitre}>Nouvelles candidatures 🔥</Text>

      {candidats.map((c) => (
        <View key={c.id} style={styles.candidatCard}>
          <View style={styles.candidatAvatar}>
            <Text style={styles.candidatAvatarText}>{c.avatar}</Text>
          </View>
          <View style={styles.candidatInfo}>
            <View style={styles.candidatNomRow}>
              <Text style={styles.candidatNom}>{c.nom}</Text>
              {c.nouveau && <Text style={styles.nouveauBadge}>● Nouveau</Text>}
            </View>
            <Text style={styles.candidatRole}>{c.role}</Text>
            <View style={styles.tagsRow}>
              {c.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'rgba(124,92,252,0.15)' }]}>
              <Text>▶</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'rgba(92,244,200,0.15)' }]}>
              <Text>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'rgba(252,92,125,0.15)' }]}>
              <Text>✗</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 14,
    color: '#8888AA',
    marginBottom: 4,
  },
  titre: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#13131A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  statNum: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8888AA',
  },
  sectionTitre: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8888AA',
    marginBottom: 12,
  },
  candidatCard: {
    backgroundColor: '#13131A',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  candidatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2D0A5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  candidatAvatarText: {
    fontSize: 22,
  },
  candidatInfo: {
    flex: 1,
  },
  candidatNomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  candidatNom: {
    color: '#F0F0F8',
    fontWeight: '600',
    fontSize: 14,
  },
  nouveauBadge: {
    color: '#FC5C7D',
    fontSize: 11,
    fontWeight: '600',
  },
  candidatRole: {
    color: '#8888AA',
    fontSize: 12,
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#1A1A2E',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    color: '#555570',
    fontSize: 11,
  },
  actions: {
    gap: 6,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});