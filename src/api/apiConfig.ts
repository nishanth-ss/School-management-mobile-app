import * as SecureStore from "expo-secure-store";

let BASE_URL = "https://localhost:5000"; // default fallback

export const getBaseUrl = () => BASE_URL;

export const loadBaseUrl = async () => {
  try {
    const saved = await SecureStore.getItemAsync("baseUrl");
    console.log("✅ Loading BaseURL:", saved);
    if (saved) {
      BASE_URL = saved;
      console.log("✅ Loaded BaseURL:", BASE_URL);
    } else {
      console.log("➡️ No base URL saved, using default:", BASE_URL);
    }
  } catch (err) {
    console.log("❌ Error loading saved base URL:", err);
  }
  return BASE_URL;
};

export const setBaseUrl = async (url: string) => {
  try {
    BASE_URL = url;
    await SecureStore.setItemAsync("baseUrl", url);
    console.log("✅ Saved BaseURL:", url);
  } catch (err) {
    console.log("❌ Error saving base URL:", err);
  }
};
