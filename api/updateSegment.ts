import {Alert} from "react-native";

export async function updateSegment(uri: string, id: number, text: string) {
  const filename = uri.split('/').pop();
  try {
    const apiUrl = "http://192.168.0.4:5001";
    return fetch(`${apiUrl}/update_segment`, {
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
