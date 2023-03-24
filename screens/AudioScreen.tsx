import {Button, StyleSheet, Text, View} from "react-native";
import {RootStackParamList} from "../types/navigation";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useEffect, useState} from "react";
import {Audio} from "expo-av";

type AudioScreenProps = NativeStackScreenProps<RootStackParamList, 'AudioScreen'>
export default function AudioScreen({route}: AudioScreenProps) {
  const { recording } = route.params;
  const [sound, setSound] = useState<Audio.Sound>();

  async function playSound() {
    recording.sound.playAsync();
  }

  async function stopSound() {
    recording.sound.stopAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);


  return (
    <View style={styles.container}>
      <Text>{recording.filname}</Text>
      <Text>{recording.duration}</Text>
      <Button title="Play Sound" onPress={() => playSound()} />
      <Button title="Stop Sound" onPress={() => stopSound()} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
