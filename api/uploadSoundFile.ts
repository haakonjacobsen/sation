import * as FileSystem from "expo-file-system";
import {BACKEND_URL} from "@env";

export interface APIResponse {
  success: string;
}
export async function uploadSoundFile(uri: string): Promise<APIResponse | undefined> {
  // Replace the URL with your Flask server's IP address and port number
  const serverUrl = `${BACKEND_URL}/upload`;

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
    if (response.status !== 200) {
      throw new Error('Could not transcribe file.');
    }
    return JSON.parse(response.body) as APIResponse;
  } catch (error) {
    console.error('Error uploading sound file:', error);
    return;
  }
}
