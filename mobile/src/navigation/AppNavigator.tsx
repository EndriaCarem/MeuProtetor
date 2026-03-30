/**
 * AppNavigator — navegação principal do app MeuProtetor
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { GothicTheme } from '../theme/gothicTheme';

export type RootStackParamList = {
  Onboarding: undefined;
  Dashboard:  undefined;
  Settings:   undefined;
  History:    undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const screenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: GothicTheme.colors.bg.void },
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={screenOptions}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
