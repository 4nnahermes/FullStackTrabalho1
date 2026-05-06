import { Repository } from "typeorm";
import { Pet } from "../entity/pet";
import { Cliente } from "../entity/cliente";

export class PetService {
    private repository: Repository<Pet>;
    private clienteRepository: Repository<Cliente>;

    constructor(repository: Repository<Pet>, clienteRepository: Repository<Cliente>) {
        this.repository = repository;
        this.clienteRepository = clienteRepository;
    }

    async inserir(pet: Pet, clienteId?: number): Promise<Pet> {
        if (!pet || !pet.nome || pet.nome.toString().trim() === "" || !pet.especie || pet.especie.toString().trim() === "" || !pet.dataNascimento || !pet.raca || pet.raca.toString().trim() === "") {
            throw { id: 400, msg: "Dados do pet estão incompletos" };
        }

        pet.nome = this.normalizarTexto(pet.nome);
        pet.especie = this.normalizarTexto(pet.especie);
        pet.raca = this.normalizarTexto(pet.raca);

        if (clienteId === undefined || clienteId === null) {
            throw { id: 400, msg: "Informe o cliente do pet" };
        }

        const cliente = await this.buscarClientePorId(clienteId);

        if (!cliente) {
            throw { id: 404, msg: "Cliente não encontrado" };
        }

        await this.verificarDuplicidadePet(pet.nome, clienteId);

        pet.cliente = cliente;

        return await this.repository.save(pet);
    }

    async listar(): Promise<Pet[]> {
        return await this.repository.find({
            order: { nome: "ASC" },
            relations: {
                cliente: true,
                consultas: true
            }
        });
    }

    async buscarPorId(id: number): Promise<Pet> {
        let pet = await this.buscarPorIdComRelacionamentos(id);

        if (!pet) {
            throw { id: 404, msg: "Pet não encontrado" };
        }

        return pet;
    }

    async atualizar(id: number, petAlterado: Pet): Promise<Pet> {
        const pet = await this.buscarPorIdComCliente(id);

        if (!pet) {
            throw { id: 404, msg: "Pet não encontrado" };
        }

        if (!petAlterado || (!petAlterado.nome && !petAlterado.especie && !petAlterado.dataNascimento && !petAlterado.raca && !petAlterado.cliente)) {
            throw { id: 400, msg: "Nenhum campo para atualizar" };
        }

        if (petAlterado.nome !== undefined && petAlterado.nome.toString().trim() === "") {
            throw { id: 400, msg: "Nome inválido" };
        }

        if (petAlterado.especie !== undefined && petAlterado.especie.toString().trim() === "") {
            throw { id: 400, msg: "Espécie inválida" };
        }

        if (petAlterado.raca !== undefined && petAlterado.raca.toString().trim() === "") {
            throw { id: 400, msg: "Raça inválida" };
        }

        const dataNascimentoAlterada = petAlterado.dataNascimento as any;
        if (typeof dataNascimentoAlterada === "string" && dataNascimentoAlterada.trim() === "") {
            throw { id: 400, msg: "Data de nascimento inválida" };
        }

        if (petAlterado.cliente !== undefined) {
            let novoClienteId: number | undefined;

            if (typeof petAlterado.cliente === 'number') {
                novoClienteId = petAlterado.cliente;
            } else if (petAlterado.cliente && (petAlterado.cliente.id !== undefined)) {
                novoClienteId = Number(petAlterado.cliente.id);
            }

            if (novoClienteId === undefined || novoClienteId === null) {
                throw { id: 400, msg: "Cliente inválido" };
            }

            const novoCliente = await this.buscarClientePorId(novoClienteId);
            if (!novoCliente) {
                throw { id: 404, msg: "Cliente não encontrado" };
            }

            const nomeParaVerificar = petAlterado.nome ? this.normalizarTexto(petAlterado.nome) : pet.nome!;
            await this.verificarDuplicidadePet(nomeParaVerificar, novoClienteId, pet.id);

            pet.cliente = novoCliente;
        }

        if (petAlterado.nome && petAlterado.nome !== pet.nome) {
            const novoNome = this.normalizarTexto(petAlterado.nome);
            await this.verificarDuplicidadePet(
                novoNome,
                pet.cliente!.id!,
                pet.id
            );
            pet.nome = novoNome;
        }

        if (petAlterado.especie) pet.especie = this.normalizarTexto(petAlterado.especie);
        if (petAlterado.dataNascimento !== undefined) pet.dataNascimento = petAlterado.dataNascimento;
        if (petAlterado.raca) pet.raca = this.normalizarTexto(petAlterado.raca);

        await this.repository.save(pet);
        return pet;
    }

    async deletar(id: number) {
        let pet = await this.repository.findOne({
            where: { id: id },
            relations: { consultas: true }
        });
        if (!pet) {
            throw { id: 404, msg: "Pet não encontrado" };
        }

        if (pet.consultas && pet.consultas.length > 0) {
            throw { id: 400, msg: "Não é possível deletar pet com consultas agendadas" };
        }

        await this.repository.delete({ id: id });
        return pet;
    }

    private normalizarTexto(valor: string): string {
        return valor.toString().trim();
    }

    private async buscarClientePorId(clienteId: number): Promise<Cliente | null> {
        const idNum = Number(clienteId);
        if (Number.isNaN(idNum)) return null;
        return await this.clienteRepository.findOneBy({ id: idNum });
    }

    private async buscarPorIdComRelacionamentos(id: number): Promise<Pet | null> {
        return await this.repository.findOne({
            where: { id: id },
            relations: {
                cliente: true,
                consultas: true
            }
        });
    }

    private async buscarPorIdComCliente(id: number): Promise<Pet | null> {
        return await this.repository.findOne({
            where: { id: id },
            relations: { cliente: true }
        });
    }

    private async verificarDuplicidadePet(
        nome: string,
        clienteId: number,
        petId?: number
    ) {
        const existente = await this.buscarPorNomeECliente(nome, clienteId);

        if (existente && existente.id !== petId) {
            throw { id: 400, msg: "Pet já cadastrado para este cliente" };
        }
    }

    private async buscarPorNomeECliente(nome: string, clienteId: number): Promise<Pet | null> {
        return await this.repository.findOne({
            where: {
                nome,
                cliente: { id: clienteId }
            },
            relations: { cliente: true }
        });
    }
}