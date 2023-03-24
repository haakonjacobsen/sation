import {Alert, Button, StyleSheet, Text, View} from "react-native";
import {useState} from "react";
import { Audio } from 'expo-av';
import {Recording} from "expo-av/build/Audio/Recording";

type RecordingObject = {
  filname: string;
  file: string | null;
  duration: string;
  sound: Audio.Sound;
}
export default function RecordScreen() {
  const [recording, setRecording] = useState<Recording>();
  const [recordings, setRecordings] = useState<RecordingObject[]>([]);
  const [message, setMessage] = useState<string>('');

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  const getPromptResponse = () =>
    new Promise<string>((resolve) => {
      Alert.prompt(
        "Name your recording",
        "Your recording has been saved to your device",
        (text) => {
          resolve(text);
        }
      );
  });

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    if (recording){
      await recording.stopAndUnloadAsync();
      let updatedRecordings = [...recordings];
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      if (!status.isLoaded) {
        console.log('Failed to load recording');
      } else  {
        let filname = await getPromptResponse();
        if (!filname) {
          filname = 'Untitled';
        }
        if(status.durationMillis) {
          updatedRecordings.push({
            filname,
            sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI(),
          });
          setRecordings(updatedRecordings);
        }
      }
    }
  }

  function getRecordingLines() {
    return recordings.map((recording, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>{recording.filname} {recording.duration}</Text>
          <Button title={'Play recording'} onPress={() => recording.sound.replayAsync} />
        </View>
      );
    });
  }

  function getDurationFormatted(millis: number) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }


  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {getRecordingLines()}
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
  row: {
    width:'80%',
    height: 50,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
  }
});
