import { useLocalSearchParams, useNavigation } from 'expo-router';

import { ExploreScreen } from '@/components/agri-renta';

export default function ExploreRoute() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  return <ExploreScreen navigation={navigation} route={{ params }} />;
}
