import { api } from "./Api";

const URI = "/api/usuarios";

async function inserir(usuario: any) {
    const response = await api.post(URI, usuario);
    return response.data;
}

export default {
    inserir
}