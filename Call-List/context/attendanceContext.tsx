import NetInfo from "@react-native-community/netinfo";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

type AttendanceType = {
  id_student: number;
  present: boolean;
  date_attendance: string;
};

type AttendanceContextType = {
  isLoading: boolean;
  error: string | null;

  markAttendance: (attendance: AttendanceType) => Promise<void>;
};

const AttendanceContext = createContext<AttendanceContextType>({
  isLoading: false,
  error: null,
  markAttendance: async () => {},
});

export const AttendanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnection(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const markAttendance = async ({ id_student, present, date_attendance }: AttendanceType) => {
    if (!id_student || date_attendance.trim() === "") {
      setError("Dados incompletos");
      Alert.alert("Erro", "Informe aluno e data.");
      return;
    }

    if (!connection) {
      setError("Sem conexão de rede!");
      Alert.alert("Erro", "Sem conexão de rede!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        setError("Usuário não autenticado");
        Alert.alert("Erro", "Você precisa estar logado.");
        return;
      }

      const response = await fetch("http://192.168.15.6:5000/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_student, present, date_attendance }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Erro ao registrar presença");
        Alert.alert("Erro", data?.message || "Erro ao registrar presença");
      } else {
        Alert.alert("Sucesso", "Presença registrada com sucesso!");
      }
    } catch (err: any) {
      console.error("Erro ao marcar presença:", err);
      setError("Erro de conexão");
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider value={{ isLoading, error, markAttendance }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
