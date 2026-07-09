import { api } from "./Api";

const URI = "api/veterinarios";

async function listar() {
    const response = await api.get(URI);
    return response.data;
}

async function inserir(veterinario: any) {
    const response = await api.post(URI, veterinario);
    return response.data;
}

async function buscarPorId(id?: number) {
    if (id) {
        const response = await api.get(URI + "/" + id);
        return response.data;
    } else {
        throw "id não encontrado!";
    }
}

async function atualizar(id?: number, veterinario?: any) {
    if (id && veterinario) {
        const response = await api.patch(URI + "/" + id, veterinario);
        return response.data;
    } else {
        throw "Erro: id ou veterinário não encontrados";
    }
}

async function deletar(id?: number) {
    if (id) {
        const response = await api.delete(URI + "/" + id);
        return response.data;
    } else {
        throw "id não encontrado!";
    }
}

export default {
    listar,
    inserir,
    buscarPorId,
    atualizar,
    deletar
}