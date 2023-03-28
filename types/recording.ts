import {Audio} from "expo-av";

export type RecordingObject = {
  filname: string;
  file: string;
  durationString: string;
  durationMillis: number;
  sound: Audio.Sound;
  date: Date;
  isUploaded: boolean;
  isTranscribed: boolean;
}
