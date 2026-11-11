import { useLocalSearchParams, useNavigation } from 'expo-router';

import { EquipmentDetailsScreen } from '@/components/agri-renta';

export default function EquipmentDetailsRoute() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  return <EquipmentDetailsScreen navigation={navigation} route={{ params }} />;
}
