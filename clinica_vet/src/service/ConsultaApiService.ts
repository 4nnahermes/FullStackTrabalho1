import axios from "axios";

const URI = "http://localhost:3000/api/consultas";

async function listar() {
    const response = await axios.get(URI);
    return response.data;
}

async function inserir(consulta: any) {
    const response = await axios.post(URI, consulta);
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

async function atualizar(id?: number, consulta?: any) {
    if (id && consulta) {
        const response = await axios.patch(URI + "/" + id, consulta);
        return response.data;
    } else {
        throw "Erro: id ou consulta não encontrados";
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