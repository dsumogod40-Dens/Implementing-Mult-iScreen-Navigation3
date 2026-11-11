import { useLocalSearchParams, useNavigation } from 'expo-router';

import { BookingFormScreen } from '@/components/agri-renta';

export default function BookingFormRoute() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  return <BookingFormScreen navigation={navigation} route={{ params }} />;
}
