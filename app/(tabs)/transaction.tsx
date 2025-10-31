// app/(tabs)/transactions.tsx
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function TransactionsScreen() {
  const transactions = [
    { id: "1", date: "2025-10-25", amount: "$500", status: "Paid" },
    { id: "2", date: "2025-09-20", amount: "$300", status: "Pending" },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.date}</Text>
            <Text style={styles.text}>{item.amount}</Text>
            <Text style={styles.text}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  text: {
    fontSize: 16,
    color: "#555",
  },
});
