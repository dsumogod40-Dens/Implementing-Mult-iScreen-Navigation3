import { useNavigation } from 'expo-router';

import { NotificationsScreen } from '@/components/agri-renta';

export default function NotificationsRoute() {
  const navigation = useNavigation();
  return <NotificationsScreen navigation={navigation} />;
}
