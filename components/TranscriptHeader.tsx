import {StyleSheet, Switch, Text, TouchableOpacity, View} from "react-native";
import getFlagEmoji from "../utils/getFlagEmoji";
import React from "react";
import {theme} from "../styles/theme";

export default function TranscriptHeader({header, wordPercision, setWordPercision}: {header: string, wordPercision: boolean, setWordPercision: (value: boolean) => void}) {
  return (
    <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25 }}>
      <TouchableOpacity style={styles.headerContainer}>
        <Text style={styles.headerText}>{header}</Text>
      </TouchableOpacity>
      <Switch value={wordPercision} onValueChange={(value) => setWordPercision(value)}/>
      <TouchableOpacity style={styles.headerContainer}>
        <Text style={styles.headerText}>{getFlagEmoji('en')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 8,
    borderRadius: 10,
    borderColor: theme.sation.primary,
    borderWidth: 1,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.sation.primary,
    fontWeight: 'bold',
  },
});

