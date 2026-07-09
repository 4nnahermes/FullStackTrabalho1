import { api } from "./Api";

const URI = "api/especialidades";

async function listar() {
    const response = await api.get(URI);
    return response.data;
}

async function inserir(especialidade: any) {
    const response = await api.post(URI, especialidade);
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

async function atualizar(id?: number, especialidade?: any) {
    if (id && especialidade) {
        const response = await api.patch(URI + "/" + id, especialidade);
        return response.data;
    } else {
        throw "Erro: id ou especialidade não encontrados";
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