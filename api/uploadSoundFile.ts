import * as FileSystem from "expo-file-system";
import {Alert} from "react-native";

export interface Segment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speach_prob: number;
}
export interface TranscriptionResponse {
  language: string;
  segments: Segment[];
}
export async function uploadSoundFile(uri: string): Promise<TranscriptionResponse | undefined> {
  // Replace the URL with your Flask server's IP address and port number
  const serverUrl = 'http://192.168.0.4:5001/upload';

  // Get the file extension
  const fileExtension = uri.split('.').pop();

  try {
    const options: FileSystem.FileSystemUploadOptions = {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      mimeType: `audio/${fileExtension}`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await FileSystem.uploadAsync(serverUrl, uri, options);

    if (response.status === 200) {
      return JSON.parse(response.body) as TranscriptionResponse;
    } else {
      Alert.alert('' + response.status, JSON.parse(response.body));
      return;
    }
  } catch (error) {
    console.error('Error uploading sound file:', error);
    return;
  }
}
