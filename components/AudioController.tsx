import {RecordingObject} from "../types/recording";
import React, {useEffect, useState} from "react";
import {Audio} from "expo-av";
import {Button, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {theme} from "../styles/theme";
import * as Sharing from "expo-sharing";
import {uploadSoundFile} from "../api/uploadSoundFile";
import {Slider} from "react-native-awesome-slider";
import {useSharedValue} from "react-native-reanimated";

export function AudioController({ recording }: { recording: RecordingObject } ) {
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(recording.durationMillis);
  const [sound, _setSound] = useState<Audio.Sound>();

  async function handleSoundPlayback() {

    const info = await recording.sound?.getStatusAsync();
    if (info.isLoaded) {
      if (info.isPlaying) {
        recording.sound.playAsync();
      } else {
        recording.sound.stopAsync();
      }
    }
    else {
      console.log('Loading sound');
      recording.sound.playAsync();
    }
  }


  async function playSound() {
    recording.sound.playAsync();
  }

  async function stopSound() {
    recording.sound.stopAsync();
  }

  async function searchAudio() {
    console.log('Searching in audio');
  }

  return (
    <View style={styles.audioControllerContainer}>
      <Text style={styles.durationText}>{recording.durationString}</Text>
      <View style={styles.audioController}>
        <TouchableOpacity>
          <Ionicons name="ios-play" size={55} color={theme.text.primary} onPress={playSound}/>
        </TouchableOpacity>
        <Slider
          theme={{
            disableMinTrackTintColor: theme.text.secondary,
            maximumTrackTintColor: theme.text.secondary,
            minimumTrackTintColor: theme.sation.primary,
            cacheTrackTintColor: '#333',
            bubbleBackgroundColor: '#666',
          }}
          style={{backgroundColor: 'red', flex: 1}}
          progress={progress}
          minimumValue={min}
          maximumValue={max}
        />
        <TouchableOpacity onPress={() => console.log('Searching ...')}>
          <Ionicons name="ios-search" size={50}  color={theme.text.primary} onPress={searchAudio}/>
        </TouchableOpacity>
      </View>
      <Button title="Share" onPress={() => Sharing.shareAsync(recording.file, { UTI: '.m4a', mimeType: 'audio/mp4' })} />
      <Button title="Upload" onPress={() => uploadSoundFile(recording.file)} />
    </View>
  )
}

const styles = StyleSheet.create({
  durationText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: theme.sation.primary,
  },
  audioControllerContainer: {
    padding: 16,
    width:'100%',
  },
  audioController: {
    marginBottom: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent:'space-between'
  }
})
