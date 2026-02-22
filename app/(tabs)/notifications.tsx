import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const notifications = [
  {
    id: 1,
    type: 'candidature',
    message: 'Ekino Paris a vu ta candidature vidéo',
    temps: 'Il y a 2 min',
    lu: false,
    icon: '👀',
  },
  {
    id: 2,
    type: 'match',
    message: 'Nouveau match ! Scaleway cherche un profil comme toi',
    temps: 'Il y a 15 min',
    lu: false,
    icon: '🎯',
  },
  {
    id: 3,
    type: 'message',
    message: 'Lucas Bernard t\'a envoyé un message',
    temps: 'Il y a 1h',
    lu: false,
    icon: '💬',
  },
  {
    id: 4,
    type: 'like',
    message: 'Ton profil a reçu 12 nouveaux likes aujourd\'hui',
    temps: 'Il y a 3h',
    lu: true,
    icon: '❤️',
  },
  {
    id: 5,
    type: 'candidature',
    message: 'Ta candidature chez Capgemini passe en entretien !',
    temps: 'Hier',
    lu: true,
    icon: '🎉',
  },
  {
    id: 6,
    type: 'vue',
    message: 'Ton profil a été consulté 48 fois cette semaine',
    temps: 'Il y a 2 jours',
    lu: true,
    icon: '📊',
  },
];

export default function NotificationsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titre}>Notifications 🔔</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitre}>NOUVELLES</Text>
        {notifications.filter(n => !n.lu).map((notif) => (
          <TouchableOpacity key={notif.id} style={[styles.notifCard, styles.notifNonLue]}>
            <View style={styles.notifIcon}>
              <Text style={styles.notifIconText}>{notif.icon}</Text>
            </View>
            <View style={styles.notifContent}>
              <Text style={styles.notifMessage}>{notif.message}</Text>
              <Text style={styles.notifTemps}>{notif.temps}</Text>
            </View>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitre}>DÉJÀ VUES</Text>
        {notifications.filter(n => n.lu).map((notif) => (
          <TouchableOpacity key={notif.id} style={styles.notifCard}>
            <View style={[styles.notifIcon, { opacity: 0.6 }]}>
              <Text style={styles.notifIconText}>{notif.icon}</Text>
            </View>
            <View style={styles.notifContent}>
              <Text style={[styles.notifMessage, { color: '#8888AA' }]}>{notif.message}</Text>
              <Text style={styles.notifTemps}>{notif.temps}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitre: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555570',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#13131A',
  },
  notifNonLue: {
    backgroundColor: 'rgba(124,92,252,0.05)',
  },
  notifIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#13131A',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifIconText: {
    fontSize: 22,
  },
  notifContent: {
    flex: 1,
  },
  notifMessage: {
    color: '#F0F0F8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notifTemps: {
    color: '#555570',
    fontSize: 12,
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C5CFC',
    flexShrink: 0,
  },
});