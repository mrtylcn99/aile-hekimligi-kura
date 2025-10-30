import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Colors} from '../styles/Colors';

// Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import KuraListScreen from '../screens/main/KuraListScreen';
import ApplicationsScreen from '../screens/main/ApplicationsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

export type TabParamList = {
  Dashboard: undefined;
  KuraList: undefined;
  Applications: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  name: string;
  color: string;
  size: number;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({name, color, size, focused}) => (
  <View style={{alignItems: 'center', justifyContent: 'center'}}>
    <Icon
      name={name}
      size={focused ? size + 2 : size}
      color={color}
    />
    {focused && (
      <View
        style={{
          position: 'absolute',
          top: -8,
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: color,
        }}
      />
    )}
  </View>
);

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 0.5,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 10,
          shadowColor: Colors.shadow,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'KuraList':
              iconName = 'list-alt';
              break;
            case 'Applications':
              iconName = 'assignment';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return (
            <TabIcon
              name={iconName}
              color={color}
              size={size}
              focused={focused}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
        }}
      />
      <Tab.Screen
        name="KuraList"
        component={KuraListScreen}
        options={{
          tabBarLabel: 'Kuralar',
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{
          tabBarLabel: 'Başvurularım',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;