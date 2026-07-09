import { api } from "./Api";

async function login(email: string, senha: string) {
    const response = await api.post("/api/login", {
        email,
        senha
    });

    return response.data;
}

export default {
    login
};