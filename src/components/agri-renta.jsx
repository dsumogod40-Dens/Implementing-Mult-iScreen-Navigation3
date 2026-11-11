import { useState, createContext, useContext } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NEU_BG, styles } from './agri-renta.styles';

/* ---------------------------------------------------------
   DATA
--------------------------------------------------------- */
const EQUIPMENT = [
  {
    id: '1',
    name: 'Kubota Tractor',
    category: 'Tractors',
    owner: 'Dennis Sumogod',
    price: 1500,
    rating: 4.8,
    available: true,
    desc: '50 HP diesel tractor, good for land preparation and hauling.',
    image: require('@/assets/images/tractor.png'),
  },
  {
    id: '2',
    name: 'Rotary Tiller',
    category: 'Tillers',
    owner: 'John Astronomo',
    price: 800,
    rating: 4.6,
    available: true,
    desc: 'Compact 7 HP tiller for small to medium rice fields.',
    image: require('@/assets/images/tiller.png'),
  },
  {
    id: '3',
    name: 'Rice Harvester',
    category: 'Harvesters',
    owner: 'Bunawan Farmers Coop',
    price: 3500,
    rating: 4.9,
    available: false,
    desc: 'High capacity combine harvester. Fast and efficient.',
    image: require('@/assets/images/harvester.png'),
  },
  {
    id: '4',
    name: 'Water Pump 4"',
    category: 'Others',
    owner: 'Pedro Reyes',
    price: 500,
    rating: 4.5,
    available: true,
    desc: '4-inch water pump for irrigation and drainage.',
    image: require('@/assets/images/pump.png'),
  },
  {
    id: '5',
    name: 'Rice Thresher',
    category: 'Others',
    owner: 'Ana Villanueva',
    price: 1200,
    rating: 4.7,
    available: true,
    desc: 'Portable thresher that separates grain quickly.',
    image: require('@/assets/images/thresher.png'),
  },
  {
    id: '6',
    name: 'Power Sprayer',
    category: 'Others',
    owner: 'Carlo Mendoza',
    price: 300,
    rating: 4.4,
    available: true,
    desc: 'Motorized sprayer for pesticide and fertilizer.',
    image: require('@/assets/images/sprayer.png'),
  },
];

const CATEGORIES = [
  { id: '1', name: 'Tractors', image: require('@/assets/images/tractor.png') },
  { id: '2', name: 'Harvesters', image: require('@/assets/images/harvester.png') },
  { id: '3', name: 'Tillers', image: require('@/assets/images/tiller.png') },
];

const FILTERS = ['All', 'Tractors', 'Harvesters', 'Tillers', 'Others'];

/* ---------------------------------------------------------
   SHARED STATE (bookings + notifications)
--------------------------------------------------------- */
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

const fmt = (d) =>
  d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export function AppProvider({ children }) {
  const [bookings, setBookings] = useState([
    {
      id: 'b1',
      code: 'AR-2026-0103',
      equipment: EQUIPMENT[1],
      days: 2,
      total: 1600,
      status: 'Pending',
      dateRange: 'Sep 8, 2026 - Sep 9, 2026',
    },
    {
      id: 'b2',
      code: 'AR-2026-4325',
      equipment: EQUIPMENT[2],
      days: 3,
      total: 10500,
      status: 'Approved',
      dateRange: 'Oct 31, 2026 - Nov 3, 2026',
    },
  ]);
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Rental returned',
      body: 'Rotary Tiller - AR-2026-0049',
      time: '11/8/2026, 5:27 PM',
      read: false,
    },
    {
      id: 'n2',
      title: 'New message from DihSimulator',
      body: 'test',
      time: '11/3/2026, 5:50 PM',
      read: false,
    },
  ]);

  const addBooking = (equipment, days) => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);
    const code = 'AR-2026-' + Math.floor(1000 + Math.random() * 9000);
    const booking = {
      id: 'b' + Date.now(),
      code,
      equipment,
      days,
      total: equipment.price * days,
      status: 'Pending',
      dateRange: fmt(start) + ' - ' + fmt(end),
    };
    setBookings((prev) => [booking, ...prev]);
    setNotifications((prev) => [
      {
        id: 'n' + Date.now(),
        title: 'Booking submitted',
        body: equipment.name + ' - ' + code,
        time: new Date().toLocaleString(),
        read: false,
      },
      ...prev,
    ]);
    return booking;
  };

  const cancelBooking = (id) =>
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <AppContext.Provider
      value={{ bookings, notifications, addBooking, cancelBooking, markRead }}>
      {children}
    </AppContext.Provider>
  );
}

