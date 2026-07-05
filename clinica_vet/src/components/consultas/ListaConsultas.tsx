import { useEffect, useState } from "react";
import { Link } from "react-router";
import ConsultaApiService from "../../service/ConsultaApiService";

export default function ListaConsultas() {
    const [listaConsultas, setListaConsultas] = useState([]);

    useEffect(() => {
        carregarConsultas();
    }, []);

    function carregarConsultas() {
        ConsultaApiService.listar().then(
            consultas => setListaConsultas(consultas)
        );
    }

    function excluirConsulta(id: number) {
        if (confirm("Tem certeza que deseja excluir esta consulta?")) {
            ConsultaApiService.deletar(id).then(() => {
                alert("Consulta excluída com sucesso!");
                carregarConsultas();
            });
        }
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
                {listaConsultas.length === 0 && (
                    <p>Nenhuma consulta cadastrada.</p>
                )}

                {listaConsultas.length > 0 && (
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
                                                onClick={() => excluirConsulta(consulta.id)}
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
        </div>
    );
}