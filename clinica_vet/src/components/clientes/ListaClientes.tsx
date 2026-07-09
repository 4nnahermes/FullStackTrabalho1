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

    function excluirCliente(cliente: any) {
        let mensagem = "Deseja excluir este cliente?";

        if (cliente.pets && cliente.pets.length > 0) {
            mensagem = "Este cliente possui pets cadastrados. Eles também serão excluídos. Deseja continuar?";
        }

        if (confirm(mensagem)) {
            ClienteApiService.deletar(cliente.id).then(() => {
                alert("Cliente excluído com sucesso!");
                carregarClientes();
            });
        }
    }

    function formatarCpf(valor: string) {
        valor = valor.replace(/\D/g, "");
        valor = valor.substring(0, 11);

        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        return valor;
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
                                <th>Pets</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {listaClientes.map((cliente: any) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nome}</td>
                                    <td>{formatarCpf(cliente.cpf)}</td>
                                    <td>{cliente.email}</td>
                                    <td>{cliente.telefone}</td>
                                    <td>
                                        {cliente.pets && cliente.pets.length > 0
                                            ? cliente.pets.map((pet: any) => pet.nome).join(", ")
                                            : "Nenhum pet"}
                                    </td>
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
                                                onClick={() => excluirCliente(cliente)}
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