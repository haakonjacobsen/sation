import {RecordingObject} from "./recording";

export type RootStackParamList = {
  HomeScreen: undefined;
  AudioScreen: { recording: RecordingObject };
  RecordScreen: undefined;

};
/* eslint-disable
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
*/
