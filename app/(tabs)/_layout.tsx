// app/(tabs)/_layout.tsx
import { Tabs, useRouter } from "expo-router";
import { CreditCard, LogOut, User } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.4)",
        tabBarStyle: {
          backgroundColor: "#40407a",
          borderTopWidth: 0.5,
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          headerStyle: {
            backgroundColor: "#40407a",
          },
          headerTitleStyle: {
            color: "#fff",
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // 👉 Replace with your logout logic
                alert("Logging out...");
                router.replace("/login"); // or your login route
              }}
              style={{ marginRight: 15 }}
            >
              <LogOut color="#fff" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: "Transaction",
          tabBarIcon: ({ color, size }) => <CreditCard color={color} size={size} />,
          headerStyle: {
            backgroundColor: "#40407a",
          },
          headerTitleStyle: {
            color: "#fff",
          },
        }}
      />
    </Tabs>
  );
}