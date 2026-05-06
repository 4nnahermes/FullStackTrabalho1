import { Repository } from "typeorm";
import { Cliente } from "../entity/cliente";
import { Pet } from "../entity/pet";

export class ClienteService {
    private repository: Repository<Cliente>;
    private petRepository: Repository<Pet>;

    constructor(repositoy: Repository<Cliente>, petRepository: Repository<Pet>) {
        this.repository = repositoy;
        this.petRepository = petRepository;
    }

    async inserir(cliente: Cliente): Promise<Cliente> {
        if (!cliente || !cliente.nome || !cliente.email || !cliente.telefone || !cliente.cpf) {
            throw { id: 400, msg: "Dados do cliente estão incompletos" };
        }

        if (cliente.pets !== undefined) {
            throw { id: 400, msg: "Cliente não deve ser cadastrado com pets" };
        }

        cliente.nome = this.normalizarTexto(cliente.nome);
        cliente.email = this.normalizarTexto(cliente.email);
        cliente.telefone = this.normalizarTexto(cliente.telefone);
        cliente.cpf = this.normalizarTexto(cliente.cpf);

        if (!cliente.email.includes("@")) {
            throw { id: 400, msg: "Email inválido" };
        }

        if (cliente.cpf.length !== 11) {
            throw { id: 400, msg: "CPF inválido" };
        }

        const emailExistente = await this.buscarPorEmail(cliente.email);
        if (emailExistente) {
            throw { id: 400, msg: "Email já cadastrado" };
        }

        const cpfExistente = await this.buscarPorCpf(cliente.cpf);
        if (cpfExistente) {
            throw { id: 400, msg: "CPF já cadastrado" };
        }

        return await this.repository.save(cliente);
    }

    async listar(): Promise<Cliente[]> {
        const clientes = await this.repository.find({
            relations: { pets: true },
            order: { nome: "ASC" }
        });

        if (!clientes || clientes.length === 0) {
            throw { id: 404, msg: "Nenhum cliente encontrado" };
        }

        return clientes;
    }

    async buscarPorId(id: number): Promise<Cliente> {
        let cliente = await this.buscarPorIdComRelacionamentos(id);

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

        if (!clienteAlterado || (!clienteAlterado.nome && !clienteAlterado.email && !clienteAlterado.telefone && !clienteAlterado.cpf)) {
            throw { id: 400, msg: "Nenhum campo para atualizar" };
        }

        if (clienteAlterado.pets !== undefined) {
            throw { id: 400, msg: "Cliente não pode ser atualizado com pets" };
        }

        if (clienteAlterado.nome !== undefined && clienteAlterado.nome.toString().trim() === "") {
            throw { id: 400, msg: "Nome inválido" };
        }

        if (clienteAlterado.email !== undefined && clienteAlterado.email.toString().trim() === "") {
            throw { id: 400, msg: "Email inválido" };
        }

        if (clienteAlterado.telefone !== undefined && clienteAlterado.telefone.toString().trim() === "") {
            throw { id: 400, msg: "Telefone inválido" };
        }

        if (clienteAlterado.cpf !== undefined && clienteAlterado.cpf.toString().trim() === "") {
            throw { id: 400, msg: "CPF inválido" };
        }

        if (clienteAlterado.email && !clienteAlterado.email.includes("@")) {
            throw { id: 400, msg: "Email inválido" };
        }

        if (clienteAlterado.cpf && clienteAlterado.cpf.length !== 11) {
            throw { id: 400, msg: "CPF inválido" };
        }

        if (clienteAlterado.cpf) {
            const cpfExistente = await this.buscarPorCpf(clienteAlterado.cpf.toString().trim());

            if (cpfExistente && Number(cpfExistente.id) !== Number(id)) {
                throw { id: 400, msg: "CPF já cadastrado" };
            }

            cliente.cpf = this.normalizarTexto(clienteAlterado.cpf);
        }

        if (clienteAlterado.email) {
            const emailExistente = await this.buscarPorEmail(clienteAlterado.email.toString().trim());

            if (emailExistente && Number(emailExistente.id) !== Number(id)) {
                throw { id: 400, msg: "Email já cadastrado" };
            }

            cliente.email = this.normalizarTexto(clienteAlterado.email);
        }

        if (clienteAlterado.nome) cliente.nome = this.normalizarTexto(clienteAlterado.nome);
        if (clienteAlterado.telefone) cliente.telefone = this.normalizarTexto(clienteAlterado.telefone);

        await this.repository.save(cliente);
        return cliente;
    }

    async deletar(id: number) {
        let cliente = await this.repository.findOneBy({ id: id });
        if (!cliente) {
            throw { id: 404, msg: "Cliente não encontrado" };
        }

        const petsDoCliente = await this.petRepository.find({
            where: { cliente: { id: id } },
            relations: { consultas: true }
        });

        for (const pet of petsDoCliente) {
            if (pet.consultas && pet.consultas.length > 0) {
                throw { id: 400, msg: "Não é possível deletar cliente com animais que possuem consultas agendadas" };
            }
        }

        if (petsDoCliente.length > 0) {
            const idsPets = petsDoCliente.map(pet => pet.id).filter((petId): petId is number => petId !== undefined);
            if (idsPets.length > 0) {
                await this.petRepository.delete(idsPets);
            }
        }

        await this.repository.delete({ id: id });
        return cliente;
    }

    private normalizarTexto(valor: string): string {
        return valor.toString().trim();
    }

    private async buscarPorEmail(email: string): Promise<Cliente | null> {
        return await this.repository.findOneBy({ email: email });
    }

    private async buscarPorCpf(cpf: string): Promise<Cliente | null> {
        return await this.repository.findOneBy({ cpf: cpf });
    }

    private async buscarPorIdComRelacionamentos(id: number): Promise<Cliente | null> {
        return await this.repository.findOne({
            where: { id: id },
            relations: { pets: true }
        });
    }
}