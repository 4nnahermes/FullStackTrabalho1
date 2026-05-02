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

    async inserir(pet: Pet, clienteId: number): Promise<Pet> {
        if (!pet || !pet.nome || !pet.especie || pet.idade === undefined || !pet.raca) {
            throw { id: 400, msg: "Dados do pet estão incompletos" };
        }

        const cliente = await this.clienteRepository.findOneBy({ id: clienteId });

        if (!cliente) {
            throw { id: 404, msg: "Cliente não encontrado" };
        }

        await this.verificarDuplicidadePet(pet.nome, clienteId);

        pet.cliente = cliente;

        return await this.repository.save(pet);
    }

    async listar(): Promise<Pet[]> {
        return await this.repository.find({
            relations: {
                cliente: true,
                consultas: true
            }
        });
    }

    async buscarPorId(id: number): Promise<Pet> {
        let pet = await this.repository.findOne({
            where: { id: id },
            relations: {
                cliente: true,
                consultas: true
            }
        });

        if (!pet) {
            throw { id: 404, msg: "Pet não encontrado" };
        }

        return pet;
    }

    async atualizar(id: number, petAlterado: Pet): Promise<Pet> {
        if (!petAlterado || !petAlterado.nome || !petAlterado.especie || petAlterado.idade === undefined || !petAlterado.raca) {
            throw { id: 400, msg: "Dados do pet estão incompletos" };
        }

        const pet = await this.repository.findOne({
            where: { id: id },
            relations: { cliente: true }
        });

        if (!pet) {
            throw { id: 404, msg: "Pet não encontrado" };
        }

        if (petAlterado.nome !== pet.nome) {
            await this.verificarDuplicidadePet(
                petAlterado.nome,
                pet.cliente!.id!,
                pet.id
            );
        }

        pet.nome = petAlterado.nome;
        pet.especie = petAlterado.especie;
        pet.idade = petAlterado.idade;
        pet.raca = petAlterado.raca;

        await this.repository.save(pet);
        return pet;
    }

    async deletar(id: number) {
        let pet = await this.repository.findOneBy({ id: id });
        if (pet) {
            await this.repository.delete({ id: id });
            return pet;
        } else {
            throw { id: 404, msg: "Pet não encontrado" };
        }
    }

    private async verificarDuplicidadePet(
        nome: string,
        clienteId: number,
        petId?: number
    ) {
        const existente = await this.repository.findOne({
            where: {
                nome,
                cliente: { id: clienteId }
            },
            relations: { cliente: true }
        });

        if (existente && existente.id !== petId) {
            throw { id: 400, msg: "Pet já cadastrado para este cliente" };
        }
    }
}