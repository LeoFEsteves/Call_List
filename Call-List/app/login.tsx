import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, TouchableNativeFeedback, View } from "react-native";


export default function Login() {
  const { login, isLoading, error } = useAuth()
  const [nome, setNome] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    await login(nome, password)
  }

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
      <View>
        {error && (
          <Text style={{ color: "red" }}>
            {error}
          </Text>
        )}
        <TextInput placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title={isLoading ? "Loading..." : "Login"}
          onPress={handleLogin}
          disabled={isLoading}
        />
      </View>
      <Text>Login Screen </Text>
      <TouchableNativeFeedback
        onPress={() => {
          useRouter().push("/(tabs)/attendance");
        }}
      >
        <View>
          <Text>ir para home sem autenticar </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}
