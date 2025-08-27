import NetInfo from "@react-native-community/netinfo";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

type AttendanceType = {
  studentName: string;
  present: boolean;
  date_attendance: string;
};

type Student = {
  id: number;
  name: string;
};

type AttendanceContextType = {
  isLoading: boolean;
  error: string | null;

  students: Student[];
  fetchStudents: () => Promise<void>;
  addStudent: (name: string) => Promise<void>;

  markAttendance: (attendance: AttendanceType) => Promise<void>;
};

const AttendanceContext = createContext<AttendanceContextType>({
  isLoading: false,
  error: null,
  students: [],
  fetchStudents: async () => {},
  addStudent: async () => {},
  markAttendance: async () => {},
});

export const AttendanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<boolean | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnection(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const fetchStudents = async () => {
    if (!connection) {
      setError("Sem conexão de rede!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        setError("Usuário não autenticado");
        return;
      }

      const response = await fetch("http://192.168.15.4:5000/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Erro ao buscar alunos");
        return;
      }

      setStudents(data);
    } catch (err: any) {
      console.error("Erro ao buscar alunos:", err);
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (name: string) => {
    console.log("Chamando addStudent com:", name); //Se quiser pode comentar, botei só pra testar porque estava dando bug
    if (!name.trim()) {
      Alert.alert("Erro", "Nome do aluno não pode ser vazio.");
      return;
    }

    if (!connection) {
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

      const response = await fetch("http://192.168.15.4:5000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Erro ao adicionar aluno");
        Alert.alert("Erro", data?.message || "Erro ao adicionar aluno");
      } else {
        Alert.alert("Sucesso", "Aluno adicionado com sucesso!");
        fetchStudents(); 
      }
    } catch (err: any) {
      console.error("Erro ao adicionar aluno:", err);
      setError("Erro de conexão");
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };


  const markAttendance = async ({ studentName, present, date_attendance }: AttendanceType) => {
    if (!studentName || date_attendance.trim() === "") {
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

      const response = await fetch("http://192.168.15.4:5000/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentName, present, date_attendance }),
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
    <AttendanceContext.Provider
      value={{
        isLoading,
        error,
        students,
        fetchStudents,
        addStudent,
        markAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
