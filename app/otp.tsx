import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function OtpScreen() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);
  const router = useRouter();

  const handleChange = (text: string, index: number) => {
    // Update OTP value
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto move to next input
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === "123456") {
      alert("✅ OTP verified successfully!");
      router.replace("/(tabs)/profile");
    } else {
      alert("❌ Invalid OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.innerContainer}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>We’ve sent a 6-digit code to your email or phone</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputs.current[index] = ref;
              }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleChange(text.replace(/[^0-9]/g, ""), index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
          <Text style={styles.buttonText}>Verify OTP</Text>
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
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: 45,
    height: 55,
    textAlign: "center",
    fontSize: 22,
    marginRight: 5
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
