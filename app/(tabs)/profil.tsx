import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfilScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👩‍💻</Text>
        </View>
        <Text style={styles.nom}>Sara Morin</Text>
        <Text style={styles.role}>Développeuse Full Stack · React · Node.js</Text>
        <Text style={styles.lieu}>📍 Lyon · Remote OK · Disponible</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>1.2k</Text>
          <Text style={styles.statLabel}>Vues</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>89</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>6</Text>
          <Text style={styles.statLabel}>Propositions</Text>
        </View>
      </View>

      <Text style={styles.sectionTitre}>Compétences</Text>
      <View style={styles.chipsRow}>
        {['React.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Figma'].map((skill) => (
          <View key={skill} style={styles.chip}>
            <Text style={styles.chipText}>{skill}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitre}>Expériences</Text>
      <View style={styles.expItem}>
        <View style={styles.expDot} />
        <View>
          <Text style={styles.expTitre}>Développeuse Full Stack Senior</Text>
          <Text style={styles.expEntreprise}>Capgemini</Text>
          <Text style={styles.expDate}>2022 – Présent · 2 ans</Text>
        </View>
      </View>
      <View style={styles.expItem}>
        <View style={[styles.expDot, { backgroundColor: '#FC5C7D' }]} />
        <View>
          <Text style={styles.expTitre}>Développeuse Front-End</Text>
          <Text style={styles.expEntreprise}>Agence Webflow Paris</Text>
          <Text style={styles.expDate}>2020 – 2022 · 2 ans</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editBtn}>
        <Text style={styles.editBtnText}>✏️ Modifier mon profil</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    paddingTop: 60,
  },
  hero: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2D0A5E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#7C5CFC',
  },
  avatarText: {
    fontSize: 40,
  },
  nom: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#8888AA',
    marginBottom: 4,
    textAlign: 'center',
  },
  lieu: {
    fontSize: 13,
    color: '#555570',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2A2A3A',
    marginVertical: 20,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRightWidth: 1,
    borderColor: '#2A2A3A',
  },
  statNum: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0F0F8',
  },
  statLabel: {
    fontSize: 12,
    color: '#555570',
    marginTop: 2,
  },
  sectionTitre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  chip: {
    backgroundColor: '#2A2A3A',
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#7C5CFC',
  },
  chipText: {
    color: '#7C5CFC',
    fontSize: 13,
    fontWeight: '500',
  },
  expItem: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  expDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7C5CFC',
    marginTop: 5,
    flexShrink: 0,
  },
  expTitre: {
    color: '#F0F0F8',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 2,
  },
  expEntreprise: {
    color: '#7C5CFC',
    fontSize: 13,
    marginBottom: 2,
  },
  expDate: {
    color: '#555570',
    fontSize: 12,
  },
  editBtn: {
    backgroundColor: '#2A2A3A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    margin: 20,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  editBtnText: {
    color: '#F0F0F8',
    fontWeight: '600',
    fontSize: 15,
  },
});