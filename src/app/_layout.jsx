import { Stack } from 'expo-router';

import { AppProvider } from '@/components/agri-renta';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#3E7A41' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Home" options={{ headerShown: false }} />
        <Stack.Screen name="Explore" options={{ headerShown: false }} />
        <Stack.Screen name="Bookings" options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" options={{ headerShown: false }} />
        <Stack.Screen
          name="EquipmentDetails"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Chat" options={{ title: 'Message Owner' }} />
        <Stack.Screen name="BookingForm" options={{ title: 'Book Equipment' }} />
        <Stack.Screen
          name="BookingDetails"
          options={{ title: 'Booking Details' }}
        />
      </Stack>
    </AppProvider>
  );
}
