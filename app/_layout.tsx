// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Hide the parent header for (tabs) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* If you have OTP or login pages, include them too */}
      <Stack.Screen name="otp" options={{ headerShown: false }} />
    </Stack>
  );
}
