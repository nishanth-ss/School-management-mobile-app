import { loadBaseUrl, setBaseUrl } from "@/src/api/apiConfig";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { loginUser, searchLocation } from "../src/services/authService";

export default function LoginScreen() {
  const [register_no, setRegisterNo] = useState("");
  const [search, setSearch] = useState("");
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadBaseUrl(); // Load any previously saved base URL
  }, []);

  const handleSearch = async (text) => {
    setSearch(text);
    if (text.length >= 2) {
      try {
        const res = await searchLocation(text);
        console.log("Search response:", res);
        if (res?.data?.length) {
          setSchools(res.data); // ✅ only store the array of schools
        } else {
          setSchools([]); // no results
        }
      } catch (err) {
        console.error("Search error:", err);
        setSchools([]);
      }
    } else {
      setSchools([]);
    }
  };


  const handleSelectSchool = async (school) => {
    console.log(school);
    setSelectedSchool(school);
    setSchools([]);
    setSearch(school.name);
    await setBaseUrl(school.baseUrl.trim());
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser(register_no);
      console.log("Login response:", res?.user);

      // ✅ Handle error responses first
      if (res.status === 400) {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "Invalid credentials. Please check your register number.",
          position: "bottom",
        });
        return;
      } else if (!res || res.success === false) {
        const message =
          res?.message ||
          (res?.status === 400
            ? "Invalid credentials. Please check your register number."
            : "Something went wrong. Please try again.");

        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: message,
          position: "bottom",
        });

        return; // ⛔ stop execution here
      }

      // ✅ Handle success case
      if (res?.token) {
        await SecureStore.setItemAsync("authToken", res.token);
        await SecureStore.setItemAsync("register_no", register_no);
        await SecureStore.setItemAsync(
          "subscription",
          res?.user?.subscription ? "true" : "false"
        );
        if(res?.user?.subscription){
          router.replace("/otp");
        }else{
          router.replace("/subscription");
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "No token received from server.",
          position: "bottom",
        });
      }
    } catch (error) {
      // This shouldn't normally happen if request() handles errors
      console.error("Unexpected login error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again later.",
        position: "bottom",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome to School Management</Text>

        {!selectedSchool ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Search school name"
              value={search}
              onChangeText={handleSearch}
            />
            {schools.length > 0 || search.length >= 2 ? (
              <FlatList
                data={schools}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectSchool(item)}>
                    <Text style={styles.listItem}>{item.name} - {item.location}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              // ✅ Show “No results” only when:
              // - user typed at least 2 characters
              // - and no results returned
              search.length >= 2 && (
                <Text style={{ textAlign: "center", color: "gray", marginTop: 10 }}>
                  No results found
                </Text>
              )
            )}
          </>
        ) : (
          <>
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
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#40407a" },
  innerContainer: { alignItems: "center", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  title: { fontSize: 28, fontWeight: "600", textAlign: "center", marginBottom: 20, color: "#000" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10, width: "100%" },
  listItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee", width: "100%" },
  button: { width: "100%", padding: 10, borderRadius: 8, backgroundColor: "#40407a", marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
});
