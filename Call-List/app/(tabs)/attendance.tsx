import { useAuth } from "@/context/authContext";
import { Button, Text, View } from "react-native";
export default function Attendance() {
  const { logout, user } = useAuth()

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

    </View>
  )
}
