import { useEffect, useState } from "react";
import { Link } from "react-router";
import ConsultaApiService from "../../service/ConsultaApiService";
import Mensagem from "../Mensagem";
import Confirmacao from "../Confirmacao";

export default function ListaConsultas() {
    const [listaConsultas, setListaConsultas] = useState([]);
    const [mensagemErro, setMensagemErro] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [consultaSelecionada, setConsultaSelecionada] = useState<any>(null);
    const [mensagemConfirmacao, setMensagemConfirmacao] = useState("");

    useEffect(() => {
        carregarConsultas();
    }, []);

    function carregarConsultas() {
        ConsultaApiService.listar().then(
            consultas => setListaConsultas(consultas)
        );
    }

    function excluirConsulta(consulta: any) {
        setConsultaSelecionada(consulta);
        setMensagemConfirmacao("Deseja excluir esta consulta?");
        setMostrarConfirmacao(true);
    }

    function confirmarExclusao() {
        if (!consultaSelecionada) {
            return;
        }

        setMensagemErro("");
        setMensagemSucesso("");

        ConsultaApiService.deletar(consultaSelecionada.id)
            .then(() => {
                setMensagemSucesso("Consulta excluída com sucesso!");
                carregarConsultas();
            })
            .catch(err =>
                setMensagemErro(
                    err.response?.data?.error || "Erro ao excluir consulta."
                )
            );

        setMostrarConfirmacao(false);
    }

    function formatarStatus(status: string) {
        if (status === "AGENDADA") return "Agendada";
        if (status === "CONCLUIDA") return "Concluída";
        if (status === "CANCELADA") return "Cancelada";
        return status;
    }

    return (
        <div className="pagina">
            <div className="cabecalho-pagina">
                <div>
                    <h1>Consultas</h1>
                    <p>Gerencie as consultas agendadas da clínica.</p>
                </div>

                <Link to="/consultas/novo" className="w3-button botao-principal">
                    + Nova Consulta
                </Link>
            </div>

            <div className="card-conteudo">
                <Mensagem tipo="erro" texto={mensagemErro} />
                <Mensagem tipo="sucesso" texto={mensagemSucesso} />

                {listaConsultas.length === 0 && (
                    <p>Nenhuma consulta cadastrada.</p>
                )}

                {listaConsultas.length > 0 && (
                    <div className="tabela-responsiva">
                    <table className="w3-table w3-hoverable tabela-sistema">
                        <thead>
                            <tr>
                                <th>Pet</th>
                                <th>Veterinário</th>
                                <th>Data</th>
                                <th>Hora</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {listaConsultas.map((consulta: any) => (
                                <tr key={consulta.id}>
                                    <td>
                                        {consulta.pet?.nome}
                                        {consulta.pet?.cliente?.nome
                                            ? " (" + consulta.pet.cliente.nome + ")"
                                            : ""}
                                    </td>

                                    <td>{consulta.veterinario?.nome}</td>
                                    <td>{consulta.data}</td>
                                    <td>{consulta.hora}</td>
                                    <td>{formatarStatus(consulta.status)}</td>

                                    <td>
                                        <div className="acoes-tabela">
                                            <Link
                                                to={"/consultas/editar/" + consulta.id}
                                                className="w3-button w3-text-blue"
                                            >
                                                <i className="fa fa-pencil"></i>
                                            </Link>

                                            <button
                                                className="w3-button w3-text-red"
                                                onClick={() => excluirConsulta(consulta)}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>

            <Confirmacao
                aberto={mostrarConfirmacao}
                titulo="Excluir Consulta"
                mensagem={mensagemConfirmacao}
                onCancelar={() => setMostrarConfirmacao(false)}
                onConfirmar={confirmarExclusao}
            />
        </div>
    );
}