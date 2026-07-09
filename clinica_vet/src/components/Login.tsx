import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagemErro, setMensagemErro] = useState("");

    async function entrar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        setMensagemErro("");

        try {
            await login(email, senha);
            navigate("/");
        } catch (err: any) {
            setMensagemErro(
                err.response?.data?.error || "Email ou senha inválidos."
            );
        }
    }

    return (
        <div className="pagina">
            <div className="card-conteudo card-formulario">
                <h1>Login</h1>
                <p>Acesse o sistema da clínica.</p>

                {mensagemErro && (
                    <div className="w3-panel w3-pale-red w3-border">
                        {mensagemErro}
                    </div>
                )}

                <form onSubmit={entrar}>
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
                            value="Entrar"
                        />
                    </div>

                    <p className="login-cadastro">
                        Ainda não possui uma conta?{" "}
                        <Link to="/cadastro">Cadastre-se</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}