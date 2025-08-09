import { useAuth } from "@/context/authContext";
import { Text, View } from "react-native";

export default function TokenTest() {
  const { token, user } = useAuth();

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 1,
        left: 1,
        right: 1,
        bottom: 1,
      }}
    >
      <Text style={{ fontWeight: "normal" }}>
        {token}
      </Text>
    </View>
  );
}
