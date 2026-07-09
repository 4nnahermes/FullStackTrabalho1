import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import UsuarioApiService from "../service/UsuarioApiService";

export default function CadastroUsuario() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagemErro, setMensagemErro] = useState("");

    function cadastrar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        setMensagemErro("");

        UsuarioApiService.inserir({
            email,
            senha
        })
            .then(() => {
                alert("Usuário cadastrado com sucesso!");
                navigate("/login");
            })
            .catch(err =>
                setMensagemErro(
                    err.response?.data?.error || "Erro ao cadastrar usuário."
                )
            );
    }

    return (
        <div className="pagina">
            <div className="card-conteudo card-formulario">
                <h1>Cadastro de Usuário</h1>
                <p>Crie um usuário para acessar o sistema.</p>

                {mensagemErro && (
                    <div className="w3-panel w3-pale-red w3-border">
                        {mensagemErro}
                    </div>
                )}

                <form onSubmit={cadastrar}>
                    <div className="w3-section">
                        <label>Email:</label>
                        <input
                            className="w3-input campo-formulario"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="w3-section">
                        <label>Senha:</label>
                        <input
                            className="w3-input campo-formulario"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <div className="botoes-formulario">
                        <input
                            className="w3-button botao-principal"
                            type="submit"
                            value="Cadastrar"
                        />

                        <Link to="/login" className="w3-button botao-secundario">
                            Voltar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}