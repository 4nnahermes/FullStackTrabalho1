import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import ClienteApiService from "../../service/ClienteApiService";
import Mensagem from "../Mensagem";

export default function FormCliente() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [mensagemErro, setMensagemErro] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");

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
        setMensagemSucesso("");

        const cliente = {
            nome,
            cpf: cpf.replace(/\D/g, ""),
            email,
            telefone: telefone.replace(/\D/g, "")
        };

        if (id) {
            ClienteApiService.atualizar(Number(id), cliente)
                .then(() => {
                    setMensagemSucesso("Cliente atualizado com sucesso!");

                    setTimeout(() => {
                        navigate("/clientes");
                    }, 1500);
                })
                .catch(err =>
                    setMensagemErro(
                        err.response?.data?.error || "Erro ao atualizar cliente."
                    )
                );
        } else {
            ClienteApiService.inserir(cliente)
                .then(() => {
                    setMensagemSucesso("Cliente cadastrado com sucesso!");

                    setTimeout(() => {
                        navigate("/clientes");
                    }, 1500);
                })
                .catch(err =>
                    setMensagemErro(
                        err.response?.data?.error || "Erro ao cadastrar cliente."
                    )
                );
        }
    }

    const voltar = () => {
        navigate(-1);
    };

    function formatarCpf(valor: string) {
        valor = valor.replace(/\D/g, "");
        valor = valor.substring(0, 11);

        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        return valor;
    }

    function formatarTelefone(valor: string) {
        valor = valor.replace(/\D/g, "");
        valor = valor.substring(0, 11);

        if (valor.length <= 2) {
            return valor;
        }

        if (valor.length <= 7) {
            return valor.replace(/(\d{2})(\d+)/, "($1) $2");
        }

        return valor.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    return (
        <div className="pagina">
            <div className="cabecalho-pagina">
                <div>
                    <h1>{id ? "Edição de Cliente" : "Cadastro de Cliente"}</h1>
                    <p>Preencha os dados do cliente abaixo.</p>
                </div>
            </div>

            <div className="card-conteudo card-formulario">

                <Mensagem tipo="erro" texto={mensagemErro} />
                <Mensagem tipo="sucesso" texto={mensagemSucesso} />

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
                            maxLength={14}
                            value={cpf}
                            onChange={(e) => setCpf(formatarCpf(e.target.value))}
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
                            maxLength={15}
                            value={telefone}
                            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
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