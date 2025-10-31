// app/(tabs)/home.tsx
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const student = {
    name: "John Doe",
    id: "STU12345",
    course: "Computer Science",
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text>Name: {student.name}</Text>
        <Text>ID: {student.id}</Text>
        <Text>Course: {student.course}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 10 },
});
