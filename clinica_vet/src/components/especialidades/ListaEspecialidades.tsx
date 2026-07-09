import { useEffect, useState } from "react";
import { Link } from "react-router";
import EspecialidadeApiService from "../../service/EspecialidadeApiService";
import Mensagem from "../Mensagem";
import Confirmacao from "../Confirmacao";

export default function ListaEspecialidades() {
    const [listaEspecialidades, setListaEspecialidades] = useState([]);
    const [mensagemErro, setMensagemErro] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<any>(null);
    const [mensagemConfirmacao, setMensagemConfirmacao] = useState("");

    useEffect(() => {
        carregarEspecialidades();
    }, []);

    function carregarEspecialidades() {
        EspecialidadeApiService.listar().then(
            especialidades => setListaEspecialidades(especialidades)
        );
    }

    function excluirEspecialidade(especialidade: any) {
        setEspecialidadeSelecionada(especialidade);
        setMensagemConfirmacao("Deseja excluir esta especialidade?");
        setMostrarConfirmacao(true);
    }

    function confirmarExclusao() {
        if (!especialidadeSelecionada) {
            return;
        }

        setMensagemErro("");
        setMensagemSucesso("");

        EspecialidadeApiService.deletar(especialidadeSelecionada.id)
            .then(() => {
                setMensagemSucesso("Especialidade excluída com sucesso!");
                carregarEspecialidades();
            })
            .catch(err =>
                setMensagemErro(
                    err.response?.data?.error || "Erro ao excluir especialidade."
                )
            );

        setMostrarConfirmacao(false);
    }

    return (
        <div className="pagina">

            <div className="cabecalho-pagina">
                <div>
                    <h1>Especialidades</h1>
                    <p>Gerencie as especialidades dos veterinários.</p>
                </div>

                <Link
                    to="/especialidades/novo"
                    className="w3-button botao-principal"
                >
                    + Nova Especialidade
                </Link>
            </div>

            <div className="card-conteudo">

                <Mensagem
                    tipo="erro"
                    texto={mensagemErro}
                />

                <Mensagem
                    tipo="sucesso"
                    texto={mensagemSucesso}
                />

                {listaEspecialidades.length === 0 && (
                    <p>Nenhuma especialidade cadastrada.</p>
                )}

                {listaEspecialidades.length > 0 && (

                    <table className="w3-table w3-hoverable tabela-sistema">

                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Veterinários</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>

                            {listaEspecialidades.map((especialidade: any) => (

                                <tr key={especialidade.id}>

                                    <td>{especialidade.nome}</td>

                                    <td>
                                        {
                                            especialidade.veterinarios &&
                                            especialidade.veterinarios.length > 0
                                                ? especialidade.veterinarios
                                                    .map((v: any) => v.nome)
                                                    .join(", ")
                                                : "Nenhum"
                                        }
                                    </td>

                                    <td>

                                        <div className="acoes-tabela">

                                            <Link
                                                to={"/especialidades/editar/" + especialidade.id}
                                                className="w3-button w3-text-blue"
                                            >
                                                <i className="fa fa-pencil"></i>
                                            </Link>

                                            <button
                                                className="w3-button w3-text-red"
                                                onClick={() => excluirEspecialidade(especialidade)}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

            <Confirmacao
                aberto={mostrarConfirmacao}
                titulo="Excluir Especialidade"
                mensagem={mensagemConfirmacao}
                onCancelar={() => setMostrarConfirmacao(false)}
                onConfirmar={confirmarExclusao}
            />

        </div>
    );
}