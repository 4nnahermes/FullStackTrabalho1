import { useEffect, useState } from "react";
import { Link } from "react-router";
import ClienteApiService from "../../service/ClienteApiService";

export default function ListaClientes() {
    const [listaClientes, setListaClientes] = useState([]);

    useEffect(() => {
        carregarClientes();
    }, [])

    function carregarClientes() {
        ClienteApiService.listar().then(
            clientes => setListaClientes(clientes)
        )
    }

    function excluirCliente(id: number) {
        if (confirm("Deseja excluir este cliente?")) {
            ClienteApiService.deletar(id).then(() => {
                alert("Cliente excluído com sucesso!");
                carregarClientes();
            });
        }
    }

    return (
        <div className="pagina">
            <div className="cabecalho-pagina">
                <div>
                    <h1>Clientes</h1>
                    <p>Gerencie os clientes cadastrados na clínica.</p>
                </div>

                <Link to="/clientes/novo" className="w3-button botao-principal">
                    + Novo Cliente
                </Link>
            </div>

            <div className="card-conteudo">
                {listaClientes.length === 0 && (
                    <p>Nenhum cliente cadastrado.</p>
                )}

                {listaClientes.length > 0 && (
                    <table className="w3-table-all w3-hoverable tabela-sistema">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {listaClientes.map((cliente: any) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nome}</td>
                                    <td>{cliente.cpf}</td>
                                    <td>{cliente.email}</td>
                                    <td>{cliente.telefone}</td>
                                    <td>
                                        <div className="acoes-tabela">
                                            <Link
                                                to={"/clientes/editar/" + cliente.id}
                                                className="w3-button w3-text-blue"
                                            >
                                                <i className="fa fa-pencil"></i>
                                            </Link>

                                            <button
                                                className="w3-button w3-text-red"
                                                onClick={() => excluirCliente(cliente.id)}
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