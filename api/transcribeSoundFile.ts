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

export async function transcribeSoundFile(uri: string): Promise<TranscriptionResponse | undefined> {
  const filename = uri.split('/').pop();
  const url = `http://192.168.0.4:5001/transcribe/${filename}`;
  // Replace the URL with your Flask server's IP address and port number
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Could not transcribe file.');
  }
  const data = await response.json();
  return data as TranscriptionResponse;
}
