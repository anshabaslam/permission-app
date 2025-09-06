declare module '@maniac-tech/react-native-expo-read-sms' {
  export function checkIfHasSMSPermission(): Promise<boolean | object>;
  export function requestReadSMSPermission(): Promise<any>;
  export function startReadSMS(
    successCallback: (message: any) => void,
    errorCallback: (error: any) => void
  ): void;
}