/* ---------------------------------------------------------
   REUSABLE COMPONENTS
--------------------------------------------------------- */
const TABS = [
  { route: 'Home', label: 'Home' },
  { route: 'Explore', label: 'Explore' },
  { route: 'Bookings', label: 'Bookings' },
  { route: 'Notifications', label: 'Alerts' },
];

function BottomBar({ navigation, active }) {
  const { bookings, notifications } = useApp();
  const insets = useSafeAreaInsets();
  const pending = bookings.filter((b) => b.status === 'Pending').length;
  const unread = notifications.filter((n) => !n.read).length;

  const badgeFor = (route) =>
    route === 'Bookings' ? pending : route === 'Notifications' ? unread : 0;

  return (
    <View
      style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {TABS.map((t) => {
        const isActive = active === t.route;
        const badge = badgeFor(t.route);
        return (
          <Pressable
            key={t.route}
            style={styles.tabItem}
            onPress={() => navigation.navigate(t.route)}>
            <View style={[styles.tabPill, isActive && styles.tabPillActive]}>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {t.label}
              </Text>
              {badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {badge > 9 ? '9+' : badge}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// Gradient background used by every screen
function GradientScreen({ children, navigation, active, header = true }) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={['#32833d', '#a1da99', NEU_BG]}
      locations={[0, 0.45, 1]}
      style={styles.container}>
      <View style={{ flex: 1, paddingTop: header ? insets.top : 0 }}>
        {children}
      </View>
      {active && <BottomBar navigation={navigation} active={active} />}
    </LinearGradient>
  );
}

function EquipmentCard({ item, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.neu,
        styles.equipCard,
        pressed && styles.pressed,
      ]}>
      <Image source={item.image} style={styles.equipImage} />
      <View style={styles.equipInfo}>
        <Text style={styles.equipName}>{item.name}</Text>
        <Text style={styles.equipOwner}>Owner: {item.owner}</Text>
        <Text style={styles.equipOwner}>Rating: {item.rating} / 5</Text>
        <View style={styles.equipFooter}>
          <Text style={styles.equipPrice}>P{item.price} / day</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.dot,
                { backgroundColor: item.available ? '#2E7D32' : '#B3261E' },
              ]}
            />
            <Text style={styles.statusText}>
              {item.available ? 'Available' : 'Booked'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.neu,
        styles.chip,
        active && styles.chipActive,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function PrimaryButton({ title, onPress, disabled, danger }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        danger && styles.buttonDanger,
        disabled && styles.buttonDisabled,
        pressed && styles.pressed,
      ]}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

function InvalidRouteScreen({ navigation }) {
  return (
    <GradientScreen navigation={navigation} header={false}>
      <View style={styles.screenInner}>
        <Text style={styles.detailName}>This page is unavailable.</Text>
        <PrimaryButton title="Go back" onPress={() => navigation.goBack()} />
      </View>
    </GradientScreen>
  );
}

// draws 5 stars based on the rating (e.g. 4.8)
function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= full ? 'star' : i === full + 1 && half ? 'star-half' : 'star-outline'}
          size={16}
          color="#F5A623"
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
}

/* ---------------------------------------------------------
   SCREEN 1: HOME / DASHBOARD
--------------------------------------------------------- */
export function HomeScreen({ navigation }) {
  const popular = EQUIPMENT.slice(0, 3);

  return (
    <GradientScreen navigation={navigation} active="Home">
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={[styles.neu, styles.logoCircle]}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.roleText}>CUSTOMER</Text>
            <Text style={styles.greeting}>Good evening, Alex</Text>
            <Text style={styles.subGreeting}>Ready to get work done?</Text>
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate('Explore')}
          style={[styles.neu, styles.searchBox]}>
          <Text style={styles.searchText}>Search equipment or location...</Text>
        </Pressable>

        <Text style={styles.sectionTitleLight}>Browse categories</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [
                styles.neu,
                styles.categoryCard,
                pressed && styles.pressed,
              ]}
              // PARAMETER PASSING: category name goes to Explore screen
              onPress={() =>
                navigation.navigate('Explore', { category: cat.name })
              }>
              <Image source={cat.image} style={styles.categoryImage} />
              <Text style={styles.categoryName}>{cat.name}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitleLight}>Featured equipment</Text>
          <Pressable onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.linkText}>See all</Text>
          </Pressable>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.neu,
            styles.bannerBox,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            navigation.navigate('EquipmentDetails', {
              equipmentId: EQUIPMENT[2].id,
            })
          }>
          <Image
            source={require('@/assets/images/banner.png')}
            style={styles.bannerImage}
          />
        </Pressable>

        <Text style={styles.sectionTitleDark}>Popular near you</Text>
        {popular.map((item) => (
          <EquipmentCard
            key={item.id}
            item={item}
            // PARAMETER PASSING: whole equipment object goes to Details screen
            onPress={() =>
              navigation.navigate('EquipmentDetails', {
                equipmentId: item.id,
              })
            }
          />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </GradientScreen>
  );
}

/* ---------------------------------------------------------
   SCREEN 2: EXPLORE (list + search + filter)
--------------------------------------------------------- */
export function ExploreScreen({ navigation, route }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const activeCategory = route.params?.category ?? category;

  const results = EQUIPMENT.filter(
    (e) =>
      (activeCategory === 'All' || e.category === activeCategory) &&
      e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <GradientScreen navigation={navigation} active="Explore">
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Explore equipment</Text>
        <Text style={styles.pageSub}>
          Find the right machine for your farm.
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search equipment..."
          placeholderTextColor="#6B7F6C"
          style={[styles.neu, styles.searchInput]}
        />

        <View style={styles.chipWrap}>
          {FILTERS.map((f) => (
            <Chip
              key={f}
              label={f}
              active={activeCategory === f}
              onPress={() => {
                navigation.setParams({ category: undefined });
                setCategory(f);
              }}
            />
          ))}
        </View>

        <Text style={styles.countText}>{results.length} listing(s)</Text>

        {results.length === 0 && (
          <Text style={styles.emptyText}>No equipment found.</Text>
        )}
        {results.map((item) => (
          <EquipmentCard
            key={item.id}
            item={item}
            onPress={() =>
              navigation.navigate('EquipmentDetails', {
                equipmentId: item.id,
              })
            }
          />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </GradientScreen>
  );
}

/* ---------------------------------------------------------
   NEUMORPHISM CARD
   (light shadow on top-left + dark shadow on bottom-right)
--------------------------------------------------------- */
function NeuCard({ children, style, outerStyle, radius = 18 }) {
  return (
    <View
      style={[
        {
          borderRadius: radius,
          backgroundColor: NEU_BG,
          shadowColor: '#FFFFFF',
          shadowOffset: { width: -5, height: -5 },
          shadowOpacity: 1,
          shadowRadius: 7,
        },
        outerStyle,
      ]}>
      <View
        style={[
          {
            borderRadius: radius,
            backgroundColor: NEU_BG,
            shadowColor: '#8FA38B',
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.68,
            shadowRadius: 9,
            elevation: 6,
          },
          style,
        ]}>
        {children}
      </View>
    </View>
  );
}

/* ---------------------------------------------------------
   AVAILABILITY CALENDAR (opens from "Available Dates")
--------------------------------------------------------- */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function AvailabilityCalendar({ visible, onClose, equipment }) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [month, setMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [selected, setSelected] = useState(null);

  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1).getDay();
  const total = new Date(year, m + 1, 0).getDate();
  const isCurrentMonth = year === today.getFullYear() && m === today.getMonth();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);

  // sample availability: a booked equipment is not available on any date,
  // others have a few scattered booked dates
  const isBooked = (d) =>
    !equipment.available || (d * 3 + Number(equipment.id)) % 7 === 0;
  const isPast = (d) => new Date(year, m, d) < today;

  const changeMonth = (step) => {
    setMonth(new Date(year, m + step, 1));
    setSelected(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={{ width: '100%' }} onPress={() => {}}>
          <NeuCard radius={26} style={styles.calCard}>
            <Text style={styles.calTitle}>Available Dates</Text>
            <Text style={styles.calSub}>{equipment.name}</Text>

            <View style={styles.calMonthRow}>
              <Pressable
                disabled={isCurrentMonth}
                onPress={() => changeMonth(-1)}
                style={[styles.calArrow, isCurrentMonth && { opacity: 0.3 }]}>
                <Ionicons name="chevron-back" size={20} color="#1F3D24" />
              </Pressable>
              <Text style={styles.calMonth}>
                {MONTHS[m]} {year}
              </Text>
              <Pressable onPress={() => changeMonth(1)} style={styles.calArrow}>
                <Ionicons name="chevron-forward" size={20} color="#1F3D24" />
              </Pressable>
            </View>

            <View style={styles.calGrid}>
              {WEEKDAYS.map((w, i) => (
                <View key={'w' + i} style={styles.calCell}>
                  <Text style={styles.calWeekday}>{w}</Text>
                </View>
              ))}
              {cells.map((d, i) => {
                if (d === null) return <View key={'e' + i} style={styles.calCell} />;
                const past = isPast(d);
                const booked = isBooked(d);
                return (
                  <Pressable
                    key={'d' + d}
                    style={styles.calCell}
                    disabled={past}
                    onPress={() => setSelected(d)}>
                    <View
                      style={[
                        styles.calDay,
                        !past && {
                          backgroundColor: booked ? '#F6D9D6' : '#DDEFD9',
                        },
                        selected === d && styles.calDaySelected,
                      ]}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '700',
                          color: past ? '#A9B6A6' : booked ? '#B3261E' : '#2E7D32',
                        }}>
                        {d}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: '#2E7D32' }]} />
                <Text style={styles.legendText}>Available</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: '#B3261E' }]} />
                <Text style={styles.legendText}>Not available</Text>
              </View>
            </View>

            <Text style={styles.calResult}>
              {selected
                ? MONTHS[m].slice(0, 3) + ' ' + selected + ', ' + year + ': ' +
                  (isBooked(selected) ? 'Not available' : 'Available')
                : equipment.available
                ? 'Tap a date to check if it is available.'
                : 'This equipment is currently booked.'}
            </Text>

            <PrimaryButton title="Close" onPress={onClose} />
          </NeuCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* ---------------------------------------------------------
   SCREEN 3: EQUIPMENT DETAILS (receives params)
   Full-screen image, back + heart + notification buttons,
   neumorphism cards, availability calendar, message button.
--------------------------------------------------------- */
const FEATURES = [
  { icon: 'construct-outline', label: 'Well Maintained' },
  { icon: 'shield-checkmark-outline', label: 'Verified Owner' },
  { icon: 'calendar-outline', label: 'Available Dates', calendar: true },
];

export function EquipmentDetailsScreen({ navigation, route }) {
  const equipment = EQUIPMENT.find(
    (item) => item.id === route.params?.equipmentId
  );
  const insets = useSafeAreaInsets();
  const { notifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  const [favorite, setFavorite] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  if (!equipment) {
    return <InvalidRouteScreen navigation={navigation} />;
  }

  // other equipment for the "You may also like" row
  const related = EQUIPMENT.filter((e) => e.id !== equipment.id).slice(0, 5);

  return (
    <GradientScreen navigation={navigation} header={false}>
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Full screen product image (behind the buttons) */}
          <Image source={equipment.image} style={styles.heroImage} />

          {/* Info sheet */}
          <View style={styles.sheet}>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.pillStatus,
                  {
                    backgroundColor: equipment.available ? '#DDEFD9' : '#F6D9D6',
                  },
                ]}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: equipment.available
                        ? '#2E7D32'
                        : '#B3261E',
                    },
                  ]}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: equipment.available ? '#2E7D32' : '#B3261E',
                  }}>
                  {equipment.available ? 'Available' : 'Booked'}
                </Text>
              </View>
            </View>

            <Text style={styles.detailName}>{equipment.name}</Text>
            <Text style={styles.sheetPrice}>
              P{equipment.price}
              <Text style={styles.sheetPriceUnit}> / day</Text>
            </Text>

            <View style={styles.ratingRow}>
              <Stars rating={equipment.rating} />
              <Text style={styles.ratingText}>{equipment.rating} / 5</Text>
            </View>

            <Text style={styles.sheetDesc}>{equipment.desc}</Text>

            {/* Feature cards (neumorphism) */}
            <View style={styles.featureRow}>
              {FEATURES.map((f) => (
                <Pressable
                  key={f.label}
                  style={styles.featureWrap}
                  onPress={f.calendar ? () => setShowCalendar(true) : undefined}>
                  <NeuCard style={styles.featureCard}>
                    <Ionicons
                      name={f.icon}
                      size={26}
                      color="#2E7D32"
                      style={{ marginBottom: 6 }}
                    />
                    <Text style={styles.featureText}>{f.label}</Text>
                    {f.calendar && <Text style={styles.featureHint}>Tap to view</Text>}
                  </NeuCard>
                </Pressable>
              ))}
            </View>

            {/* Owner */}
            <NeuCard outerStyle={{ marginTop: 22 }} style={styles.ownerCard}>
              <View style={styles.ownerAvatar}>
                <Text style={styles.ownerAvatarText}>
                  {equipment.owner.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.equipOwner}>Provided by</Text>
                <Text style={styles.ownerName}>{equipment.owner}</Text>
              </View>
            </NeuCard>

            {/* You may also like */}
            <Text style={styles.alsoTitle}>You May Also Like</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -20 }}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingVertical: 14,
              }}>
              {related.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.alsoWrap}
                  // PARAMETER PASSING: open another equipment's details
                  onPress={() =>
                    navigation.push('EquipmentDetails', {
                      equipmentId: item.id,
                    })
                  }>
                  <NeuCard style={styles.alsoCard}>
                    <Image source={item.image} style={styles.alsoImage} />
                    <Text style={styles.alsoName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.alsoPrice}>P{item.price} / day</Text>
                  </NeuCard>
                </Pressable>
              ))}
            </ScrollView>
            <View style={{ height: 10 }} />
          </View>
        </ScrollView>

        {/* Back + heart + notification buttons on top of the image */}
        <View
          pointerEvents="box-none"
          style={[styles.topButtons, { top: insets.top + 10 }]}>
          <Pressable
            style={styles.roundBtn}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#1F3D24" />
          </Pressable>
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              style={[styles.roundBtn, { marginRight: 10 }]}
              onPress={() => setFavorite(!favorite)}>
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={22}
                color={favorite ? '#E53935' : '#1F3D24'}
              />
            </Pressable>
            <Pressable
              style={styles.roundBtn}
              onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={22} color="#1F3D24" />
              {unread > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>
                    {unread > 9 ? '9+' : unread}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Bottom bar: message icon + Book Now */}
        <View
          style={[
            styles.buyBar,
            { paddingBottom: Math.max(insets.bottom, 14) },
          ]}>
          <Pressable
            style={{ marginRight: 16 }}
            // PARAMETER PASSING: owner + equipment go to the chat screen
            onPress={() =>
              navigation.navigate('Chat', {
                owner: equipment.owner,
                equipmentId: equipment.id,
              })
            }>
            <NeuCard radius={26} style={styles.msgBtn}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#2E7D32"
              />
            </NeuCard>
          </Pressable>

          <Pressable
            disabled={!equipment.available}
            style={{ flex: 1 }}
            // PARAMETER PASSING: selected equipment goes to the booking form
            onPress={() =>
              navigation.navigate('BookingForm', {
                equipmentId: equipment.id,
              })
            }>
            <NeuCard
              radius={16}
              style={[
                styles.bookBtn,
                !equipment.available && { backgroundColor: '#9BAA98' },
              ]}>
              <Ionicons name="calendar-outline" size={18} color="#FFFFFF" />
              <Text style={styles.bookBtnText}>
                {equipment.available
                  ? 'Book Now  P' + equipment.price
                  : 'Not Available'}
              </Text>
            </NeuCard>
          </Pressable>
        </View>

        <AvailabilityCalendar
          visible={showCalendar}
          onClose={() => setShowCalendar(false)}
          equipment={equipment}
        />
      </View>
    </GradientScreen>
  );
}

