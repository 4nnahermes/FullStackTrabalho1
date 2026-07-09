import { useEffect, useState } from "react";
import { Link } from "react-router";
import VeterinarioApiService from "../../service/VeterinarioApiService";
import Mensagem from "../Mensagem";
import Confirmacao from "../Confirmacao";

export default function ListaVeterinarios() {
    const [listaVeterinarios, setListaVeterinarios] = useState([]);
    const [mensagemErro, setMensagemErro] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [veterinarioSelecionado, setVeterinarioSelecionado] = useState<any>(null);
    const [mensagemConfirmacao, setMensagemConfirmacao] = useState("");

    useEffect(() => {
        carregarVeterinarios();
    }, []);

    function carregarVeterinarios() {
        VeterinarioApiService.listar().then(
            veterinarios => setListaVeterinarios(veterinarios)
        );
    }

    function excluirVeterinario(veterinario: any) {
        setVeterinarioSelecionado(veterinario);
        setMensagemConfirmacao("Deseja excluir este veterinário?");
        setMostrarConfirmacao(true);
    }

    function confirmarExclusao() {
        if (!veterinarioSelecionado) {
            return;
        }

        setMensagemErro("");
        setMensagemSucesso("");

        VeterinarioApiService.deletar(veterinarioSelecionado.id)
            .then(() => {
                setMensagemSucesso("Veterinário excluído com sucesso!");
                carregarVeterinarios();
            })
            .catch(err =>
                setMensagemErro(
                    err.response?.data?.error || "Erro ao excluir veterinário."
                )
            );

        setMostrarConfirmacao(false);
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
                    <h1>Veterinários</h1>
                    <p>Gerencie os veterinários cadastrados na clínica.</p>
                </div>

                <Link to="/veterinarios/novo" className="w3-button botao-principal">
                    + Novo Veterinário
                </Link>
            </div>

            <div className="card-conteudo">
                <Mensagem tipo="erro" texto={mensagemErro} />
                <Mensagem tipo="sucesso" texto={mensagemSucesso} />

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
                                    <td>{formatarCpf(veterinario.cpf)}</td>
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
                                                onClick={() => excluirVeterinario(veterinario)}
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
                titulo="Excluir Veterinário"
                mensagem={mensagemConfirmacao}
                onCancelar={() => setMostrarConfirmacao(false)}
                onConfirmar={confirmarExclusao}
            />
        </div>
    );
}