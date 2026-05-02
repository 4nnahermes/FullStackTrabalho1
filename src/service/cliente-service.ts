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

        const cpfExistente = await this.repository.findOneBy({ cpf: cliente.cpf });
        if (cpfExistente) {
            throw { id: 400, msg: "CPF já cadastrado" };
        }

        return await this.repository.save(cliente);
    }

    async listar(): Promise<Cliente[]> {
        return await this.repository.find({
            relations: { pets: true }
        });
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
        if (clienteAlterado && clienteAlterado.nome && clienteAlterado.cpf && clienteAlterado.email && clienteAlterado.telefone) {

            if (!clienteAlterado.email.includes("@")) {
                throw { id: 400, msg: "Email inválido" };
            }

            if (clienteAlterado.cpf.length !== 11) {
                throw { id: 400, msg: "CPF inválido" };
            }

            const cpfExistente = await this.repository.findOneBy({ cpf: clienteAlterado.cpf });

            if (cpfExistente && cpfExistente.id !== id) {
                throw { id: 400, msg: "CPF já cadastrado" };
            }

            const cliente = await this.repository.findOneBy({ id: id });

            if (cliente) {
                cliente.nome = clienteAlterado.nome;
                cliente.cpf = clienteAlterado.cpf;
                cliente.email = clienteAlterado.email;
                cliente.telefone = clienteAlterado.telefone;

                await this.repository.save(cliente);
                return cliente;
            } else {
                throw { id: 404, msg: "Cliente não encontrado" };
            }

        } else {
            throw { id: 400, msg: "Dados do cliente estão incompletos" };
        }
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