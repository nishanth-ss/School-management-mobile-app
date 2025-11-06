import * as SecureStore from 'expo-secure-store';

let BASE_URL = "https://localhost:5000"; // default fallback

export const getBaseUrl = () => BASE_URL;

export const setBaseUrl = async (url: string) => {
  try {
    BASE_URL = url;
    await SecureStore.setItemAsync("baseUrl", url);
  } catch (error) {
    console.error('Error saving base URL:', error);
  }
};

export const loadBaseUrl = async () => {
  try {
    const savedUrl = await SecureStore.getItemAsync("baseUrl");
    if (savedUrl) {
      BASE_URL = savedUrl;
    }
  } catch (error) {
    console.error('Error loading base URL:', error);
  }
  return BASE_URL;
};
