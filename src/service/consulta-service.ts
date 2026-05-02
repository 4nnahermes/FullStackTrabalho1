import { Repository } from "typeorm";
import { Consulta } from "../entity/consulta";
import { Pet } from "../entity/pet";
import { Veterinario } from "../entity/veterinario";
import { Cliente } from "../entity/cliente";

export class ConsultaService {
    private repository: Repository<Consulta>;
    private petRepository: Repository<Pet>;
    private veterinarioRepository: Repository<Veterinario>;

    constructor(repository: Repository<Consulta>, petRepository: Repository<Pet>, veterinarioRepository: Repository<Veterinario>) {
        this.repository = repository;
        this.petRepository = petRepository;
        this.veterinarioRepository = veterinarioRepository;
    }

    async inserir(consulta: Consulta, petId: number, veterinarioId: number): Promise<Consulta> {
        if (!consulta || !consulta.data || !consulta.hora ) {
            throw { id: 400, msg: "Dados da consulta estão incompletos" };
        }

        const pet = await this.petRepository.findOneBy({ id: petId });
        if (!pet) {
            throw { id: 404, msg: "Pet não encontrado" };
        }

        const veterinario = await this.veterinarioRepository.findOneBy({ id: veterinarioId });
        if (!veterinario) {
            throw { id: 404, msg: "Veterinário não encontrado" };
        }

        this.validarData(consulta.data);

        await this.verificarConflito(
            consulta.data,
            consulta.hora,
            petId,
            veterinarioId
        );

        consulta.pet = pet;
        consulta.veterinario = veterinario;
        consulta.status = 'AGENDADA';

        return await this.repository.save(consulta);
    }

    async listar(): Promise<Consulta[]> {
        return await this.repository.find({
            relations: {
                pet: true,
                veterinario: true
            }
        });
    }

    async buscarPorId(id: number): Promise<Consulta> {
        let consulta = await this.repository.findOne({
            where: { id: id },
            relations: {
                pet: true,
                veterinario: true
            }
        });

        if (!consulta) {
            throw ({ id: 404, msg: "Consulta não encontrada" });
        }

        return consulta;
    }

    async atualizar(id: number, consultaAlterada: Consulta): Promise<Consulta> {
        if (consultaAlterada && consultaAlterada.data && consultaAlterada.hora && consultaAlterada.status) {

            const consulta = await this.repository.findOne({
                where: { id: id },
                relations: {
                    pet: true,
                    veterinario: true
                }
            });

            if (consulta) {
                this.validarData(consultaAlterada.data);

                consulta.data = consultaAlterada.data;
                consulta.hora = consultaAlterada.hora;
                consulta.status = consultaAlterada.status;

                await this.verificarConflito(
                    consulta.data,
                    consulta.hora,
                    consulta.pet!.id!,
                    consulta.veterinario!.id!,
                    consulta.id
                );

                await this.repository.save(consulta);
                return consulta;

            } else {
                throw { id: 404, msg: "Consulta não encontrada" };
            }

        } else {
            throw { id: 400, msg: "Dados da consulta estão incompletos" };
        }
    }

    async deletar(id: number) {
        let consulta = await this.repository.findOneBy({ id: id });
        if (consulta) {
            await this.repository.delete({ id: id });
            return consulta;
        } else {
            throw ({ id: 404, msg: "Consulta não encontrada" });
        }
    }

    private validarData(data: Date) {
        const agora = new Date();
        const dataConsulta = new Date(data);

        if (dataConsulta < agora) {
            throw { id: 400, msg: "A data da consulta não pode ser no passado" };
        }
    }

    private async verificarConflito(
        data: Date,
        hora: string,
        petId: number,
        veterinarioId: number,
        consultaId?: number
    ) {
        const conflito = await this.repository.findOne({
            where: [
                { data, hora, pet: { id: petId } },
                { data, hora, veterinario: { id: veterinarioId } }
            ],
            relations: {
                pet: true,
                veterinario: true
            }
        });

        if (conflito && conflito.id !== consultaId) {
            throw { id: 400, msg: "Já existe uma consulta nesse horário para o pet ou veterinário" };
        }
    }
}