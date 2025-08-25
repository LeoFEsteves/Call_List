import NetInfo from "@react-native-community/netinfo";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

type UserType = {
  nome: String;
  senha: String;
};
type AuthContextType = {
  isLogged: boolean;
  isLoading: boolean;
  user: UserType | null;
  token: string | null;
  connection: boolean | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  error: string | null;
};

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  isLoading: true,
  user: null,
  token: null,
  connection: false,
  login: async () => {},
  logout: async () => {},
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setLogged] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<boolean | null>(null);

  // const connectionSubscription = NetInfo.fetch().then((state) => {
  //   console.log("Connection type", state.type);
  //   console.log("Is connected?", state.isConnected);
  // });

  useEffect(() => {
    const checkToken = async () => {
      try {
        NetInfo.fetch().then((state) => {
          setConnection(state.isConnected);
        });
        const token = await SecureStore.getItemAsync("token");
        if (token && connection) {
          fetch("http://192.168.15.6:5000/auth/verify")
            .then((response) => response.json())
            .then((data) => console.log(data));
          setLogged(true);
          //setUser({ nome: "nome", senha: "senha" });
        } else if (token && !connection) {
          setError("Não foi possível se conectar a rede!");
        }
      } catch (error) {
        console.log(error);
        //tratar erro de algum jeito aqui
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const login = async (nome: string, senha: string) => {
    if (!nome || !senha) {
      setError("Insira nome e senha!");
      return;
    }

    if (connection) {
      try {
        setLoading(true);
        const body = JSON.stringify({ nome, senha });

        fetch("http://192.168.15.6:5000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data && data.token) {
              setToken(data.token);
              setUser({ nome: nome, senha: senha });
              setLogged(true);
              SecureStore.setItemAsync("token", data.token);
            } else {
              throw new Error("Erro ao fazer login!");
            }
          })
          .catch((error) => {
            console.error("Erro ao fazer Login!", error);
            setError(error.message || "Erro ao fazer Login!");
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error: any) {
        console.error("Erro ao fazer Login!", error);
        setError(error.message || "Erro ao fazer Login!");
      }
    } else {
      setError("Não foi possível conectar a rede!");
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setToken(null);
      setUser(null);
      setLogged(false);
    } catch (error: any) {
      setError("Erro ao sair!");
      console.error("Erro ao sair!", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLogged,
        user,
        token,
        connection,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
