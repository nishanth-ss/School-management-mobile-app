import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [register_no, setRegisterNo] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // TODO: Replace with your authentication logic
    if (register_no === "STUD001" && password === "1234") {
      router.replace("/otp");
    } else {
      alert("Invalid credentials");
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

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
