import {Alert, FlatList, StyleSheet, TouchableOpacity, View} from "react-native";
import {theme} from "../styles/theme";
import React, {useCallback, useEffect, useRef, useState} from "react";
import RecordingItem from "../components/RecordingItem";
import {Recording} from "expo-av/build/Audio/Recording";
import {Audio} from "expo-av";
import {SvgXml} from "react-native-svg";
import {notRecordingButton, recordingButton} from "../assets/svg/recordButtonSvg";
import * as Haptics from 'expo-haptics';
import BottomSheet, {BottomSheetRefProps} from "../components/animated/BottomSheet";
import SationSettings from "../components/SationSettings";
import {useRecoilState, useRecoilValue} from "recoil";
import {recordingsState, useHighQualityRecordingState} from "../recoil/atoms";
import LottieView from 'lottie-react-native';
import {getDurationFormatted} from "../utils/getDurationFormatted";
import {uploadSoundFile} from "../api/uploadSoundFile";
import {transcribeSoundFile} from "../api/transcribeSoundFile";

export default function HomeScreen() {
  const animation = useRef(null);
  const [recording, setRecording] = useState<Recording>();
  const [recordings, setRecordings] = useRecoilState(recordingsState);
  const bottomSheetRef = useRef<BottomSheetRefProps>(null);
  const highQualityRecording = useRecoilValue(useHighQualityRecordingState);


  async function addMockSound() {
    console.log('addMockSound');
    const { sound } = await Audio.Sound.createAsync( require('../assets/audio/test-fireship.mp3'));
    const durationMillis = await sound.getStatusAsync()
      .then(function(result) {
        if (result.isLoaded) {
          return result.durationMillis;
        }
      })
      .catch(() => undefined);
    if (!durationMillis) {
      return;
    }
    const soundObj = {
      file: 'test-fireship.mp3',
      filname: 'Fireship React',
      sound: sound,
      durationMillis,
      durationString: getDurationFormatted(durationMillis),
      date: new Date(),
      isUploaded: true,
      isTranscribed: false
    }
    setRecordings([...recordings, soundObj]);
  }

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      )
      const { recording } = await Audio.Recording.createAsync(
        highQualityRecording ?
          Audio.RecordingOptionsPresets.HIGH_QUALITY
          : Audio.RecordingOptionsPresets.LOW_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      Alert.alert('Failed to start recording', '' + err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    if (recording) {
      await recording.stopAndUnloadAsync();
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      if (!status.isLoaded) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        Alert.alert('Failed to load recording');
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      const uri = recording.getURI();
      if (uri === null) {
        Alert.alert('Error', 'Not able to save recording');
        return;
      }
      let filname = await getPromptResponse();
      if (!filname) {
        filname = `Untitled ${recordings.length + 1}`;
      }
      if(status.durationMillis ) {
        const newRecording = {
          filname,
          sound,
          durationMillis: status.durationMillis,
          durationString: getDurationFormatted(status.durationMillis),
          file: uri,
          date: new Date(Date.now() - status.durationMillis),
          isUploaded: false,
          isTranscribed: false
        }
        let updatedRecordings = [newRecording, ...recordings];
        setRecordings(updatedRecordings);
      }
      const uploadResp = await uploadSoundFile(uri);
      // Update a recording object in the recordings array with isUploadied == true
      if (uploadResp) {
        setRecordings((prevRecordings) =>
          prevRecordings.map((recording) =>
            recording.file === uri ? { ...recording, isUploaded: true } : recording
          )
        );
      }
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

  const onBottomSheetPress = useCallback(() => {
    const isActive = bottomSheetRef?.current?.isActive();
    if (isActive) {
      bottomSheetRef?.current?.scrollTo(0);
    } else {
      bottomSheetRef?.current?.scrollTo(-230);
    }
  }, []);

  async function transcribeSound() {
    const fileToTranslate = recordings.find(
      (recording) => recording.isUploaded && !recording.isTranscribed
    );

    if (fileToTranslate) {
      const data = await transcribeSoundFile(fileToTranslate.file);
      console.log('transcribeSound', fileToTranslate.file, data?.language);
      // Update the isTranslated field for the file after translation is complete
      setRecordings((prevRecordings) =>
        prevRecordings.map((recording) =>
          recording.file === fileToTranslate.file ? {...recording, isTranscribed: true} : recording
        )
      );
    }
  }


  useEffect(() => {
    if (recordings.length == 0) {
      addMockSound();
    }
    transcribeSound();
  }, [recordings]);


  return (
    <View style={{ height: '100%', paddingTop: 35 }}>
      <View style={styles.homeContainer}>
        {recordings.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ width:'100%', padding: 10, flex: 1, marginBottom: 150, overflow: 'visible' }}
          data={recordings}
          keyExtractor={(item) => item.filname}
          renderItem={({ item }) => (
            <RecordingItem recording={item} setRecording={setRecording}/>
          )}
        />) : (
          <LottieView
            autoPlay
            ref={animation}
            style={{ width: 150, height: 150}}
            source={require('../assets/lottie/astronaut-light-theme.json')}
          />)}
      </View>
      <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 125, marginBottom: 16 }}>
        <TouchableOpacity style={{width: '100%', height: 200, alignItems: 'center', marginBottom: 50}} onPress={onBottomSheetPress}>
            <SvgXml xml={'<svg viewBox="0 0 112 145" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
              '<g filter="url(#filter0_d_328_5047)">\n' +
              '<rect x="96" y="16.4575" width="112.542" height="80" rx="40" transform="rotate(90 96 16.4575)" fill="#464849"/>\n' +
              '</g>\n' +
              '<g filter="url(#filter1_i_328_5047)">\n' +
              '<path d="M56.546 42.2202C54.4033 42.2202 52.3484 43.0714 50.8332 44.5865C49.3181 46.1017 48.4669 48.1566 48.4669 50.2993V71.8436C48.4669 73.9863 49.3181 76.0412 50.8332 77.5564C52.3484 79.0715 54.4033 79.9227 56.546 79.9227C58.6887 79.9227 60.7437 79.0715 62.2588 77.5564C63.7739 76.0412 64.6251 73.9863 64.6251 71.8436V50.2993C64.6251 48.1566 63.7739 46.1017 62.2588 44.5865C60.7437 43.0714 58.6887 42.2202 56.546 42.2202V42.2202Z" stroke="#89A9AA" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>\n' +
              '</g>\n' +
              '<path d="M75.3974 66.4573V71.8433C75.3974 76.843 73.4113 81.6379 69.876 85.1732C66.3407 88.7085 61.5458 90.6946 56.5462 90.6946C51.5465 90.6946 46.7516 88.7085 43.2163 85.1732C39.6811 81.6379 37.6949 76.843 37.6949 71.8433V66.4573" stroke="#89A9AA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>\n' +
              '<path d="M56.546 90.6946V101.467" stroke="#89A9AA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>\n' +
              '<path d="M45.7739 101.467H67.3182" stroke="#89A9AA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>\n' +
              '<defs>\n' +
              '<filter id="filter0_d_328_5047" x="0" y="0.45752" width="112" height="144.542" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n' +
              '<feFlood flood-opacity="0" result="BackgroundImageFix"/>\n' +
              '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>\n' +
              '<feOffset/>\n' +
              '<feGaussianBlur stdDeviation="8"/>\n' +
              '<feComposite in2="hardAlpha" operator="out"/>\n' +
              '<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>\n' +
              '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_328_5047"/>\n' +
              '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_328_5047" result="shape"/>\n' +
              '</filter>\n' +
              '<filter id="filter1_i_328_5047" x="45.9669" y="39.7202" width="21.1582" height="46.7024" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n' +
              '<feFlood flood-opacity="0" result="BackgroundImageFix"/>\n' +
              '<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>\n' +
              '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>\n' +
              '<feOffset dy="4"/>\n' +
              '<feGaussianBlur stdDeviation="2"/>\n' +
              '<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>\n' +
              '<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>\n' +
              '<feBlend mode="normal" in2="shape" result="effect1_innerShadow_328_5047"/>\n' +
              '</filter>\n' +
              '</defs>\n' +
              '</svg>\n'}
              height={100}
              width={100}
            />
        </TouchableOpacity>
      </View>
      <BottomSheet ref={bottomSheetRef}>
        <View style={styles.recordingPanel}>
          <TouchableOpacity style={{ marginBottom: 60 }} onPress={recording ? stopRecording : startRecording}>
            <SvgXml xml={recording ? recordingButton : notRecordingButton} height={125} width={125}/>
          </TouchableOpacity>
          <SationSettings />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    overflow: 'visible',
    flex: 1,
    backgroundColor: theme.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingPanel: {
    padding: 20,
    width:'100%',
    alignItems:'center'
  }
});
