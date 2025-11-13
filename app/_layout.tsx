// Add this at the top of your file, after the imports
import { LogBox } from 'react-native';

// Add this right after your imports
LogBox.ignoreLogs(['Unsupported top level event type "topSvgLayout"']);

// The rest of your imports...
import { Stack, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Rest of your file remains the same...

// Error boundary fallback component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>Something went wrong</Text>
      <Text style={{ color: 'red', marginBottom: 10 }}>{error.message}</Text>
      <Text>Please restart the app or contact support if the problem persists.</Text>
    </View>
  );
}

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  // Check auth status when the component mounts and navigation is ready
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const registerNo = await SecureStore.getItemAsync("register_no");
        
        if (token && registerNo) {
          setTimeout(() => {
            router.replace("/(tabs)/profile");
          }, 0);
        } else {
          setTimeout(() => {
            router.replace("/login");
          }, 0);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setTimeout(() => {
          router.replace("/login");
        }, 0);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      checkAuth();
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#40407a" />
      </View>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="otp" />
          <Stack.Screen name="login" />
          <Stack.Screen name="subscription" />
        </Stack>
        <Toast />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}