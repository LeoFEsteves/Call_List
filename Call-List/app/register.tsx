import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";

export default function Register() {
  const { login } = useAuth();
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!nome.trim() || !senha.trim()) {
      Alert.alert("Erro", "Preencha nome e senha!");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("http://192.168.15.4:5000/auth/create/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erro", data.message || "Erro ao cadastrar usuário");
        return;
      }

      // Faz login automaticamente após cadastro
      await login(nome, senha);

      Alert.alert("Sucesso", `Usuário ${data.nome} cadastrado e logado!`, [
        { text: "OK", onPress: () => router.push("/attendance") },
      ]);
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error);
      Alert.alert(
        "Erro",
        "Não foi possível conectar ao servidor. Verifique a rede e o IP."
      );
    } finally {
      setIsLoading(false);
    }
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
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Cadastrar Usuário</Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#aaa",
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#aaa",
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />

      <Button
        title={isLoading ? "Cadastrando..." : "Cadastrar"}
        onPress={handleRegister}
        disabled={isLoading}
      />

      <Text style={{ marginTop: 16 }}>
        Já tem uma conta?{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() => router.push("/login")}
        >
          Login
        </Text>
      </Text>
    </View>
  );
}
