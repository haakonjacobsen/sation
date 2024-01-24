import {BACKEND_URL} from '@env';

export interface Segment {
  id: number;
  seek?: number;
  start: number;
  end: number;
  text: string;
  tokens?: number[];
  temperature?: number;
  avg_log_prob: number;
  compression_ratio?: number;
  no_speech_prob: number;
}
export interface AlignedResult {
  start: number;
  end: number;
  text: string;
}
export interface TranscriptionResponse {
  language: string;
  segments: Segment[];
  aligned_results: AlignedResult[];
}

export async function transcribeSoundFile(uri: string): Promise<TranscriptionResponse | undefined> {
  const filename = uri.split('/').pop();
  const url = `${BACKEND_URL}/transcribe/${filename}`;
  // Replace the URL with your Flask server's IP address and port number
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Could not transcribe file.');
  }
  const data = await response.json();
  return data as TranscriptionResponse;
}
