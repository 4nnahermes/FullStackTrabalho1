import { api } from "./Api";

const URI = "api/pets";

async function listar() {
    const response = await api.get(URI);
    return response.data;
}

async function inserir(pet: any) {
    const response = await api.post(URI, pet);
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

async function atualizar(id?: number, pet?: any) {
    if (id && pet) {
        const response = await api.patch(URI + "/" + id, pet);
        return response.data;
    } else {
        throw "Erro: id ou pet não encontrados";
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