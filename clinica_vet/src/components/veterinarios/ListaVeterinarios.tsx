import { useEffect, useState } from "react";
import { Link } from "react-router";
import VeterinarioApiService from "../../service/VeterinarioApiService";

export default function ListaVeterinarios() {
    const [listaVeterinarios, setListaVeterinarios] = useState([]);

    useEffect(() => {
        carregarVeterinarios();
    }, [])

    function carregarVeterinarios() {
        VeterinarioApiService.listar().then(
            veterinarios => setListaVeterinarios(veterinarios)
        )
    }

    function excluirVeterinario(id: number) {
        if (confirm("Tem certeza que deseja excluir este veterinário?")) {
            VeterinarioApiService.deletar(id).then(() => {
                alert("Veterinário excluído com sucesso!");
                carregarVeterinarios();
            });
        }
    }

    return (
        <div className="pagina">
            <div className="cabecalho-pagina">
                <div>
                    <h1>Veterinários</h1>
                    <p>Gerencie os veterinários cadastrados na clínica.</p>
                </div>

                <Link to="/veterinarios/novo" className="w3-button botao-principal">
                    + Novo Veterinário
                </Link>
            </div>

            <div className="card-conteudo">
                {listaVeterinarios.length === 0 && (
                    <p>Nenhum veterinário cadastrado.</p>
                )}

                {listaVeterinarios.length > 0 && (
                    <table className="w3-table w3-hoverable tabela-sistema">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Especialidades</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {listaVeterinarios.map((veterinario: any) => (
                                <tr key={veterinario.id}>
                                    <td>{veterinario.nome}</td>
                                    <td>{veterinario.cpf}</td>
                                    <td>
                                        {veterinario.especialidades && veterinario.especialidades.length > 0
                                            ? veterinario.especialidades.map((especialidade: any) => especialidade.nome).join(", ")
                                            : "Nenhuma especialidade"}
                                    </td>
                                    <td>
                                        <div className="acoes-tabela">
                                            <Link
                                                to={"/veterinarios/editar/" + veterinario.id}
                                                className="w3-button w3-text-blue"
                                            >
                                                <i className="fa fa-pencil"></i>
                                            </Link>

                                            <button
                                                className="w3-button w3-text-red"
                                                onClick={() => excluirVeterinario(veterinario.id)}
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