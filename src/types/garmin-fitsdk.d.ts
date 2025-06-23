declare module "@garmin/fitsdk" {
  const value: { Decoder: any; Stream: any; Profile: any; Utils: any }; // or refine this if you know the API
  export = value;
}
