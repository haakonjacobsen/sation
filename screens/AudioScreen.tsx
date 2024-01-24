import {FlatList, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from "react-native";
import {RootStackParamList} from "../types/navigation";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import React, {useRef, useState} from "react";
import AudioBottomSheet, {AudioBottomSheetRefProps} from "../components/animated/AudioBottomSheet";
import {theme} from "../styles/theme";
import {AudioController} from "../components/AudioController";
import {transcribeSoundFile, TranscriptionResponse} from "../api/transcribeSoundFile";
import {useMutation, useQuery, useQueryClient} from "react-query";
import LottieView from "lottie-react-native";
import TranscriptSegement from "../components/TranscriptSegement";
import TranscriptWord from "../components/TranscriptWord";
import {updateWord, UpdateWordInput, UpdateWordOutput} from "../api/updateWord";
import {updateSegment, UpdateSegmentInput, UpdateSegmentOutput} from "../api/updateSegement";

type AudioScreenProps = NativeStackScreenProps<RootStackParamList, 'AudioScreen'>
export default function AudioScreen({ route }: AudioScreenProps) {
  const animation = useRef(null);
  const { recording } = route.params;
  const audioBottomSheetRef = useRef<AudioBottomSheetRefProps>(null);
  const [wordPercision, setWordPercision] = useState(false);
  const queryClient = useQueryClient();


  const { data, isLoading, isError, refetch } = useQuery(
    ['transcribeFile', recording.file],
    () => transcribeSoundFile(recording.file),
    {
      enabled: !!recording.file,
    }
  );

  const updateWordMutation = useMutation<UpdateWordOutput, Error, UpdateWordInput>(updateWord, {
    // Optimistic update function
    onMutate: (data) => {
      const previousData = queryClient.getQueryData<TranscriptionResponse>(['transcribeFile', recording.file]);
      // If previousData is undefined, do not proceed with the optimistic update
      if (!previousData) {
        return;
      }
      // Optimistically update the word at the given index with the new text
      const newData: TranscriptionResponse = {
        ...previousData,
        language: previousData.language!,
        segments: previousData.segments!,
        aligned_results: previousData.aligned_results.map((alignedResult, idx) =>
          idx === data.index ? { ...alignedResult, text: data.newText } : alignedResult
        ),
      };
      // Update the query data with the new data
      queryClient.setQueryData(['transcribeFile', recording.file], newData);
      // Return the previous data for use in onError
      return previousData;
    },
    // Rollback function in case of error
    onError: (error, variables, previousData) => {
      queryClient.setQueryData(['transcribeFile', recording.file], previousData);
    },
    // Refetch the data after a successful mutation
    onSuccess: () => {
      refetch();
    },
  });

  const updateSegmentMutation = useMutation<UpdateSegmentOutput, Error, UpdateSegmentInput>(updateSegment, {
    // Optimistic update function
    onMutate: (data) => {
      const previousData = queryClient.getQueryData<TranscriptionResponse>(['transcribeFile', recording.file]);
      // If previousData is undefined, do not proceed with the optimistic update
      if (!previousData) {
        return;
      }
      // Optimistically update the segment at the given index with the new text
      const newData: TranscriptionResponse = {
        ...previousData,
        language: previousData.language!,
        segments: previousData.segments.map((segment, idx) =>
          idx === data.index ? { ...segment, text: data.newText } : segment
        ),
      };
      // Update the query data with the new data
      queryClient.setQueryData(['transcribeFile', recording.file], newData);
      // Return the previous data for use in onError
      return previousData;
    },
    // Rollback function in case of error
    onError: (error, variables, previousData) => {
      queryClient.setQueryData(['transcribeFile', recording.file], previousData);
    },
    // Refetch the data after a successful mutation
    onSuccess: () => {
      refetch();
    },
  });


  // Add the handleSegmentUpdate function inside the AudioScreen component
  function handleSegmentUpdate(index: number, newText: string) {
    console.log('handleSegmentUpdate', recording.file, index, newText);
    // Update the segment at the given index with the new text
    // Call the mutation to update the segment
    updateSegmentMutation.mutate({ filePath: recording.file, index, newText });
  }

  function handleWordUpdate(index: number, newText: string) {
    console.log('handleWordUpdate', recording.file, index, newText);
    // Update the word at the given index with the new text
    updateWordMutation.mutate({ filePath: recording.file, index, newText });
  }



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
      {!wordPercision ? (
      <FlatList
        style={{height: '50%', width: '100%', padding: 16, paddingBottom: 50, overflow: 'visible'}}
        data={data?.segments}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <TranscriptSegement item={item} filename={recording.file} refetch={refetch} onSegmentUpdate={handleSegmentUpdate}/>
        )}
        ListHeaderComponent={<TranscriptHeader lang={data?.language} wordPercision={wordPercision} setWordPercision={setWordPercision} header={recording.filname}/>}
      />) :
        (data?.aligned_results && (
          <ScrollView style={{paddingHorizontal: 20}}>
            <TranscriptHeader lang={data?.language} wordPercision={wordPercision} setWordPercision={setWordPercision} header={recording.filname}/>
            <View style={{flexDirection : "row", flexWrap : "wrap"}}>
              {data?.aligned_results.map((item, index) => (
                <TranscriptWord
                  key={index}
                  item={item}
                  index={index}
                  onWordUpdate={handleWordUpdate}
                />
              ))}
            </View>
          </ScrollView>
        ))}
      <AudioBottomSheet ref={audioBottomSheetRef}>
        <AudioController recording={recording} />
      </AudioBottomSheet>
    </View>
  );
}


function TranscriptHeader({lang, header, wordPercision, setWordPercision}: {lang: string | undefined, header: string, wordPercision: boolean, setWordPercision: (value: boolean) => void}) {
  return (
    <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25 }}>
      <TouchableOpacity style={styles.headerContainer}>
        <Text style={styles.headerText}>{header}</Text>
      </TouchableOpacity>
      <Switch value={wordPercision} onValueChange={(value) => setWordPercision(value)}/>
      <TouchableOpacity style={styles.headerContainer}>
        <Text style={styles.headerText}>{lang ? lang : 'undefined'}</Text>
      </TouchableOpacity>
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
    flex: 1,
    marginBottom: 4,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: theme.text.primary,
  },
});