/* ---------------------------------------------------------
   SCREEN 8: CHAT WITH OWNER (receives params)
--------------------------------------------------------- */
export function ChatScreen({ navigation, route }) {
  const equipment = EQUIPMENT.find(
    (item) => item.id === route.params?.equipmentId
  );
  const owner = route.params?.owner;
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm0',
      from: 'owner',
      text:
        'Hi! I am ' +
        (owner || 'the owner') +
        '. Ask me anything about the ' +
        (equipment?.name || 'this equipment') +
        '.',
    },
  ]);
  if (!equipment || !owner) {
    return <InvalidRouteScreen navigation={navigation} />;
  }

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [...prev, { id: 'm' + Date.now(), from: 'me', text: t }]);
    setText('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: 'r' + Date.now(), from: 'owner', text: 'Thanks for your message! I will reply soon.' },
      ]);
    }, 800);
  };

  return (
    <GradientScreen navigation={navigation} header={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}>
        <View style={{ padding: 16 }}>
          <NeuCard style={styles.chatHead}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerAvatarText}>{owner.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ownerName}>{owner}</Text>
              <Text style={styles.equipOwner}>About: {equipment.name}</Text>
            </View>
          </NeuCard>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.bubble,
                msg.from === 'me' ? styles.bubbleMe : styles.bubbleOwner,
              ]}>
              <Text
                style={{
                  fontSize: 14,
                  color: msg.from === 'me' ? '#FFFFFF' : '#1F3D24',
                }}>
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View
          style={[
            styles.chatInputRow,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}>
          <NeuCard outerStyle={{ flex: 1, marginRight: 12 }} radius={22}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor="#6B7F6C"
              style={styles.chatInput}
              onSubmitEditing={send}
            />
          </NeuCard>
          <Pressable onPress={send}>
            <NeuCard radius={24} style={styles.sendBtn}>
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </NeuCard>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </GradientScreen>
  );
}

