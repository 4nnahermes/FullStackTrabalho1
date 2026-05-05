import { Repository } from "typeorm";
import { Cliente } from "../entity/cliente";

export class ClienteService {
    private repository: Repository<Cliente>;

    constructor(repositoy: Repository<Cliente>) {
        this.repository = repositoy;
    }

    async inserir(cliente: Cliente): Promise<Cliente> {
        if (!cliente || !cliente.nome || !cliente.email || !cliente.telefone || !cliente.cpf) {
            throw { id: 400, msg: "Dados do cliente estão incompletos" };
        }

        if (!cliente.email.includes("@")) {
            throw { id: 400, msg: "Email inválido" };
        }

        if (cliente.cpf.length !== 11) {
            throw { id: 400, msg: "CPF inválido" };
        }

        const emailExistente = await this.repository.findOneBy({ email: cliente.email });
        if (emailExistente) {
            throw { id: 400, msg: "Email já cadastrado" };
        }

        const cpfExistente = await this.repository.findOneBy({ cpf: cliente.cpf });
        if (cpfExistente) {
            throw { id: 400, msg: "CPF já cadastrado" };
        }

        return await this.repository.save(cliente);
    }

    async listar(): Promise<Cliente[]> {
        const clientes = await this.repository.find({
            relations: { pets: true }
        });

        if (!clientes || clientes.length === 0) {
            throw { id: 404, msg: "Nenhum cliente encontrado" };
        }

        return clientes;
    }

    async buscarPorId(id: number): Promise<Cliente> {
        let cliente = await this.repository.findOne({
            where: { id: id },
            relations: { pets: true }
        });

        if (!cliente) {
            throw ({ id: 404, msg: "Cliente não encontrado" });
        }

        return cliente;
    }

    async atualizar(id: number, clienteAlterado: Cliente): Promise<Cliente> {
        const cliente = await this.repository.findOneBy({ id: id });

        if (!cliente) {
            throw { id: 404, msg: "Cliente não encontrado" };
        }

        if (clienteAlterado.email && !clienteAlterado.email.includes("@")) {
            throw { id: 400, msg: "Email inválido" };
        }

        if (clienteAlterado.cpf && clienteAlterado.cpf.length !== 11) {
            throw { id: 400, msg: "CPF inválido" };
        }

        if (clienteAlterado.cpf) {
            const cpfExistente = await this.repository.findOneBy({ cpf: clienteAlterado.cpf });

            if (cpfExistente && Number(cpfExistente.id) !== Number(id)) {
                throw { id: 400, msg: "CPF já cadastrado" };
            }

            cliente.cpf = clienteAlterado.cpf;
        }

        if (clienteAlterado.email) {
            const emailExistente = await this.repository.findOneBy({ email: clienteAlterado.email });

            if (emailExistente && Number(emailExistente.id) !== Number(id)) {
                throw { id: 400, msg: "Email já cadastrado" };
            }

            cliente.email = clienteAlterado.email;
        }

        if (clienteAlterado.nome) cliente.nome = clienteAlterado.nome;
        if (clienteAlterado.telefone) cliente.telefone = clienteAlterado.telefone;

        await this.repository.save(cliente);
        return cliente;
    }

    async deletar(id: number) {
        let cliente = await this.repository.findOneBy({ id: id });
        if (cliente) {
            await this.repository.delete({ id: id });
            return cliente;
        } else {
            throw ({ id: 404, msg: "Cliente não encontrado" });
        }
    }
}