import { getStudentTransactions } from "@/src/services/studentProfile";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionsScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const fetchTransactions = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const regNo = await SecureStore.getItemAsync("register_no");
      if (!regNo) {
        setLoading(false);
        return;
      }
      const res = await getStudentTransactions(regNo, page, pagination.pageSize);
      console.log("Transactions data:", res);
      setData(res.transactions || []);
      setPagination((prev) => ({
        ...prev,
        page: page,
        totalPages: res.totalPages || Math.ceil((res.totalItems || 0) / pagination.pageSize) || 1,
      }));
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  // Fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTransactions(1);
    }, [fetchTransactions])
  );

  // 🔁 Re-fetch data whenever page changes
  useEffect(() => {
    fetchTransactions(pagination.page);
  }, [pagination.page]);

  const renderItem = ({ item }: any) => {
    const date =
      item.createdAtFormatted ||
      new Date(item.createdAt).toLocaleString();
    const amount = item.totalAmount || item.depositAmount || 0;
    const source = item.source || "N/A";
    const status = item.status || (item.is_reversed ? "Reversed" : "Completed");

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>{amount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Source:</Text>
          <Text style={styles.value}>{source}</Text>
        </View>
        <View style={styles.row}>
          <Text
            style={[
              styles.status,
              status === "Completed" ? styles.paid : styles.pending,
            ]}
          >
            {status}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
    <SafeAreaView style={[styles.container, { flex: 1 }]} edges={[]}>
        <ActivityIndicator size="large" color="#40407a" />
        <Text>Loading student transactions...</Text>
      </SafeAreaView>
    );
  }

  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: "red" }}>No transactions found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]} edges={[]}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      {/* ✅ Pagination Controls */}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.max(prev.page - 1, 1),
            }))
          }
          disabled={pagination.page === 1}
          style={[
            styles.pageButton,
            pagination.page === 1 && styles.disabledButton,
          ]}
        >
          <Text style={styles.pageText}>Prev</Text>
        </TouchableOpacity>

        <Text style={styles.pageIndicator}>
          Page {pagination.page} of {pagination.totalPages}
        </Text>

        <TouchableOpacity
          onPress={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.min(prev.page + 1, prev.totalPages),
            }))
          }
          disabled={pagination.page === pagination.totalPages}
          style={[
            styles.pageButton,
            pagination.page === pagination.totalPages && styles.disabledButton,
          ]}
        >
          <Text style={styles.pageText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#f8f9ff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#40407a",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    color: "#555",
    fontWeight: "500",
  },
  value: {
    color: "#111",
  },
  status: {
    alignSelf: "flex-end",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontWeight: "600",
  },
  paid: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  pending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 10,
  },
  pageButton: {
    backgroundColor: "#40407a",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pageText: {
    color: "#fff",
    fontWeight: "600",
  },
  pageIndicator: {
    color: "#40407a",
    fontWeight: "600",
  },
});
