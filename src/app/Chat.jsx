import { useLocalSearchParams, useNavigation } from 'expo-router';

import { ChatScreen } from '@/components/agri-renta';

export default function ChatRoute() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  return <ChatScreen navigation={navigation} route={{ params }} />;
}
