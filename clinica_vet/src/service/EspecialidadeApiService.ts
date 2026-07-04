import axios from "axios";

const URI = "http://localhost:3000/api/especialidades";

async function listar() {
    const response = await axios.get(URI);
    return response.data;
}

async function inserir(especialidade: any) {
    const response = await axios.post(URI, especialidade);
    return response.data;
}

async function buscarPorId(id?: number) {
    if (id) {
        const response = await axios.get(URI + "/" + id);
        return response.data;
    } else {
        throw "id não encontrado!";
    }
}

async function atualizar(id?: number, especialidade?: any) {
    if (id && especialidade) {
        const response = await axios.patch(URI + "/" + id, especialidade);
        return response.data;
    } else {
        throw "Erro: id ou especialidade não encontrados";
    }
}

async function deletar(id?: number) {
    if (id) {
        const response = await axios.delete(URI + "/" + id);
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