import { Button, Text, View } from "react-native";
import { useAuth } from "@/context/authContext";
export default function Account() {
    const { logout, user, token } = useAuth()

  return (
    <View>
        <Text>Teste</Text>
        <Text style={{ fontWeight: "normal" }}>{user?.nome}, {user?.senha}</Text>
        <Button title="Logout" onPress={logout} />
        <Text style={{ fontWeight: "normal" }}>
        {token}
      </Text>
        <Text>

        </Text>
    </View>
    
  )
}
