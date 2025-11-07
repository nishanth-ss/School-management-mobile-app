// app/(tabs)/subscription.tsx  (or wherever you keep it)
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getBaseUrl } from "../src/api/apiConfig";
import { useRazorpay } from "../src/hooks/useRazorpay";

export default function SubscriptionScreen() {
  const router = useRouter();
  const { startPayment } = useRazorpay();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    console.log(getBaseUrl());
    
    setLoading(true);
    const studentId = await SecureStore.getItemAsync("studentId"); // you already have it somewhere
    const amount = 100; // ₹100 → 10000 paise

    const ok = await startPayment(studentId, amount);
    setLoading(false);

    if (ok) {
      // Payment verified → go to OTP / home
      router.replace("/otp");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.popup}>
        <Text style={styles.title}>Subscription Required</Text>
        <Text style={styles.subtitle}>
          To continue using this app, you need to activate a yearly subscription.
        </Text>

        <View style={styles.priceBox}>
          <Text style={styles.priceText}>₹100 / Year</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Subscribe Now</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.skipText}>Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#40407a",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  priceBox: {
    backgroundColor: "#e9e8ff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#40407a",
  },
  button: {
    backgroundColor: "#40407a",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  skipText: {
    color: "#888",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  buttonDisabled: { opacity: 0.6 },
});