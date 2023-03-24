import {StyleSheet, Switch, Text, View} from "react-native";
import React from "react";
import {theme} from "../styles/theme";
import {useRecoilState} from "recoil";
import {darkModeState, useHighQualityRecordingState} from "../recoil/atoms";
import {Entypo, Feather} from "@expo/vector-icons";

export default function SationSettings() {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [highQualityRecording, setHighQualityRecording] = useRecoilState(useHighQualityRecordingState);

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <View style={styles.settingTextContainer}>
          <Entypo name={'sound-mix'} size={24} color={theme.text.primary} style={styles.settingIcon}/>
          <Text numberOfLines={2} style={styles.settingText} >{"Use High Quality"}</Text>
        </View>
        <Switch
          trackColor={{false: theme.background.primary, true: theme.sation.primary}}
          ios_backgroundColor={theme.background.primary}
          onValueChange={() => setHighQualityRecording(!highQualityRecording)}
          value={highQualityRecording}
        />
      </View>
      <View style={styles.settingRow}>
        <View style={styles.settingTextContainer}>
          <Feather name={'moon'} size={24} color={theme.text.primary} style={styles.settingIcon} />
          <Text numberOfLines={2} style={styles.settingText} >{"Dark Mode"}</Text>
        </View>
        <Switch
          trackColor={{false: theme.background.primary, true: theme.sation.primary}}
          ios_backgroundColor={theme.background.primary}
          onValueChange={() => setDarkMode(!darkMode)}
          value={darkMode}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems:'center',
    width: '100%',

  },
  settingRow:{
    justifyContent:'space-between',
    width: '75%',
    flexDirection: 'row',
    marginBottom: 32,
    alignItems: 'center',
  },
  settingTextContainer: {
    flexDirection: 'row',
  },
  settingText: {
    fontWeight: 'bold',
    color: theme.text.primary,
    fontSize: 20,
  },
  settingIcon: {
    marginRight: 12,
  }
});
