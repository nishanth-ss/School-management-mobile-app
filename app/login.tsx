import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginUser } from "../src/services/authService";

export default function LoginScreen() {
  const [register_no, setRegisterNo] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await loginUser(register_no);
      if (res?.token) {
        await SecureStore.setItemAsync("authToken", res.token);
        await SecureStore.setItemAsync("register_no", register_no);
        router.replace("/otp");
      } else {
        console.warn("⚠️ No token received from server");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Hide header */}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome to School Management</Text>


        <TextInput
          style={styles.input}
          placeholder="Register No"
          value={register_no}
          onChangeText={setRegisterNo}
          autoCapitalize="none"
          keyboardType="default"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#40407a",
  },
  innerContainer: {
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
    color: "#000"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: "100%",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#40407a",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
