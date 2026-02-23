import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const conversations = [
  { id: 1, nom: 'Lucas Bernard', role: 'Recruteur · Ekino', dernier_message: 'Votre profil nous intéresse beaucoup !', temps: '2 min', non_lu: 2, initiales: 'LB', couleur: '#6C47FF' },
  { id: 2, nom: 'Sophie Martin', role: 'RH · Scaleway', dernier_message: 'Pouvez-vous nous envoyer votre portfolio ?', temps: '1h', non_lu: 1, initiales: 'SM', couleur: '#FF2D55' },
  { id: 3, nom: 'Thomas Dupont', role: 'CTO · Capgemini', dernier_message: 'Entretien confirmé pour lundi !', temps: 'Hier', non_lu: 0, initiales: 'TD', couleur: '#00C851' },
  { id: 4, nom: 'Marie Leroy', role: 'Recruteuse · BNP', dernier_message: 'Merci pour votre candidature vidéo 🎬', temps: '2j', non_lu: 0, initiales: 'ML', couleur: '#FF9500' },
];

export default function MessagesScreen() {
  const [recherche, setRecherche] = useState('');
  const router = useRouter();

  const filtres = conversations.filter(c =>
    c.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titre}>Messages</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>3</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor="#555570"
          value={recherche}
          onChangeText={setRecherche}
        />
        {recherche.length > 0 && (
          <TouchableOpacity onPress={() => setRecherche('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filtres.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            style={[styles.convCard, conv.non_lu > 0 && styles.convCardUnread]}
            onPress={() => router.push(('/chat/' + conv.id) as any)}
            activeOpacity={0.7}
          >
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: conv.couleur + '22' }]}>
              <Text style={[styles.avatarText, { color: conv.couleur }]}>{conv.initiales}</Text>
              {conv.non_lu > 0 && <View style={[styles.onlineDot, { backgroundColor: conv.couleur }]} />}
            </View>

            {/* Info */}
            <View style={styles.convInfo}>
              <View style={styles.convHeader}>
                <Text style={[styles.convNom, conv.non_lu > 0 && { color: '#FFFFFF' }]}>{conv.nom}</Text>
                <Text style={styles.convTemps}>{conv.temps}</Text>
              </View>
              <Text style={styles.convRole}>{conv.role}</Text>
              <Text style={[styles.convMessage, conv.non_lu > 0 && { color: '#CCCCDD' }]} numberOfLines={1}>
                {conv.dernier_message}
              </Text>
            </View>

            {/* Badge non lu */}
            {conv.non_lu > 0 && (
              <View style={[styles.badge, { backgroundColor: conv.couleur }]}>
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
  container: { flex: 1, backgroundColor: '#0D0D14' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16,
  },
  titre: { fontSize: 28, fontWeight: '900', color: '#F0F0F8', letterSpacing: -0.5 },
  headerBadge: {
    backgroundColor: '#6C47FF', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  headerBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },

  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A2E', borderRadius: 14,
    marginHorizontal: 20, marginBottom: 8,
    paddingHorizontal: 14, borderWidth: 1, borderColor: '#2A2A3A',
  },
  searchIcon: { color: '#555570', fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, color: '#F0F0F8', fontSize: 15, paddingVertical: 12 },
  clearIcon: { color: '#555570', fontSize: 14, padding: 4 },

  convCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, paddingHorizontal: 20, gap: 14,
    borderBottomWidth: 1, borderBottomColor: '#1A1A2E',
  },
  convCardUnread: { backgroundColor: '#13131A' },

  avatar: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative', flexShrink: 0,
  },
  avatarText: { fontSize: 16, fontWeight: '900' },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: '#0D0D14',
  },

  convInfo: { flex: 1 },
  convHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  convNom: { color: '#8888AA', fontSize: 15, fontWeight: '700' },
  convTemps: { color: '#555570', fontSize: 11 },
  convRole: { color: '#6C47FF', fontSize: 11, fontWeight: '600', marginBottom: 3 },
  convMessage: { color: '#555570', fontSize: 13 },

  badge: {
    borderRadius: 10, minWidth: 20, height: 20,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
});