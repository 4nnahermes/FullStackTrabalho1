import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import PetApiService from "../../service/PetApiService";
import ClienteApiService from "../../service/ClienteApiService";

export default function FormPet() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [nome, setNome] = useState("");
    const [especie, setEspecie] = useState("");
    const [raca, setRaca] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [clienteId, setClienteId] = useState("");

    const [listaClientes, setListaClientes] = useState([]);
    const [mensagemErro, setMensagemErro] = useState("");

    useEffect(() => {
        ClienteApiService.listar().then(clientes => setListaClientes(clientes));

        if (id) {
            PetApiService.buscarPorId(Number(id)).then(pet => {
                setNome(pet.nome);
                setEspecie(pet.especie);
                setRaca(pet.raca);
                setDataNascimento(pet.dataNascimento);
                setClienteId(pet.cliente?.id?.toString());
            });
        }
    }, []);

    function salvarPet(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        setMensagemErro("");

        const pet = {
            nome,
            especie,
            raca,
            dataNascimento,
            cliente: {
                id: Number(clienteId)
            }
        };

        if (id) {
            PetApiService.atualizar(Number(id), pet)
                .then(() => {
                    alert("Pet atualizado com sucesso!");
                    navigate("/pets");
                })
                .catch(err =>
                    setMensagemErro(err.response?.data?.error || "Erro ao atualizar pet.")
                );
        } else {
            PetApiService.inserir(pet)
                .then(() => {
                    alert("Pet cadastrado com sucesso!");
                    navigate("/pets");
                })
                .catch(err =>
                    setMensagemErro(err.response?.data?.error || "Erro ao cadastrar pet.")
                );
        }
    }

    const voltar = () => {
        navigate(-1);
    };

    function formatarData(valor: string) {
        let apenasNumeros = valor.replace(/\D/g, "");

        if (apenasNumeros.length > 8) {
            apenasNumeros = apenasNumeros.substring(0, 8);
        }

        if (apenasNumeros.length > 4) {
            return apenasNumeros.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
        }

        if (apenasNumeros.length > 2) {
            return apenasNumeros.replace(/(\d{2})(\d{1,2})/, "$1/$2");
        }

        return apenasNumeros;
    }

    return (
        <div className="pagina">
            <div className="cabecalho-pagina">
                <div>
                    <h1>{id ? "Edição de Pet" : "Cadastro de Pet"}</h1>
                    <p>Preencha os dados do pet abaixo.</p>
                </div>
            </div>

            <div className="card-conteudo card-formulario">
                {mensagemErro && (
                    <div className="w3-panel w3-pale-red w3-border">
                        {mensagemErro}
                    </div>
                )}

                <form onSubmit={salvarPet}>
                    <div className="w3-section">
                        <label>Nome:</label>
                        <input
                            className="w3-input campo-formulario"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="w3-section">
                        <label>Espécie:</label>
                        <input
                            className="w3-input campo-formulario"
                            type="text"
                            value={especie}
                            onChange={(e) => setEspecie(e.target.value)}
                            required
                        />
                    </div>

                    <div className="w3-section">
                        <label>Raça:</label>
                        <input
                            className="w3-input campo-formulario"
                            type="text"
                            value={raca}
                            onChange={(e) => setRaca(e.target.value)}
                            required
                        />
                    </div>

                    <div className="w3-section">
                        <label>Data de nascimento:</label>
                        <input
                            className="w3-input campo-formulario"
                            type="text"
                            value={dataNascimento}
                            onChange={(e) => setDataNascimento(formatarData(e.target.value))}
                            placeholder="DD/MM/AAAA"
                            required
                        />
                    </div>

                    <div className="w3-section">
                        <label>Cliente:</label>
                        <select
                            className="w3-select campo-formulario"
                            value={clienteId}
                            onChange={(e) => setClienteId(e.target.value)}
                            required
                        >
                            <option value="">Selecione um cliente</option>

                            {listaClientes.map((cliente: any) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="botoes-formulario">
                        <input
                            className="w3-button botao-principal"
                            type="submit"
                            value={id ? "Atualizar" : "Salvar"}
                        />

                        <input
                            className="w3-button botao-secundario"
                            type="button"
                            value="Voltar"
                            onClick={voltar}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}