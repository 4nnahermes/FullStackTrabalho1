import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import VeterinarioApiService from "../../service/VeterinarioApiService";
import EspecialidadeApiService from "../../service/EspecialidadeApiService";

export default function FormVeterinario() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [listaEspecialidades, setListaEspecialidades] = useState([]);
    const [especialidadesSelecionadas, setEspecialidadesSelecionadas] = useState<number[]>([]);
    const [mensagemErro, setMensagemErro] = useState("");

    useEffect(() => {
        EspecialidadeApiService.listar().then((especialidades) => {
            setListaEspecialidades(especialidades);

            if (!id && especialidades.length > 0) {
                setEspecialidadesSelecionadas([especialidades[0].id]);
            }
        });

        if (id) {
            VeterinarioApiService.buscarPorId(Number(id)).then(veterinario => {
                setNome(veterinario.nome);
                setCpf(formatarCpf(veterinario.cpf));;

                const ids = veterinario.especialidades.map((especialidade: any) => especialidade.id);
                setEspecialidadesSelecionadas(ids);
            });
        }
    }, []);

    function alterarEspecialidade(idEspecialidade: number) {
        if (especialidadesSelecionadas.includes(idEspecialidade)) {
            setEspecialidadesSelecionadas(
                especialidadesSelecionadas.filter(id => id !== idEspecialidade)
            );
        } else {
            setEspecialidadesSelecionadas([
                ...especialidadesSelecionadas,
                idEspecialidade
            ]);
        }
    }

    function salvarVeterinario(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        setMensagemErro("");

        const veterinario = {
            nome,
            cpf: cpf.replace(/\D/g, ""),
            especialidades: especialidadesSelecionadas.map(idEspecialidade => ({
                id: idEspecialidade
            }))
        };

        if (id) {
            VeterinarioApiService.atualizar(Number(id), veterinario)
                .then(() => {
                    alert("Veterinário atualizado com sucesso!");
                    navigate("/veterinarios");
                })
                .catch(err =>
                    setMensagemErro(err.response?.data?.error || "Erro ao atualizar veterinário.")
                );
        } else {
            VeterinarioApiService.inserir(veterinario)
                .then(() => {
                    alert("Veterinário cadastrado com sucesso!");
                    navigate("/veterinarios");
                })
                .catch(err =>
                    setMensagemErro(err.response?.data?.error || "Erro ao cadastrar veterinário.")
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

    return (
        <div className="pagina">
            <div className="cabecalho-pagina">
                <div>
                    <h1>{id ? "Edição de Veterinário" : "Cadastro de Veterinário"}</h1>
                    <p>Preencha os dados do veterinário abaixo.</p>
                </div>
            </div>

            <div className="card-conteudo card-formulario">
                {mensagemErro && (
                    <div className="w3-panel w3-pale-red w3-border">
                        {mensagemErro}
                    </div>
                )}

                <form onSubmit={salvarVeterinario}>
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
                            value={cpf}
                            onChange={(e) => setCpf(formatarCpf(e.target.value))}
                            required
                        />
                    </div>

                    <div className="w3-section">
                        <label>Especialidades:</label>

                        {listaEspecialidades.map((especialidade: any) => (
                            <label key={especialidade.id} className="checkbox-formulario">
                                <input
                                    type="checkbox"
                                    checked={especialidadesSelecionadas.includes(especialidade.id)}
                                    onChange={() => alterarEspecialidade(especialidade.id)}
                                />
                                <span>{especialidade.nome}</span>
                            </label>
                        ))}
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