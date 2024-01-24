import {Alert} from "react-native";
import {BACKEND_URL} from '@env'

export async function updateSegment(uri: string, id: number, text: string) {
  const filename = uri.split('/').pop();
  try {
    return fetch(`${BACKEND_URL}/update_segment`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "filename": filename,
        "id": id,
        "text": text,
      }),
    });
  } catch (error) {
    Alert.alert("Error when updating segment");
  }
}
