import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {RootStackParamList} from "../types/navigation";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import React, {useRef} from "react";
import AudioBottomSheet, {AudioBottomSheetRefProps} from "../components/animated/AudioBottomSheet";
import {theme} from "../styles/theme";
import {AudioController} from "../components/AudioController";
import {Segment, transcribeSoundFile, TranscriptionResponse} from "../api/transcribeSoundFile";
import {QueryObserverResult, useQuery} from "react-query";
import {secondsToTimeString} from "../utils/secondsToTime";
import LottieView from "lottie-react-native";
import getFlagEmoji from "../utils/getFlagEmoji";
import * as Clipboard from 'expo-clipboard';
import {updateSegment} from "../api/updateSegment";

type AudioScreenProps = NativeStackScreenProps<RootStackParamList, 'AudioScreen'>
export default function AudioScreen({ route }: AudioScreenProps) {
  const animation = useRef(null);
  const { recording } = route.params;
  const audioBottomSheetRef = useRef<AudioBottomSheetRefProps>(null);

  const { data, isLoading, isError, refetch } = useQuery(
    ['transcribeFile', recording.file],
    () => transcribeSoundFile(recording.file),
    {
      enabled: !!recording.file,
    }
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.transcriptContainer}>
          <LottieView
            autoPlay
            ref={animation}
            style={{ marginTop: 30, alignSelf: 'center', width: '90%' }}
            source={require('../assets/lottie/transcribing.json')}
          />
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
        style={{height: '50%', width: '100%', padding: 16, paddingBottom: 50, overflow: 'visible'}}
        data={data?.segments}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <TrascriptSegment item={item} filename={recording.file} refetch={refetch}/>
        )}
        ListHeaderComponent={<TranscriptHeader header={recording.filname}/>}
      />
      <AudioBottomSheet ref={audioBottomSheetRef}>
        <AudioController recording={recording} />
      </AudioBottomSheet>
    </View>
  );
}


function TranscriptHeader({header}: {header: string}) {
  return (
    <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25 }}>
      <TouchableOpacity style={styles.headerContainer}>
        <Text style={styles.headerText}>{header}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerContainer}>
        <Text style={styles.headerText}>{getFlagEmoji('en')}</Text>
      </TouchableOpacity>
    </View>
  )
}


interface TrascriptSegmentProps {
  item: Segment;
  filename: string;
  refetch: () => Promise<QueryObserverResult<TranscriptionResponse | undefined, unknown>>
}
function TrascriptSegment({item, filename, refetch}: TrascriptSegmentProps) {
  const { text } = item;
  async function copyToClipboard(){
    await Clipboard.setStringAsync(text);
  }

  async function magicallyFixText() {
    const response = await updateSegment(filename, item.id, text);
    if (!response || !response.ok) {
      Alert.alert('Something went wrong :(');
      return;
    }
    const data = await response.json() as { message: string, old: string, new: string};
    console.log('data', data);
    Alert.alert('Magic success! :)', `${data.old} \n \n ${data.new}`);
    refetch();
  }

  return (
    <View style={styles.transciptSegment}>
      <Text style={styles.timestampText}>{secondsToTimeString(item.start)}</Text>
      <TouchableOpacity
        style={{ flex: 1, alignItems: 'flex-start' }}
        onPress={copyToClipboard}
        onLongPress={magicallyFixText}
      >
        <Text style={styles.transcriptionText}>{item.text}</Text>
      </TouchableOpacity>
      <Text style={styles.timestampText}>{secondsToTimeString(item.end)}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingBottom: 400,
    overflow:'visible',
    backgroundColor: theme.background.primary,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  transcriptContainer: {
    padding: 16,
    height: '50%',
    paddingBottom: 50,
    width: '100%',
  },
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
  timestampText:{
    textAlign: 'center',
    color: theme.text.secondary,
  },
  transcriptionText: {
    width: '100%',
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
