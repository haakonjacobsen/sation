import {BACKEND_URL} from "@env";

export interface UpdateWordInput {
  filePath: string;
  index: number;
  newText: string;
}

export interface UpdateWordOutput {
  success: string;
}

export async function updateWord({filePath, index, newText}:UpdateWordInput):Promise<UpdateWordOutput> {
  // Get the file name from the file path
  const filePathParts = filePath.split('/');
  const file = filePathParts[filePathParts.length - 1];

  const url = `${BACKEND_URL}/update_word`;
  // Send a request to the backend to update the word at the given index with the new text
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file, index, newText }),
  });
  // If the response status is not OK, throw an error
  if (!response.ok) {
    const data = await response.json();
    console.log(data);
    throw new Error(`Failed to update word: ${response.statusText}`);
  }
  // Parse the response data
  const data = await response.json();

  // Return the parsed data as UpdateWordOutput
  return data as UpdateWordOutput;
}
