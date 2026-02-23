import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NOTIFS = [
  { id: 1, type: 'match', titre: 'Nouveau match !', message: 'Ekino Paris a aimé ton profil', temps: '2 min', lu: false, couleur: '#6C47FF' },
  { id: 2, type: 'message', titre: 'Lucas Bernard', message: 'Votre profil nous intéresse beaucoup !', temps: '15 min', lu: false, couleur: '#2D6AFF' },
  { id: 3, type: 'vue', titre: 'Ton profil a été vu', message: 'Scaleway a consulté ta candidature', temps: '1h', lu: false, couleur: '#FF9500' },
  { id: 4, type: 'like', titre: 'Nouvelle réaction', message: 'Sophie Martin a aimé ton pitch vidéo', temps: '3h', lu: true, couleur: '#FF2D55' },
  { id: 5, type: 'candidature', titre: 'Candidature reçue', message: 'Thomas Dupont a postulé à ton offre', temps: 'Hier', lu: true, couleur: '#00C851' },
  { id: 6, type: 'match', titre: 'Match parfait !', message: 'BNP Paribas correspond à 94% de ton profil', temps: '2j', lu: true, couleur: '#6C47FF' },
];

const ICONS: Record<string, string> = {
  match: '🎯',
  message: '💬',
  vue: '👁️',
  like: '♥',
  candidature: '📋',
};

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState(NOTIFS);

  function marquerToutLu() {
    setNotifs(n => n.map(notif => ({ ...notif, lu: true })));
  }

  const nonLues = notifs.filter(n => !n.lu);
  const lues = notifs.filter(n => n.lu);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.titre}>Notifications</Text>
          {nonLues.length > 0 && (
            <Text style={styles.sousTitre}>{nonLues.length} non lues</Text>
          )}
        </View>
        {nonLues.length > 0 && (
          <TouchableOpacity style={styles.touLuBtn} onPress={marquerToutLu}>
            <Text style={styles.toutLuText}>Tout lire</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Non lues */}
        {nonLues.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>NOUVELLES</Text>
            {nonLues.map(notif => (
              <TouchableOpacity
                key={notif.id}
                style={styles.notifCard}
                onPress={() => setNotifs(n => n.map(no => no.id === notif.id ? { ...no, lu: true } : no))}
              >
                <View style={[styles.iconBox, { backgroundColor: notif.couleur + '22' }]}>
                  <Text style={styles.iconText}>{ICONS[notif.type]}</Text>
                  <View style={[styles.unreadDot, { backgroundColor: notif.couleur }]} />
                </View>
                <View style={styles.notifInfo}>
                  <View style={styles.notifHeader}>
                    <Text style={styles.notifTitre}>{notif.titre}</Text>
                    <Text style={styles.notifTemps}>{notif.temps}</Text>
                  </View>
                  <Text style={styles.notifMessage}>{notif.message}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Lues */}
        {lues.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>DÉJÀ VUES</Text>
            {lues.map(notif => (
              <TouchableOpacity key={notif.id} style={[styles.notifCard, styles.notifCardLue]}>
                <View style={[styles.iconBox, { backgroundColor: '#1A1A2E' }]}>
                  <Text style={[styles.iconText, { opacity: 0.5 }]}>{ICONS[notif.type]}</Text>
                </View>
                <View style={styles.notifInfo}>
                  <View style={styles.notifHeader}>
                    <Text style={[styles.notifTitre, { color: '#555570' }]}>{notif.titre}</Text>
                    <Text style={styles.notifTemps}>{notif.temps}</Text>
                  </View>
                  <Text style={[styles.notifMessage, { color: '#3A3A4A' }]}>{notif.message}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {nonLues.length === 0 && lues.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>Aucune notification</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D14' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16,
  },
  titre: { fontSize: 28, fontWeight: '900', color: '#F0F0F8', letterSpacing: -0.5 },
  sousTitre: { fontSize: 13, color: '#6C47FF', fontWeight: '600', marginTop: 2 },
  touLuBtn: {
    backgroundColor: '#1A1A2E', borderRadius: 100,
    paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: '#2A2A3A',
  },
  toutLuText: { color: '#6C47FF', fontSize: 13, fontWeight: '700' },

  sectionLabel: {
    color: '#555570', fontSize: 11, fontWeight: '700',
    letterSpacing: 1.5, paddingHorizontal: 20,
    paddingVertical: 8, marginTop: 8,
  },

  notifCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#13131A',
    backgroundColor: '#13131A',
  },
  notifCardLue: { backgroundColor: '#0D0D14' },

  iconBox: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative', flexShrink: 0,
  },
  iconText: { fontSize: 22 },
  unreadDot: {
    position: 'absolute', top: 0, right: 0,
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 2, borderColor: '#0D0D14',
  },

  notifInfo: { flex: 1 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  notifTitre: { color: '#F0F0F8', fontSize: 14, fontWeight: '700' },
  notifTemps: { color: '#555570', fontSize: 11 },
  notifMessage: { color: '#8888AA', fontSize: 13, lineHeight: 18 },

  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: '#555570', fontSize: 15 },
});