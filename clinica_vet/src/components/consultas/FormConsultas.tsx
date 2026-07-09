import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import ConsultaApiService from "../../service/ConsultaApiService";
import PetApiService from "../../service/PetApiService";
import VeterinarioApiService from "../../service/VeterinarioApiService";

export default function FormConsulta() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [petId, setPetId] = useState("");
    const [veterinarioId, setVeterinarioId] = useState("");
    const [data, setData] = useState("");
    const [hora, setHora] = useState("");
    const [status, setStatus] = useState("AGENDADA");

    const [listaPets, setListaPets] = useState([]);
    const [listaVeterinarios, setListaVeterinarios] = useState([]);
    const [mensagemErro, setMensagemErro] = useState("");

    useEffect(() => {
        PetApiService.listar().then(pets => setListaPets(pets));
        VeterinarioApiService.listar().then(veterinarios => setListaVeterinarios(veterinarios));

        if (id) {
            ConsultaApiService.buscarPorId(Number(id)).then(consulta => {
                setPetId(consulta.pet?.id?.toString());
                setVeterinarioId(consulta.veterinario?.id?.toString());

                if (consulta.data && consulta.data.includes("/")) {
                    const partes = consulta.data.split("/");
                    setData(partes[2] + "-" + partes[1] + "-" + partes[0]);
                } else {
                    setData(consulta.data);
                }

                setHora(consulta.hora);
                setStatus(consulta.status);
            });
        }
    }, []);

    function salvarConsulta(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        setMensagemErro("");

        const consulta = id
            ? { data, hora, status }
            : { data, hora };

        const payload = {
            consulta,
            petId: Number(petId),
            veterinarioId: Number(veterinarioId)
        };

        if (id) {
            ConsultaApiService.atualizar(Number(id), payload)
                .then(() => {
                    alert("Consulta atualizada com sucesso!");
                    navigate("/consultas");
                })
                .catch(err =>
                    setMensagemErro(err.response?.data?.error || "Erro ao atualizar consulta.")
                );
        } else {
            ConsultaApiService.inserir(payload)
                .then(() => {
                    alert("Consulta cadastrada com sucesso!");
                    navigate("/consultas");
                })
                .catch(err =>
                    setMensagemErro(err.response?.data?.error || "Erro ao cadastrar consulta.")
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
                    <h1>{id ? "Edição de Consulta" : "Cadastro de Consulta"}</h1>
                    <p>Selecione o pet, o veterinário, a data e o horário da consulta.</p>
                </div>
            </div>

            <div className="card-conteudo card-formulario">
                {mensagemErro && (
                    <div className="w3-panel w3-pale-red w3-border">
                        {mensagemErro}
                    </div>
                )}

                <form onSubmit={salvarConsulta}>
                    <div className="w3-section">
                        <label>Pet:</label>
                        <select
                            className="w3-select campo-formulario"
                            value={petId}
                            onChange={(e) => setPetId(e.target.value)}
                            required
                        >
                            <option value="">Selecione um pet</option>

                            {listaPets.map((pet: any) => (
                                <option key={pet.id} value={pet.id}>
                                    {pet.nome}
                                    {pet.cliente?.nome ? " - " + pet.cliente.nome : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w3-section">
                        <label>Veterinário:</label>
                        <select
                            className="w3-select campo-formulario"
                            value={veterinarioId}
                            onChange={(e) => setVeterinarioId(e.target.value)}
                            required
                        >
                            <option value="">Selecione um veterinário</option>

                            {listaVeterinarios.map((veterinario: any) => (
                                <option key={veterinario.id} value={veterinario.id}>
                                    {veterinario.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w3-section">
                        <label>Data:</label>
                        <input
                            className="w3-input campo-formulario"
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            required
                        />
                    </div>

                    <div className="w3-section">
                        <label>Hora:</label>
                        <input
                            className="w3-input campo-formulario"
                            type="time"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                            required
                        />
                    </div>

                    {id && (
                        <div className="w3-section">
                            <label>Status:</label>
                            <select
                                className="w3-select campo-formulario"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <option value="AGENDADA">Agendada</option>
                                <option value="CONCLUIDA">Concluída</option>
                                <option value="CANCELADA">Cancelada</option>
                            </select>
                        </div>
                    )}

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