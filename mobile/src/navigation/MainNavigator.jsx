import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import GroupsScreen from '../screens/groups/GroupsScreen';
import ActivityScreen from '../screens/activity/ActivityScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { colors, fonts } from '../constants/theme';

const Tab = createBottomTabNavigator();

const ICONS = {
    Dashboard: 'home-outline',
    Groups: 'people-outline',
    Activity: 'notifications-outline',
    Profile: 'person-outline',
};

export default function MainNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name={ICONS[route.name]} size={size} color={color} />
                ),
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.inkFaint,
                tabBarLabelStyle: {
                    fontFamily: fonts.regular,
                    fontSize: 14,
                },
                tabBarStyle: {
                    backgroundColor: colors.paper,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    paddingBottom: 6,
                    height: 58,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Groups" component={GroupsScreen} />
            <Tab.Screen name="Activity" component={ActivityScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}