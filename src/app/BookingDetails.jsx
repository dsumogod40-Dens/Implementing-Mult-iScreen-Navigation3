import { useLocalSearchParams, useNavigation } from 'expo-router';

import { BookingDetailsScreen } from '@/components/agri-renta';

export default function BookingDetailsRoute() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  return <BookingDetailsScreen navigation={navigation} route={{ params }} />;
}
