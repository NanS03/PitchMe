import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const conversations: any = {
  '1': { nom: 'Lucas Bernard', role: 'Recruteur chez Ekino', avatar: '👨‍💼' },
  '2': { nom: 'Sophie Martin', role: 'RH chez Scaleway', avatar: '👩‍💼' },
  '3': { nom: 'Thomas Dupont', role: 'CTO chez Capgemini', avatar: '👨‍💻' },
  '4': { nom: 'Marie Leroy', role: 'Recruteuse chez BNP', avatar: '👩‍💻' },
};

const messagesDemo: any = {
  '1': [
    { id: 1, sender: 'other', texte: 'Bonjour ! Votre profil nous intéresse beaucoup.', temps: '14:30' },
    { id: 2, sender: 'me', texte: 'Merci beaucoup ! Je suis très intéressé par le poste.', temps: '14:32' },
    { id: 3, sender: 'other', texte: 'Seriez-vous disponible pour un entretien cette semaine ?', temps: '14:33' },
  ],
  '2': [
    { id: 1, sender: 'other', texte: 'Bonjour, nous avons vu votre candidature vidéo !', temps: '11:00' },
    { id: 2, sender: 'other', texte: 'Pouvez-vous nous envoyer votre portfolio ?', temps: '11:01' },
  ],
  '3': [
    { id: 1, sender: 'other', texte: 'Entretien confirmé pour lundi à 10h !', temps: 'Hier' },
    { id: 2, sender: 'me', texte: 'Parfait, je serai là !', temps: 'Hier' },
  ],
  '4': [
    { id: 1, sender: 'other', texte: 'Merci pour votre vidéo de candidature 🎬', temps: 'Il y a 2 jours' },
  ],
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>(messagesDemo[id as string] || []);
  const scrollRef = useRef<ScrollView>(null);
  const contact = conversations[id as string] || {};

  function envoyerMessage() {
    if (!message.trim()) return;
    const nouveau = {
      id: messages.length + 1,
      sender: 'me',
      texte: message,
      temps: 'Maintenant',
    };
    setMessages([...messages, nouveau]);
    setMessage('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerAvatar}>{contact.avatar}</Text>
          <View>
            <Text style={styles.headerNom}>{contact.nom}</Text>
            <Text style={styles.headerRole}>{contact.role}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg: any) => (
          <View key={msg.id} style={[
            styles.messageRow,
            msg.sender === 'me' ? styles.messageRowMe : styles.messageRowOther
          ]}>
            <View style={[
              styles.bubble,
              msg.sender === 'me' ? styles.bubbleMe : styles.bubbleOther
            ]}>
              <Text style={styles.bubbleText}>{msg.texte}</Text>
              <Text style={styles.bubbleTemps}>{msg.temps}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Écrire un message..."
          placeholderTextColor="#555570"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={envoyerMessage}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#13131A',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3A',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  backText: {
    color: '#7C5CFC',
    fontSize: 24,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    fontSize: 32,
  },
  headerNom: {
    color: '#F0F0F8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRole: {
    color: '#7C5CFC',
    fontSize: 12,
  },
  messages: {
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 18,
    padding: 12,
    paddingHorizontal: 14,
  },
  bubbleMe: {
    backgroundColor: '#7C5CFC',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#2A2A3A',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
  },
  bubbleTemps: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 24,
    backgroundColor: '#13131A',
    borderTopWidth: 1,
    borderTopColor: '#2A2A3A',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#2A2A3A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#F0F0F8',
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7C5CFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});