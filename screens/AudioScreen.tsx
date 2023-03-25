import {FlatList, StyleSheet, Text, View} from "react-native";
import {RootStackParamList} from "../types/navigation";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import React, {useRef} from "react";
import AudioBottomSheet, {AudioBottomSheetRefProps} from "../components/animated/AudioBottomSheet";
import {theme} from "../styles/theme";
import {AudioController} from "../components/AudioController";
import {Segment, uploadSoundFile} from "../api/uploadSoundFile";
import {useQuery} from "react-query";
import {secondsToTimeString} from "../utils/secondsToTime";


type AudioScreenProps = NativeStackScreenProps<RootStackParamList, 'AudioScreen'>
export default function AudioScreen({ route }: AudioScreenProps) {
  const { recording } = route.params;
  const audioBottomSheetRef = useRef<AudioBottomSheetRefProps>(null);

  const {data, isLoading, isError} = useQuery(['uploadSoundFile', recording.file],  () => uploadSoundFile(recording.file), {
    enabled: !!recording,
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptionText}>Loading...</Text>
        </View>
        <AudioBottomSheet ref={audioBottomSheetRef}>
          <AudioController recording={recording} />
        </AudioBottomSheet>
      </View>
    );
  }
  else if (isError) {
    if (isLoading) {
      return (
        <View style={styles.container}>
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptionText}>Something went wrong</Text>
          </View>
          <AudioBottomSheet ref={audioBottomSheetRef}>
            <AudioController recording={recording} />
          </AudioBottomSheet>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{width: '100%', padding: 16, paddingBottom: 50}}
        data={data?.segments}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <TrascriptSegment item={item}/>
        )}
      />
      <AudioBottomSheet ref={audioBottomSheetRef}>
        <AudioController recording={recording} />
      </AudioBottomSheet>
    </View>
  );
}

interface TrascriptSegmentProps {
  item: Segment;
}
function TrascriptSegment({item}: TrascriptSegmentProps) {
  return (
    <View style={styles.transciptSegment}>
      <Text style={styles.timestampText}>{secondsToTimeString(item.start)}</Text>
      <Text style={styles.transcriptionText}>{item.text}</Text>
      <Text style={styles.timestampText}>{secondsToTimeString(item.end)}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.primary,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  transcriptContainer: {
    padding: 16,
    height: '100%',
    paddingBottom: 50,
    width: '100%',
    backgroundColor: theme.background.primary,
  },
  timestampText:{
    color: theme.text.secondary,
  },
  transcriptionText: {
    padding: 8,
    flex:1,
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
});
