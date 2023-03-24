import {TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./screens/HomeScreen";
import {MaterialIcons} from "@expo/vector-icons";
import React from "react";
import {theme} from "./styles/theme";
import {RootStackParamList} from "./types/navigation";
import AudioScreen from "./screens/AudioScreen";
import RecordScreen from "./screens/RecordScreen";
import { RecoilRoot} from 'recoil';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator screenOptions={({ navigation }) => {
          return {
            contentStyle: {
              backgroundColor: theme.background.primary,
            },
            animation: 'slide_from_left',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="keyboard-arrow-left" size={30} color={theme.text.primary} />
              </TouchableOpacity>
            )
          };
        }}>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: theme.background.secondary,
              },
              headerTransparent: false,
              headerTitle: 'Home',
              headerTitleStyle: {
                color: theme.text.primary,
                fontWeight: '700'
              }
          }}/>
          <Stack.Screen
            name="AudioScreen"
            component={AudioScreen}
            options={{
              headerStyle: {
                backgroundColor: theme.background.secondary,
              },
              headerTransparent: false,
              headerTitle: 'Audio',
              headerTitleStyle: {
                color: theme.text.primary,
                fontWeight: '700'
              }
            }}/>
          <Stack.Screen
            name="RecordScreen"
            component={RecordScreen}
            options={{
              headerStyle: {
                backgroundColor: theme.background.secondary,
              },
              headerTransparent: false,
              headerTitle: 'Audio',
              headerTitleStyle: {
                color: theme.text.primary,
                fontWeight: '700'
              }
            }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
}
