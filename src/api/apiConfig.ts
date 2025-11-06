import * as SecureStore from "expo-secure-store";

let BASE_URL = "https://localhost:5000"; // default fallback

export const getBaseUrl = () => BASE_URL;

export const setBaseUrl = async (url: string) => {
  BASE_URL = url;
  await SecureStore.setItemAsync("baseUrl", url);
};

export const loadBaseUrl = async () => {
  const savedUrl = await SecureStore.getItemAsync("baseUrl");
  if (savedUrl) BASE_URL = savedUrl;
};
