import { Repository } from 'typeorm';
import { Usuario } from '../entity/usuario';

export class UsuarioService {
    private repository: Repository<Usuario>;

    constructor(repository: Repository<Usuario>) {
        this.repository = repository;
    }

    async inserir(usuario: Usuario): Promise<Usuario> {
        if (!usuario || !usuario.email || !usuario.senha) {
            throw { id: 400, msg: "Faltam dados obrigatórios" };
        }

        const email = usuario.email.toString().trim();

        const usuarioExistente = await this.repository.findOneBy({
            email: email
        });

        if (usuarioExistente) {
            throw {
                id: 400,
                msg: "Já existe um usuário cadastrado com este e-mail"
            };
        }

        usuario.email = email;

        return await this.repository.save(usuario);
    }

    async listar(): Promise<Usuario[]> {
        return await this.repository.find();
    }
}