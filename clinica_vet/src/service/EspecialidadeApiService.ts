import axios from "axios";

const URI = "http://localhost:3000/api/especialidades";

async function listar() {
    const response = await axios.get(URI);
    return response.data;
}

export default {
    listar
}