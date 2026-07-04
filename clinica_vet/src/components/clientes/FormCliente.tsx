import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import ClienteApiService from "../../service/ClienteApiService";

export default function FormCliente() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [mensagemErro, setMensagemErro] = useState("");

    useEffect(() => {
        if (id) {
            ClienteApiService.buscarPorId(Number(id)).then(cliente => {
                setNome(cliente.nome);
                setCpf(cliente.cpf);
                setEmail(cliente.email);
                setTelefone(cliente.telefone);
            });
        }
    }, []);

    function salvarCliente(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        setMensagemErro("");

        const cliente = { nome, cpf, email, telefone };

        if (id) {
            ClienteApiService.atualizar(Number(id), cliente)
                .then(() => {
                    alert("Cliente atualizado com sucesso!");
                    navigate("/clientes");
                })
                .catch(err =>
                    setMensagemErro(err.response?.data?.error || "Erro ao atualizar cliente.")
                );
        } else {
            ClienteApiService.inserir(cliente)
                .then(() => {
                    alert("Cliente cadastrado com sucesso!");
                    navigate("/clientes");
                })
                .catch(err =>
                    setMensagemErro(err.response?.data?.error || "Erro ao cadastrar cliente.")
                );
        }
    }

    const voltar = () => {
        navigate(-1);
    };

    return (
        <div className="pagina">
            <div className="cabecalho-pagina">
                <div>
                    <h1>{id ? "Edição de Cliente" : "Cadastro de Cliente"}</h1>
                    <p>Preencha os dados do cliente abaixo.</p>
                </div>
            </div>

            <div className="card-conteudo card-formulario">
                {mensagemErro && (
                    <div className="w3-panel w3-pale-red w3-border">
                        {mensagemErro}
                    </div>
                )}

                <form onSubmit={salvarCliente}>
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
                        <label>CPF:</label>
                        <input
                            className="w3-input campo-formulario"
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            required
                        />
                    </div>

                    <div className="w3-section">
                        <label>Email:</label>
                        <input
                            className="w3-input campo-formulario"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="w3-section">
                        <label>Telefone:</label>
                        <input
                            className="w3-input campo-formulario"
                            type="text"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            required
                        />
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