import { Decoder, Stream } from "@garmin/fitsdk";

// https://developer.garmin.com/fit/example-projects/javascript/
export const fitToJSON = (bytes: Uint8Array): any => {
  const uint8Array = new Uint8Array(bytes);
  const stream = Stream.fromByteArray(uint8Array);
  const decoder = new Decoder(stream);
  const { messages } = decoder.read();
  return messages;
};
