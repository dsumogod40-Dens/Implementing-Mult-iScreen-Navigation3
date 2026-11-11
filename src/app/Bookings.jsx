import { useNavigation } from 'expo-router';

import { BookingsScreen } from '@/components/agri-renta';

export default function BookingsRoute() {
  const navigation = useNavigation();
  return <BookingsScreen navigation={navigation} />;
}
