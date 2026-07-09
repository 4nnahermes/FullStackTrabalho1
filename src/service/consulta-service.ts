import { Repository } from "typeorm";
import { Consulta } from "../entity/consulta";
import { Pet } from "../entity/pet";
import { Veterinario } from "../entity/veterinario";

export class ConsultaService {
    private repository: Repository<Consulta>;
    private petRepository: Repository<Pet>;
    private veterinarioRepository: Repository<Veterinario>;
    private readonly statusPermitidos = ['AGENDADA', 'CONCLUIDA', 'CANCELADA'];

    constructor(repository: Repository<Consulta>, petRepository: Repository<Pet>, veterinarioRepository: Repository<Veterinario>) {
        this.repository = repository;
        this.petRepository = petRepository;
        this.veterinarioRepository = veterinarioRepository;
    }

    async inserir(consulta: Consulta, petId: number, veterinarioId: number): Promise<Consulta> {
        if (!consulta || !consulta.data || !consulta.hora) {
            throw { id: 400, msg: "Dados da consulta estão incompletos" };
        }

        if (consulta.status !== undefined) {
            throw { id: 400, msg: "Status não pode ser enviado no cadastro de consulta" };
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
            order: {
                data: "ASC",
                hora: "ASC"
            },
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

    async atualizar(id: number, consultaAlterada: Consulta & any): Promise<Consulta> {
        const consulta = await this.repository.findOne({
            where: { id: id },
            relations: {
                pet: true,
                veterinario: true
            }
        });

        if (!consulta) {
            throw { id: 404, msg: "Consulta não encontrada" };
        }

        const hasData = consultaAlterada && consultaAlterada.data !== undefined && consultaAlterada.data !== null;
        const hasHora = consultaAlterada && consultaAlterada.hora !== undefined && consultaAlterada.hora !== null;
        const hasStatus = consultaAlterada && consultaAlterada.status !== undefined && consultaAlterada.status !== null;
        const hasPetId = consultaAlterada && ((consultaAlterada.petId !== undefined && consultaAlterada.petId !== null) || (consultaAlterada.pet && consultaAlterada.pet.id !== undefined));
        const hasVeterinarioId = consultaAlterada && ((consultaAlterada.veterinarioId !== undefined && consultaAlterada.veterinarioId !== null) || (consultaAlterada.veterinario && consultaAlterada.veterinario.id !== undefined));

        if (!hasData && !hasHora && !hasStatus && !hasPetId && !hasVeterinarioId) {
            throw { id: 400, msg: "Nenhum campo para atualizar" };
        }

        if (hasStatus && !this.statusPermitidos.includes(consultaAlterada.status)) {
            throw { id: 400, msg: this.mensagemStatusInvalido() };
        }

        const novaData: Date = hasData ? consultaAlterada.data : consulta.data!;
        const novaHora: string = hasHora ? consultaAlterada.hora : consulta.hora!;

        let novaPetId: number = consulta.pet!.id!;
        let novoVeterinarioId: number = consulta.veterinario!.id!;

        if (hasPetId) {
            if (consultaAlterada.petId !== undefined && consultaAlterada.petId !== null) {
                novaPetId = Number(consultaAlterada.petId);
            } else if (consultaAlterada.pet && consultaAlterada.pet.id !== undefined) {
                novaPetId = Number(consultaAlterada.pet.id);
            }
        }

        if (hasVeterinarioId) {
            if (consultaAlterada.veterinarioId !== undefined && consultaAlterada.veterinarioId !== null) {
                novoVeterinarioId = Number(consultaAlterada.veterinarioId);
            } else if (consultaAlterada.veterinario && consultaAlterada.veterinario.id !== undefined) {
                novoVeterinarioId = Number(consultaAlterada.veterinario.id);
            }
        }

        const statusFinal = hasStatus ? consultaAlterada.status : consulta.status;

        if (hasData && statusFinal === "AGENDADA") {
            this.validarData(novaData);
        }

        if (hasPetId && novaPetId !== consulta.pet!.id) {
            const pet = await this.petRepository.findOneBy({ id: novaPetId });
            if (!pet) throw { id: 404, msg: "Pet não encontrado" };
            consulta.pet = pet;
        }

        if (hasVeterinarioId && novoVeterinarioId !== consulta.veterinario!.id) {
            const vet = await this.veterinarioRepository.findOneBy({ id: novoVeterinarioId });
            if (!vet) throw { id: 404, msg: "Veterinário não encontrado" };
            consulta.veterinario = vet;
        }

        await this.verificarConflito(
            novaData,
            novaHora,
            novaPetId,
            novoVeterinarioId,
            consulta.id
        );

        if (hasData) consulta.data = novaData;
        if (hasHora) consulta.hora = novaHora;
        if (hasStatus) consulta.status = consultaAlterada.status!;

        await this.repository.save(consulta);
        return consulta;
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
        const dataConsulta = this.converterParaDataLocal(data);

        agora.setHours(0, 0, 0, 0);
        dataConsulta.setHours(0, 0, 0, 0);

        if (dataConsulta < agora) {
            throw { id: 400, msg: "A data da consulta não pode ser no passado" };
        }
    }

    private converterParaDataLocal(data: Date | string): Date {
        if (typeof data === "string") {
            if (data.includes("-")) {
                const [ano, mes, dia] = data.split("-").map(valor => Number(valor));
                return new Date(ano, mes - 1, dia);
            }

            if (data.includes("/")) {
                const [dia, mes, ano] = data.split("/").map(valor => Number(valor));
                return new Date(ano, mes - 1, dia);
            }
        }

        return new Date(data);
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

    private mensagemStatusInvalido(): string {
        return `Status inválido. Valores permitidos: ${this.statusPermitidos.join(", ")}`;
    }
}