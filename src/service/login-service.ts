import { Repository } from "typeorm";
import { Usuario } from "../entity/usuario";
import jwt from 'jsonwebtoken';

const SECRET = "FStack@2026";
export class LoginService {
    private repository: Repository<Usuario>;

    constructor(repository: Repository<Usuario>) {
        this.repository = repository;
    }

    async verificarLogin(email: String, senha: String): Promise<String> {
        let usuario = await this.repository.findOneBy({ email: String(email) });
        if (usuario && usuario.senha === senha) {
            let token = jwt.sign({
                usuarioId: usuario.id,
                usuarioEmail: usuario.email
            }, SECRET,
                { expiresIn: '1h' });
            return token;
        }
        throw ({ id: 401, msg: "Usuario ou senha invalidos" });
    }

    async validarToken(token: string): Promise<void> {
        try {
            console.log("Token", token);

            const payload = jwt.verify(token, SECRET);
            if (!payload) {
                throw ({ id: 401, msg: "Token inválido" });
            }
            return;
        }
        catch (err) {
            throw ({ id: 401, msg: "Token inválido" });
        }
    }
}