import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {theme} from "../styles/theme";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/navigation";
import {RecordingObject} from "../types/recording";
import LottieView from "lottie-react-native";
import React, {useRef} from "react";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function RecordingItem({ recording }:{recording: RecordingObject, setRecording: Function}) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const animation = useRef(null);

  return (
    <TouchableOpacity
      disabled={!recording.isUploaded || !recording.isTranscribed}
      style={recording.isTranscribed ? styles.recordingItem : [styles.recordingItem, styles.disabledRecording]}
      onPress={() => navigation.push('AudioScreen', { recording: recording } )}
    >
      <View>
        <Text numberOfLines={1} style={styles.mainText}>{recording.filname}</Text>
        <Text numberOfLines={1} style={styles.subText}>{`${recording.date.toLocaleDateString('no')} - ${recording.durationString}`}</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        { recording.isUploaded && recording.isTranscribed && (
          <MaterialCommunityIcons name="text-box-check-outline" size={30} color={theme.text.primary} style={{ marginRight: 16 }} />
        )}
        { recording.isUploaded && !recording.isTranscribed && (
          <LottieView
            autoPlay
            ref={animation}
            style={{
              height: 60,
              width: 60,
            }}
            source={require('../assets/lottie/write.json')}
          />
        )}
        { recording.isUploaded ? (
          <MaterialCommunityIcons name="cloud-check-outline" size={30} color={theme.text.primary} />
        ) : (
          <MaterialCommunityIcons name="cloud-sync-outline" size={30} color={theme.text.secondary} style={{ marginRight: 16 }} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  recordingItem: {
    alignItems: 'center',
    flexDirection:'row',
    justifyContent:'space-between',
    overflow: 'visible',
    borderRadius: 20,
    backgroundColor: theme.background.secondary,
    padding: 16,
    height: 90,
    width: '100%',
    marginBottom: 10,
    shadowColor: 'rgba(137, 169, 170, 0.25)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  disabledRecording: {
    backgroundColor: theme.background.primary,
  },
  mainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text.primary,
  },
  subText: {
    fontSize: 12,
    color: theme.text.secondary,
  }
});
