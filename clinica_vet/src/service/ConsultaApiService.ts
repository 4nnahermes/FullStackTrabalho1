import { api } from "./Api";


const URI = "api/consultas";

async function listar() {
    const response = await api.get(URI);
    return response.data;
}

async function inserir(consulta: any) {
    const response = await api.post(URI, consulta);
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

async function atualizar(id?: number, consulta?: any) {
    if (id && consulta) {
        const response = await api.patch(URI + "/" + id, consulta);
        return response.data;
    } else {
        throw "Erro: id ou consulta não encontrados";
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