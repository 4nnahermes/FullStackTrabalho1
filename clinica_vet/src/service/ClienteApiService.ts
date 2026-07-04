import axios from "axios";

const URI = "http://localhost:3000/api/clientes";

async function listar() {
    const response = await axios.get(URI);
    return response.data;
}

async function inserir(cliente: any) {
    const response = await axios.post(URI, cliente);
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

async function atualizar(id?: number, cliente?: any) {
    if (id && cliente) {
        const response = await axios.patch(URI + "/" + id, cliente);
        return response.data;
    } else {
        throw "Erro: id ou cliente não encontrados";
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