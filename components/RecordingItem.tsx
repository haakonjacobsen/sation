import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {theme} from "../styles/theme";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/navigation";
import {RecordingObject} from "../types/recording";

export default function RecordingItem({ recording }:{recording: RecordingObject}) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity style={styles.recordingItem} onPress={() => navigation.push('AudioScreen', { recording: recording } )}>
      <View>
        <Text numberOfLines={1} style={styles.mainText}>{recording.filname}</Text>
        <Text numberOfLines={1} style={styles.subText}>{`${recording.date.toLocaleDateString('no')} - ${recording.duration}`}</Text>
      </View>
      <View>
        <Image source={{uri: 'https://i.imgur.com/ytSSH2J.png'}} style={{width: 200, height: 50}} />
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
