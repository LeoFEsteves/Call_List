import { Button, Text, View } from "react-native";
import { useAuth } from "@/context/authContext";
export default function Account() {
    const { logout, user, token } = useAuth()

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
      }}>

        <Text style={{ fontWeight: "normal" }}> Nome: {user?.nome},  Senha: {user?.senha}</Text>
        <Button title="Logout" onPress={logout} />
        <Text style={{ fontWeight: "normal" }}>
        {token}
      </Text>
    </View>
    
  )
}
