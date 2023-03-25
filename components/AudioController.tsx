import {RecordingObject} from "../types/recording";
import React, {useEffect, useState} from "react";
import {Audio} from "expo-av";
import {Button, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {theme} from "../styles/theme";
import * as Sharing from "expo-sharing";
import {uploadSoundFile} from "../api/uploadSoundFile";

export function AudioController({ recording }: { recording:RecordingObject } ) {
  const [sound, setSound] = useState<Audio.Sound>();
  async function playSound() {
    recording.sound.playAsync();
  }

  async function stopSound() {
    recording.sound.stopAsync();
  }

  async function searchAudio() {
    console.log('Searching in audio');
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
    <View style={styles.audioControllerContainer}>
      <Text style={styles.durationText}>{recording.duration}</Text>
      <View style={styles.audioController}>
        <TouchableOpacity onPress={playSound}>
          <Ionicons name="ios-play" size={55} color={theme.text.primary} onPress={playSound}/>
        </TouchableOpacity>
        <Image source={{uri: 'https://i.imgur.com/ytSSH2J.png'}} style={{resizeMode:'contain', flexGrow: 1, height: 100}} />
        <TouchableOpacity onPress={playSound}>
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
