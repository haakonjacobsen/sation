import {Segment, TranscriptionResponse} from "../api/transcribeSoundFile";
import {QueryObserverResult} from "react-query";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {secondsToTimeString} from "../utils/secondsToTime";
import React, {useRef, useState} from "react";
import {theme} from "../styles/theme";

interface TrascriptSegmentProps {
  item: Segment;
  filename: string;
  refetch: () => Promise<QueryObserverResult<TranscriptionResponse | undefined, unknown>>
  onSegmentUpdate: (index: number, text: string) => void
}
export default function TranscriptSegement({item, onSegmentUpdate}: TrascriptSegmentProps) {
  const textInputRef = useRef(null);
  const { text, start, end, id} = item;
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);

  function handleTextInput(text: string) {
    console.log('handling segment edit:', text)
    setEditing(false);
    onSegmentUpdate(id, text); // Update the word in the parent component
  }

  return (
    <View style={[editing && {zIndex: 100},styles.transciptSegment]}>
      <Text style={styles.timestampText}>{secondsToTimeString(start)}</Text>
      <TextInput
        ref={textInputRef}
        defaultValue={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={() => handleTextInput(inputValue)}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        style={[
          styles.textInputMultiLine,
          editing && styles.textInputEditing
        ]}
        multiline={true}
        blurOnSubmit={true}
        returnKeyType="done"
      />
      {editing && (
        <TouchableOpacity style={styles.handleButton}>
          <Text>Fix</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.timestampText}>{secondsToTimeString(end)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  timestampText:{
    textAlign: 'center',
    color: theme.text.secondary,
  },
  transcriptionText: {
    width: '100%',
    padding: 8,
    flex: 1,
    marginBottom: 4,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: theme.text.primary,
  },
  transciptSegment: {
    alignItems:'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection:'row'
  },
  textInputMultiLine: {
    flex: 1,
    padding: 8,
    color: theme.text.primary,
    borderRadius: 6,
    fontSize: 23,
    marginRight: 7
  },
  textInputEditing: {
    color: theme.sation.secondary,
    fontWeight: '400',
    backgroundColor: theme.background.secondary,
  },
  handleButton: {
    width: 70,
    position:'absolute',
    left: '-50%',
    height: 40,
    backgroundColor: theme.background.secondary,
  }
});
