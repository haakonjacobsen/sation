import {AlignedResult} from "../api/transcribeSoundFile";
import React, {useRef, useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {theme} from "../styles/theme";
import {FontAwesome} from "@expo/vector-icons";

interface TranscriptWordProps {
  item: AlignedResult,
  index: number,
  onWordUpdate: (index: number, text: string) => void
}
export default function TranscriptWord({item, index, onWordUpdate}: TranscriptWordProps) {
  const textInputRef = useRef(null);
  const { text, start, end } = item;
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);
  function handleTextInput(text: string) {
    console.log('handling text:', text)
    setEditing(false);
    onWordUpdate(index, text); // Update the word in the parent component
  }

  return (
    <View style={editing && {zIndex: 100}}>
      <TextInput
        ref={textInputRef}
        defaultValue={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={() => handleTextInput(inputValue)}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        style={[
          styles.textInput,
          editing && styles.textInputEditing
        ]}
      />
      {editing && (
        <TouchableOpacity style={styles.newActionPanel}>
          <FontAwesome name="magic" size={20} color={theme.text.primary} style={{marginRight: 8}}/>
          <Text style={styles.actionPanelText}>Fix</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  newActionPanel: {
    width: 70,
    position:'absolute',
    left: '-50%',
    bottom: -40,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:theme.background.secondary,
    shadowColor: 'rgba(137, 169, 170, 0.25)',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    borderRadius: 10,
    padding: 6,
  },
  actionPanelText: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    color: theme.text.primary,
    borderRadius: 6,
    fontSize: 23,
    marginRight: 7
  },
  textInputEditing: {
    color: theme.sation.primary,
    fontWeight: '400',
    backgroundColor: theme.background.secondary,
  }
});
