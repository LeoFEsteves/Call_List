import { Button, Text, View, ScrollView } from "react-native";
import { useAuth } from "@/context/authContext";

export default function Account() {
  const { logout, user, token } = useAuth();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "#f0f4f8",
      }}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: "white",
          padding: 20,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          alignItems: "center",
          gap: 16,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>
          Minha Conta
        </Text>

        <View
          style={{
            width: "100%",
            backgroundColor: "#f9f9f9",
            padding: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 16, color: "#555" }}>Nome:</Text>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#111" }}>
            {user?.nome}
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            backgroundColor: "#f9f9f9",
            padding: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 16, color: "#555" }}>Token:</Text>
          <Text
            style={{
              fontSize: 14,
              color: "#111",
              marginTop: 4,
            }}
          >
            {token}
          </Text>
        </View>

        <Button title="Logout" color="#e63946" onPress={logout} />
      </View>
    </ScrollView>
  );
}
