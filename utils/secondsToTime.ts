export function secondsToTimeString(seconds: number) {
  // Convert seconds to whole minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Pad with zeros if needed
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  // Concatenate the padded minutes and seconds with a colon separator
  return `${paddedMinutes}:${paddedSeconds}`;
}
