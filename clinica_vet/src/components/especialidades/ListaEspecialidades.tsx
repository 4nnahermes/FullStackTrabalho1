import { useEffect, useState } from "react";
import { Link } from "react-router";
import EspecialidadeApiService from "../../service/EspecialidadeApiService";

export default function ListaEspecialidades() {
    const [listaEspecialidades, setListaEspecialidades] = useState([]);

    useEffect(() => {
        carregarEspecialidades();
    }, []);

    function carregarEspecialidades() {
        EspecialidadeApiService.listar().then(
            especialidades => setListaEspecialidades(especialidades)
        );
    }

    function excluirEspecialidade(id: number) {
        if (confirm("Tem certeza que deseja excluir esta especialidade?")) {
            EspecialidadeApiService.deletar(id).then(() => {
                alert("Especialidade excluída com sucesso!");
                carregarEspecialidades();
            });
        }
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
                                                onClick={() => excluirEspecialidade(especialidade.id)}
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