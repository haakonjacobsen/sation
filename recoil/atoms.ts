import { atom } from 'recoil';
import {RecordingObject} from "../types/recording";

export const darkModeState = atom({
  key: 'darkModeState',
  default: true,
});

export const useHighQualityRecordingState = atom({
  key: 'useHighQualityRecordingState',
  default: true,
});

export const recordingsState = atom<RecordingObject[]>({
  key: 'recordingsState',
  default: [],
});