/* ---------------------------------------------------------
   SCREEN 4: BOOKING FORM (receives params, creates booking)
--------------------------------------------------------- */
export function BookingFormScreen({ navigation, route }) {
  const equipment = EQUIPMENT.find(
    (item) => item.id === route.params?.equipmentId
  );
  const { addBooking } = useApp();
  // start with the days chosen on the details screen
  const [days, setDays] = useState(route.params?.days ?? 1);
  if (!equipment) {
    return <InvalidRouteScreen navigation={navigation} />;
  }

  const confirm = () => {
    addBooking(equipment, days);
    navigation.navigate('Bookings');
  };

  return (
    <GradientScreen navigation={navigation} header={false}>
      <ScrollView style={styles.screenInner}>
        <View style={[styles.neu, styles.equipCard]}>
          <Image source={equipment.image} style={styles.equipImage} />
          <View style={styles.equipInfo}>
            <Text style={styles.equipName}>{equipment.name}</Text>
            <Text style={styles.equipOwner}>Owner: {equipment.owner}</Text>
            <Text style={styles.equipPrice}>P{equipment.price} / day</Text>
          </View>
        </View>

        <View style={[styles.neu, styles.detailBox]}>
          <Text style={styles.detailLabel}>Number of days</Text>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setDays(Math.max(1, days - 1))}>
              <Text style={styles.stepText}>-</Text>
            </Pressable>
            <Text style={styles.stepValue}>{days}</Text>
            <Pressable style={styles.stepBtn} onPress={() => setDays(days + 1)}>
              <Text style={styles.stepText}>+</Text>
            </Pressable>
          </View>

          <Text style={styles.detailLabel}>Total price</Text>
          <Text
            style={[styles.detailValue, { color: '#E07A1F', fontSize: 24 }]}>
            P{equipment.price * days}
          </Text>
        </View>

        <PrimaryButton title="Confirm Booking" onPress={confirm} />
        <View style={{ height: 12 }} />
        <PrimaryButton
          title="Cancel"
          danger
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </GradientScreen>
  );
}

