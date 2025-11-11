import { loadBaseUrl, setBaseUrl } from "@/src/api/apiConfig";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { loginUser, searchLocation } from "../src/services/authService";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};


export default function LoginScreen() {
  const [register_no, setRegisterNo] = useState("");
  const [search, setSearch] = useState("");
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Load the saved base URL when component mounts
        const savedUrl = await loadBaseUrl();
        console.log('Loaded base URL:', savedUrl);
        
        // If we have a saved URL, update the selected school state
        if (savedUrl && savedUrl !== 'https://localhost:5000') {
          // setSelectedSchool({ baseUrl: savedUrl });
        }
      } catch (error) {
        console.error('Failed to load base URL:', error);
      }
    };

    initialize();
  }, []);

  const debouncedSearch = useCallback(
  debounce(async (text) => {
    try {
      console.log('Search text:', text);
      const res = await searchLocation(text);
      if (res?.data?.length) {
        setSchools(res.data);
      } else {
        setSchools([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSchools([]);
    }
  }, 500),
  []
);



  const handleSearch = (text) => {
    setSearch(text);

    if (text.length) {
      debouncedSearch(text);
    } else {
      setSchools([]);
    }
  };

  const handleSelectSchool = async (school) => {
    console.log('Selected school:', school);
    const baseUrl = school.baseUrl.trim();
    console.log('Setting base URL to:', baseUrl);
    
    try {
      // Save the base URL first
      await setBaseUrl(baseUrl);
      await SecureStore.setItemAsync("baseUrl", baseUrl);
      
      // Update the UI state
      setSelectedSchool(school);
      setSchools([]);
      setSearch(school.name);
      
      console.log('Base URL set successfully');
    } catch (error) {
      console.error('Failed to set base URL:', error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to set school URL. Please try again.",
        position: "bottom",
      });
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await loginUser(register_no);
      console.log("Login response:", res);
      if (res?.user) {
        await SecureStore.setItemAsync("register_no", register_no);
        await SecureStore.setItemAsync("studentId", res?.user?.id);
        if (res?.user?.subscription === false) {
          router.replace("/subscription");
        } else {
          router.replace("/otp");
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: res?.message || "No token received from server.",
          position: "bottom",
        });
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again later.",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log("Selected school:", selectedSchool);

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
            {schools.length > 0 ? (
              <FlatList
                data={schools}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => { handleSelectSchool(item), setRegisterNo(""),setSelectedSchool(null) }}>
                    <Text style={styles.listItem}>{item.name} - {item.location}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : search.length >= 2 && (
              <Text style={{ textAlign: "center", color: "gray", marginTop: 10 }}>
                No results found
              </Text>
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

            <TouchableOpacity style={styles.btnlogin} onPress={() => { setSelectedSchool(null), setSearch("") }}>
              <Text style={styles.buttonTextLogin}>Change School</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#40407a"
  },
  innerContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    // Using modern shadow syntax
    elevation: 3, // for Android
    shadowColor: "#000", // for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#000"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    backgroundColor: '#fff',
    // Adding shadow to input for better visibility
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
    backgroundColor: '#fff',
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#40407a",
    marginTop: 20,
    // Adding shadow to button
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  },
  btnlogin: {
    marginTop: 20,
    color: "#40407a",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#40407a",
    borderWidth: 1,
    width: "100%",
    padding: 10,
  },
  buttonTextLogin: {
    color: "#40407a",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  }
});
