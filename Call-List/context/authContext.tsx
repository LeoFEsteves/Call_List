import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

type UserType = {
  nome: String;
  senha: String;
};
type AuthContextType = {
  isLogged: boolean;
  isLoading: boolean;
  user: UserType | null;
  token: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  error: string | null;
};

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  isLoading: true,
  user: null,
  token: null,
  login: async () => { },
  logout: async () => { },
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setLogged] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          //Aqui fazer checagem com backend
          setToken(token);
          setLogged(true);
          //setUser({ nome: "nome", senha: "senha" });
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
    if (!nome || !senha) return;
    try {
      setLoading(true);
      setToken("token");
      await SecureStore.setItemAsync("token", "token");
      setUser({ nome: nome, senha: senha });
      setLogged(true);
    } catch (error: any) {
      console.error("Erro ao fazer Login!", error);
      setError(error.message || "Erro ao fazer Login!");
    } finally {
      setLoading(false);
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
      value={{ isLoading, isLogged, user, token, login, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