/* ---------------------------------------------------------
   SCREEN 5: MY BOOKINGS
--------------------------------------------------------- */
const statusColor = (s) =>
  s === 'Approved' ? '#2E7D32' : s === 'Pending' ? '#B7791F' : '#B3261E';

export function BookingsScreen({ navigation }) {
  const { bookings } = useApp();
  const [filter, setFilter] = useState('All');
  const list = bookings.filter((b) => filter === 'All' || b.status === filter);

  return (
    <GradientScreen navigation={navigation} active="Bookings">
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>My bookings</Text>
        <Text style={styles.pageSub}>
          Keep track of your equipment rentals.
        </Text>

        <View style={styles.chipWrap}>
          {['All', 'Pending', 'Approved', 'Cancelled'].map((f) => (
            <Chip
              key={f}
              label={f}
              active={filter === f}
              onPress={() => setFilter(f)}
            />
          ))}
        </View>

        {list.length === 0 && (
          <Text style={styles.emptyText}>No bookings here.</Text>
        )}
        {list.map((b) => (
          <Pressable
            key={b.id}
            style={({ pressed }) => [
              styles.neu,
              styles.equipCard,
              pressed && styles.pressed,
            ]}
            // PARAMETER PASSING: selected booking goes to BookingDetails
            onPress={() =>
              navigation.navigate('BookingDetails', { bookingId: b.id })
            }>
            <Image source={b.equipment.image} style={styles.bookingImage} />
            <View style={styles.equipInfo}>
              <Text style={styles.equipName}>{b.equipment.name}</Text>
              <Text style={styles.equipOwner}>{b.code}</Text>
              <Text style={styles.equipOwner}>{b.dateRange}</Text>
              <View style={styles.equipFooter}>
                <Text style={styles.equipPrice}>P{b.total}</Text>
                <Text
                  style={[
                    styles.statusBadge,
                    { color: statusColor(b.status) },
                  ]}>
                  {b.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </GradientScreen>
  );
}

/* ---------------------------------------------------------
   SCREEN 6: BOOKING DETAILS (receives params)
--------------------------------------------------------- */
export function BookingDetailsScreen({ navigation, route }) {
  const { bookings, cancelBooking } = useApp();
  const passed = bookings.find((b) => b.id === route.params?.bookingId);
  if (!passed) {
    return <InvalidRouteScreen navigation={navigation} />;
  }
  // use the latest version so status updates after cancelling
  const booking = bookings.find((b) => b.id === passed.id) || passed;

  return (
    <GradientScreen navigation={navigation} header={false}>
      <ScrollView style={styles.screenInner}>
        <View style={[styles.neu, { padding: 10, marginBottom: 18 }]}>
          <Image source={booking.equipment.image} style={styles.detailImage} />
        </View>
        <Text style={styles.detailName}>{booking.equipment.name}</Text>
        <Text style={styles.detailCategory}>{booking.code}</Text>

        <View style={[styles.neu, styles.detailBox]}>
          <Text style={styles.detailLabel}>Owner</Text>
          <Text style={styles.detailValue}>{booking.equipment.owner}</Text>
          <Text style={styles.detailLabel}>Rental period</Text>
          <Text style={styles.detailValue}>{booking.dateRange}</Text>
          <Text style={styles.detailLabel}>Days</Text>
          <Text style={styles.detailValue}>{booking.days}</Text>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={[styles.detailValue, { color: '#E07A1F' }]}>
            P{booking.total}
          </Text>
          <Text style={styles.detailLabel}>Status</Text>
          <Text
            style={[
              styles.detailValue,
              { color: statusColor(booking.status) },
            ]}>
            {booking.status}
          </Text>
        </View>

        {booking.status === 'Pending' && (
          <PrimaryButton
            title="Cancel Booking"
            danger
            onPress={() => cancelBooking(booking.id)}
          />
        )}
        <View style={{ height: 12 }} />
        <PrimaryButton
          title="Back to My Bookings"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </GradientScreen>
  );
}

/* ---------------------------------------------------------
   SCREEN 7: NOTIFICATIONS
--------------------------------------------------------- */
export function NotificationsScreen({ navigation }) {
  const { notifications, markRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <GradientScreen navigation={navigation} active="Notifications">
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Notifications</Text>
        <Text style={styles.pageSub}>
          Unread notifications: {unread}. Tap a card to mark it as read.
        </Text>

        {notifications.map((n) => (
          <Pressable
            key={n.id}
            style={({ pressed }) => [
              styles.neu,
              styles.notifCard,
              pressed && styles.pressed,
            ]}
            onPress={() => markRead(n.id)}>
            <View
              style={[
                styles.notifDot,
                { backgroundColor: n.read ? '#B9C6B5' : '#E53935' },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.equipName}>{n.title}</Text>
              <Text style={styles.equipOwner}>{n.body}</Text>
              <Text style={styles.equipOwner}>{n.time}</Text>
            </View>
          </Pressable>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </GradientScreen>
  );
}

/* ---------------------------------------------------------
   NAVIGATION
--------------------------------------------------------- */
