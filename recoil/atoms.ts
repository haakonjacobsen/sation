import { atom } from 'recoil';

export const darkModeState = atom({
  key: 'darkModeState',
  default: true,
});

export const useHighQualityRecordingState = atom({
  key: 'useHighQualityRecordingState',
  default: true,
});
