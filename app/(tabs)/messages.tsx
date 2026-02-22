import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const conversations = [
  {
    id: 1,
    nom: 'Lucas Bernard',
    role: 'Recruteur chez Ekino',
    dernier_message: 'Votre profil nous intéresse beaucoup !',
    temps: 'Il y a 2 min',
    non_lu: 2,
    avatar: '👨‍💼',
  },
  {
    id: 2,
    nom: 'Sophie Martin',
    role: 'RH chez Scaleway',
    dernier_message: 'Pouvez-vous nous envoyer votre portfolio ?',
    temps: 'Il y a 1h',
    non_lu: 1,
    avatar: '👩‍💼',
  },
  {
    id: 3,
    nom: 'Thomas Dupont',
    role: 'CTO chez Capgemini',
    dernier_message: 'Entretien confirmé pour lundi !',
    temps: 'Hier',
    non_lu: 0,
    avatar: '👨‍💻',
  },
  {
    id: 4,
    nom: 'Marie Leroy',
    role: 'Recruteuse chez BNP',
    dernier_message: 'Merci pour votre candidature vidéo 🎬',
    temps: 'Il y a 2 jours',
    non_lu: 0,
    avatar: '👩‍💻',
  },
];

export default function MessagesScreen() {
  const [recherche, setRecherche] = useState('');
  const router = useRouter();

  const filtres = conversations.filter(c =>
    c.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Messages 💬</Text>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une conversation..."
          placeholderTextColor="#555570"
          value={recherche}
          onChangeText={setRecherche}
        />
      </View>

      <ScrollView>
        {filtres.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            style={styles.convCard}
            onPress={() => router.push(`/chat/${conv.id}`)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{conv.avatar}</Text>
            </View>
            <View style={styles.convInfo}>
              <View style={styles.convHeader}>
                <Text style={styles.convNom}>{conv.nom}</Text>
                <Text style={styles.convTemps}>{conv.temps}</Text>
              </View>
              <Text style={styles.convRole}>{conv.role}</Text>
              <Text style={styles.convMessage} numberOfLines={1}>
                {conv.dernier_message}
              </Text>
            </View>
            {conv.non_lu > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{conv.non_lu}</Text>
              </View>
            )}
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
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F0F8',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13131A',
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 16,
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
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#13131A',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2A2A3A',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 24,
  },
  convInfo: {
    flex: 1,
  },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  convNom: {
    color: '#F0F0F8',
    fontSize: 15,
    fontWeight: '600',
  },
  convTemps: {
    color: '#555570',
    fontSize: 12,
  },
  convRole: {
    color: '#7C5CFC',
    fontSize: 12,
    marginBottom: 4,
  },
  convMessage: {
    color: '#8888AA',
    fontSize: 13,
  },
  badge: {
    backgroundColor: '#7C5CFC',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});