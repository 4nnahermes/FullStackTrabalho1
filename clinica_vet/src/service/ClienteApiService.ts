import { api } from "./Api";

const URI = "api/clientes";

async function listar() {
    const response = await api.get(URI);
    return response.data;
}

async function inserir(cliente: any) {
    const response = await api.post(URI, cliente);
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

async function atualizar(id?: number, cliente?: any) {
    if (id && cliente) {
        const response = await api.patch(URI + "/" + id, cliente);
        return response.data;
    } else {
        throw "Erro: id ou cliente não encontrados";
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