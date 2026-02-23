import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Charger les notifs existantes
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setNotifs(data);

      // Écouter les nouvelles notifs en temps réel
      const channel = supabase
        .channel('notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          setNotifs(prev => [payload.new, ...prev]);
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
    init();
  }, []);

  async function marquerLu(id: number) {
    await supabase.from('notifications').update({ lu: true }).eq('id', id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
  }

  async function marquerToutLu() {
    if (!userId) return;
    await supabase.from('notifications').update({ lu: true }).eq('user_id', userId);
    setNotifs(prev => prev.map(n => ({ ...n, lu: true })));
  }

  const ICONS: Record<string, string> = {
    match: '🎯', message: '💬', vue: '👁️', like: '♥', candidature: '📋',
  };
  const COULEURS: Record<string, string> = {
    match: '#6C47FF', message: '#2D6AFF', vue: '#FF9500', like: '#FF2D55', candidature: '#00C851',
  };

  const nonLues = notifs.filter(n => !n.lu);
  const lues = notifs.filter(n => n.lu);

  // Notifs de démo si vide
  const demoNotifs = [
    { id: 'd1', type: 'match', titre: 'Nouveau match !', message: 'Ekino Paris a aimé ton profil', created_at: new Date().toISOString(), lu: false },
    { id: 'd2', type: 'message', titre: 'Lucas Bernard', message: 'Votre profil nous intéresse !', created_at: new Date().toISOString(), lu: false },
    { id: 'd3', type: 'vue', titre: 'Profil consulté', message: 'Scaleway a vu ta candidature', created_at: new Date().toISOString(), lu: true },
  ];

  const affichees = notifs.length > 0 ? notifs : demoNotifs;
  const nonLuesAff = affichees.filter(n => !n.lu);
  const luesAff = affichees.filter(n => n.lu);

  function tempsRelatif(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'À l\'instant';
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}j`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.titre}>Notifications</Text>
          {nonLuesAff.length > 0 && (
            <Text style={styles.sousTitre}>{nonLuesAff.length} non lues</Text>
          )}
        </View>
        {nonLuesAff.length > 0 && (
          <TouchableOpacity style={styles.toutLuBtn} onPress={marquerToutLu}>
            <Text style={styles.toutLuText}>Tout lire</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {nonLuesAff.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>NOUVELLES</Text>
            {nonLuesAff.map(notif => (
              <TouchableOpacity
                key={notif.id}
                style={styles.notifCard}
                onPress={() => marquerLu(notif.id)}
              >
                <View style={[styles.iconBox, { backgroundColor: (COULEURS[notif.type] || '#6C47FF') + '22' }]}>
                  <Text style={styles.iconText}>{ICONS[notif.type] || '🔔'}</Text>
                  <View style={[styles.unreadDot, { backgroundColor: COULEURS[notif.type] || '#6C47FF' }]} />
                </View>
                <View style={styles.notifInfo}>
                  <View style={styles.notifHeader}>
                    <Text style={styles.notifTitre}>{notif.titre}</Text>
                    <Text style={styles.notifTemps}>{tempsRelatif(notif.created_at)}</Text>
                  </View>
                  <Text style={styles.notifMessage}>{notif.message}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {luesAff.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>DÉJÀ VUES</Text>
            {luesAff.map(notif => (
              <TouchableOpacity key={notif.id} style={[styles.notifCard, styles.notifCardLue]}>
                <View style={[styles.iconBox, { backgroundColor: '#1A1A2E' }]}>
                  <Text style={[styles.iconText, { opacity: 0.5 }]}>{ICONS[notif.type] || '🔔'}</Text>
                </View>
                <View style={styles.notifInfo}>
                  <View style={styles.notifHeader}>
                    <Text style={[styles.notifTitre, { color: '#555570' }]}>{notif.titre}</Text>
                    <Text style={styles.notifTemps}>{tempsRelatif(notif.created_at)}</Text>
                  </View>
                  <Text style={[styles.notifMessage, { color: '#3A3A4A' }]}>{notif.message}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
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
  toutLuBtn: {
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
});