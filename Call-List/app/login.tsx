import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const { login, isLoading, error } = useAuth();
  const [nome, setNome] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    await login(nome, password);
  };

  const handleNavigateRegister = () => {
    router.push("/register"); 
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <View style={{ width: "100%", marginBottom: 16 }}>
        {error && <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>}

        <TextInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          style={{
            borderWidth: 1,
            borderColor: "#aaa",
            padding: 8,
            borderRadius: 8,
            marginBottom: 8,
          }}
        />

        <TextInput
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            borderWidth: 1,
            borderColor: "#aaa",
            padding: 8,
            borderRadius: 8,
            marginBottom: 16,
          }}
        />

        <Button
          title={isLoading ? "Loading..." : "Login"}
          onPress={handleLogin}
          disabled={isLoading}
        />
      </View>

      <Text>Não tem uma conta?</Text>
      <TouchableOpacity onPress={handleNavigateRegister}>
        <Text style={{ color: "blue", marginTop: 4 }}>Cadastrar-se</Text>
      </TouchableOpacity>
    </View>
  );
}
