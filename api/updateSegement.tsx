// api/updateSegment.ts
import {BACKEND_URL} from "@env";

export interface UpdateSegmentInput {
  filePath: string;
  index: number;
  newText: string;
}

export interface UpdateSegmentOutput {
  success: string;
}

export async function updateSegment({filePath, index, newText}: UpdateSegmentInput): Promise<UpdateSegmentOutput> {
  const filePathParts = filePath.split('/');
  const file = filePathParts[filePathParts.length - 1];

  const url = `${BACKEND_URL}/update_segment`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file, index, newText }),
  });

  if (!response.ok) {
    const data = await response.json();
    console.log(data);
    throw new Error(`Failed to update segment: ${response.statusText}`);
  }

  const data = await response.json();
  return data as UpdateSegmentOutput;
}
