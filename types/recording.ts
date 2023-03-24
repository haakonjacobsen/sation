import {Audio} from "expo-av";

export type RecordingObject = {
  filname: string;
  file: string | null;
  duration: string;
  sound: Audio.Sound;
  date: Date;
}
