import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import EspecialidadeApiService from "../../service/EspecialidadeApiService";
import Mensagem from "../Mensagem";

export default function FormEspecialidade() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [nome, setNome] = useState("");
    const [mensagemErro, setMensagemErro] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");

    useEffect(() => {
        if (id) {
            EspecialidadeApiService.buscarPorId(Number(id)).then(especialidade => {
                setNome(especialidade.nome);
            });
        }
    }, []);

    function salvarEspecialidade(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        setMensagemErro("");
        setMensagemSucesso("");

        const especialidade = {
            nome
        };

        if (id) {
            EspecialidadeApiService.atualizar(Number(id), especialidade)
                .then(() => {
                    setMensagemSucesso("Especialidade atualizada com sucesso!");

                    setTimeout(() => {
                        navigate("/especialidades");
                    }, 1500);
                })
                .catch(err =>
                    setMensagemErro(
                        err.response?.data?.error ||
                        "Erro ao atualizar especialidade."
                    )
                );
        } else {
            EspecialidadeApiService.inserir(especialidade)
                .then(() => {
                    setMensagemSucesso("Especialidade cadastrada com sucesso!");

                    setTimeout(() => {
                        navigate("/especialidades");
                    }, 1500);
                })
                .catch(err =>
                    setMensagemErro(
                        err.response?.data?.error ||
                        "Erro ao cadastrar especialidade."
                    )
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
                    <h1>
                        {id
                            ? "Edição de Especialidade"
                            : "Cadastro de Especialidade"}
                    </h1>

                    <p>Preencha os dados da especialidade.</p>
                </div>
            </div>

            <div className="card-conteudo card-formulario">

                <Mensagem tipo="erro" texto={mensagemErro} />
                <Mensagem tipo="sucesso" texto={mensagemSucesso} />

                <form onSubmit={salvarEspecialidade}>

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