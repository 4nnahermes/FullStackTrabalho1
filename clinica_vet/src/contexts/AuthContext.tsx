import { createContext, useState, type ReactNode } from "react";
import AuthService from "../service/AuthService";

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthContextData {
    autenticado: boolean;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const [autenticado, setAutenticado] = useState(() => {
        return localStorage.getItem("token") !== null;
    });

    const login = async (email: string, senha: string) => {
        const resposta = await AuthService.login(email, senha);

        localStorage.setItem("token", resposta.token);
        setAutenticado(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAutenticado(false);
    };

    return (
        <AuthContext.Provider value={{ autenticado, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}