import { Repository, In } from "typeorm";
import { Veterinario } from "../entity/veterinario";
import { Especialidade } from "../entity/especialidade";

export class VeterinarioService {
    private repository: Repository<Veterinario>;
    private especialidadeRepository: Repository<Especialidade>;

    constructor(repository: Repository<Veterinario>, especialidadeRepository: Repository<Especialidade>) {
        this.repository = repository;
        this.especialidadeRepository = especialidadeRepository;
    }

    async inserir(veterinario: Veterinario, especialidadesIds: number[]): Promise<Veterinario> {
        if (!veterinario) {
            throw { id: 400, msg: "Dados do veterinário estão incompletos" };
        }

        if (!veterinario.nome || veterinario.nome.toString().trim() === "") {
            throw { id: 400, msg: "Nome inválido" };
        }

        veterinario.nome = this.normalizarNome(veterinario.nome);

        if (!veterinario.cpf || veterinario.cpf.toString().trim() === "") {
            throw { id: 400, msg: "CPF inválido" };
        }

        veterinario.cpf = veterinario.cpf.toString().trim();

        if (veterinario.cpf.length !== 11) {
            throw { id: 400, msg: "CPF inválido" };
        }

        const existente = await this.buscarPorCpf(veterinario.cpf);
        if (existente) {
            throw { id: 400, msg: "CPF já cadastrado" };
        }

        const especialidades = await this.buscarEspecialidades(especialidadesIds);

        veterinario.especialidades = especialidades;

        return await this.repository.save(veterinario);
    }

    async listar(): Promise<Veterinario[]> {
        return await this.repository.find({
            order: { nome: "ASC" },
            relations: {
                especialidades: true,
                consultas: true
            }
        });
    }

    async buscarPorId(id: number): Promise<Veterinario> {
        let veterinario = await this.buscarPorIdComRelacionamentos(id);

        if (!veterinario) {
            throw { id: 404, msg: "Veterinário não encontrado" };
        }

        return veterinario;
    }

    async atualizar(id: number, veterinarioAlterado: Veterinario, especialidadesIds?: number[]): Promise<Veterinario> {
        const veterinario = await this.repository.findOne({
            where: { id: id },
            relations: { especialidades: true }
        });

        if (!veterinario) {
            throw { id: 404, msg: "Veterinário não encontrado" };
        }

        if (!veterinarioAlterado || (!veterinarioAlterado.nome && !veterinarioAlterado.cpf && especialidadesIds === undefined)) {
            throw { id: 400, msg: "Nenhum campo para atualizar" };
        }

        if (veterinarioAlterado && veterinarioAlterado.nome) {
            veterinario.nome = veterinarioAlterado.nome.toString().trim();
        }

        if (veterinarioAlterado && veterinarioAlterado.cpf) {
            const novoCpf = veterinarioAlterado.cpf.toString().trim();
            if (novoCpf.length !== 11) {
                throw { id: 400, msg: "CPF inválido" };
            }

            if (novoCpf !== veterinario.cpf) {
                const existente = await this.buscarPorCpf(novoCpf);
                if (existente && existente.id !== id) {
                    throw { id: 400, msg: "CPF já cadastrado" };
                }
            }

            veterinario.cpf = novoCpf;
        }

        if (especialidadesIds !== undefined) {
            const especialidades = await this.buscarEspecialidades(especialidadesIds);
            veterinario.especialidades = especialidades;
        }

        await this.repository.save(veterinario);
        return veterinario;
    }

    async deletar(id: number) {
        let veterinario = await this.repository.findOne({
            where: { id: id },
            relations: { consultas: true }
        });
        if (!veterinario) {
            throw { id: 404, msg: "Veterinário não encontrado" };
        }

        if (veterinario.consultas && veterinario.consultas.length > 0) {
            throw { id: 400, msg: "Não é possível deletar veterinário com consultas agendadas" };
        }

        await this.repository.delete({ id: id });
        return veterinario;
    }

    private async buscarEspecialidades(ids: number[]): Promise<Especialidade[]> {
        if (!ids || ids.length === 0) {
            throw { id: 400, msg: "Informe pelo menos uma especialidade" };
        }

        const idsUnicos = [...new Set(ids)];
        if (idsUnicos.length !== ids.length) {
            throw { id: 400, msg: "Especialidades duplicadas informadas" };
        }

        const especialidades = await this.especialidadeRepository.find({
            where: {
                id: In(idsUnicos)
            }
        });

        if (especialidades.length !== ids.length) {
            throw { id: 404, msg: "Uma ou mais especialidades não foram encontradas" };
        }

        return especialidades;
    }

    private normalizarNome(nome: string): string {
        return nome.trim();
    }

    private async buscarPorCpf(cpf: string): Promise<Veterinario | null> {
        return await this.repository.findOneBy({ cpf: cpf });
    }

    private async buscarPorIdComRelacionamentos(id: number): Promise<Veterinario | null> {
        return await this.repository.findOne({
            where: { id: id },
            relations: {
                especialidades: true,
                consultas: true
            }
        });
    }
}