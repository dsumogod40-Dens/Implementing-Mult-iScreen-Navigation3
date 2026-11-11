import { useNavigation } from 'expo-router';

import { HomeScreen } from '@/components/agri-renta';

export default function HomeRoute() {
  const navigation = useNavigation();
  return <HomeScreen navigation={navigation} />;
}
