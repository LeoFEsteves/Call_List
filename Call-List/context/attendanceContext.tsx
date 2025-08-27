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
      console.log("Conexão de rede:", state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const getToken = async (): Promise<string | null> => {
    try {
      const token = await SecureStore.getItemAsync("token");
      console.log("Token recuperado do SecureStore:", token ? "SIM" : "NÃO");
      return token;
    } catch (error) {
      console.error("Erro ao buscar token:", error);
      return null;
    }
  };

  const fetchStudents = async () => {
    console.log("fetchStudents chamado");
    
    if (!connection) {
      console.log("Sem conexão de rede");
      setError("Sem conexão de rede!");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      console.log("Token para fetchStudents:", token ? "VÁLIDO" : "INVÁLIDO");
      
      if (!token) {
        setError("Usuário não autenticado");
        return;
      }

      console.log("Fazendo requisição para /students");
      const response = await fetch("http://192.168.15.4:5000/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Resposta recebida - Status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Erro na resposta:", errorData);
        setError(errorData?.message || "Erro ao buscar alunos");
        return;
      }

      const data = await response.json();
      console.log("Alunos recebidos:", data.length);
      setStudents(data);

    } catch (err: any) {
      console.error("Erro ao buscar alunos:", err);
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (name: string) => {
    console.log("addStudent chamado com nome:", name);
    
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
      
      const token = await getToken();
      console.log("Token para addStudent:", token ? "VÁLIDO" : "INVÁLIDO");
      
      if (!token) {
        setError("Usuário não autenticado");
        Alert.alert("Erro", "Você precisa estar logado.");
        return;
      }

      console.log("Fazendo POST para /students");
      const response = await fetch("http://192.168.15.4:5000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      console.log("Resposta do POST - Status:", response.status);
      
      const data = await response.json();
      console.log("Dados da resposta:", data);

      if (!response.ok) {
        setError(data?.message || "Erro ao adicionar aluno");
        Alert.alert("Erro", data?.message || "Erro ao adicionar aluno");
        return;
      }

      setStudents((prev) => [...prev, { id: data.id, name: data.name }]);
      Alert.alert("Sucesso", "Aluno adicionado com sucesso!");

    } catch (err: any) {
      console.error("Erro ao adicionar aluno:", err);
      setError("Erro de conexão");
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async ({ studentName, present, date_attendance }: AttendanceType) => {
    console.log("markAttendance chamado:", { studentName, present, date_attendance });
    
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
      
      const token = await getToken();
      console.log("Token para markAttendance:", token ? "VÁLIDO" : "INVÁLIDO");
      
      if (!token) {
        setError("Usuário não autenticado");
        Alert.alert("Erro", "Você precisa estar logado.");
        return;
      }

      console.log("Fazendo POST para /attendance");
      const response = await fetch("http://192.168.15.4:5000/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentName, present, date_attendance }),
      });

      console.log("Resposta do attendance - Status:", response.status);
      
      const data = await response.json();
      console.log("Dados da resposta attendance:", data);

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