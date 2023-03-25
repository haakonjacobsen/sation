import {Audio} from "expo-av";

export type RecordingObject = {
  filname: string;
  file: string;
  duration: string;
  sound: Audio.Sound;
  date: Date;
}
