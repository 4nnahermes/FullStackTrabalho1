import { Repository } from "typeorm";
import { Especialidade } from "../entity/especialidade";

export class EspecialidadeService {
    private repository: Repository<Especialidade>;

    constructor(repository: Repository<Especialidade>) {
        this.repository = repository;
    }

    async inserir(especialidade: Especialidade): Promise<Especialidade> {
        if (!especialidade || !especialidade.nome) {
            throw { id: 400, msg: "Dados da especialidade estão incompletos" };
        }

        especialidade.nome = this.normalizarNome(especialidade.nome);

        const existente = await this.buscarPorNome(especialidade.nome);

        if (existente) {
            throw { id: 400, msg: "Especialidade já cadastrada" };
        }

        return await this.repository.save(especialidade);
    }

    async listar(): Promise<Especialidade[]> {
        return await this.repository.find({
            relations: { veterinarios: true },
            order: { nome: "ASC" }
        });
    }

    async buscarPorId(id: number): Promise<Especialidade> {
        let especialidade = await this.buscarPorIdComRelacionamentos(id);

        if (!especialidade) {
            throw { id: 404, msg: "Especialidade não encontrada" };
        }

        return especialidade;
    }

    async atualizar(id: number, especialidadeAlterada: Especialidade): Promise<Especialidade> {
        let especialidade = await this.repository.findOneBy({ id: id });

        if (!especialidade) {
            throw { id: 404, msg: "Especialidade não encontrada" };
        }
        if (!especialidadeAlterada || !especialidadeAlterada.nome) {
            throw { id: 400, msg: "Nenhum campo para atualizar" };
        }

        const nomeNormalizado = this.normalizarNome(especialidadeAlterada.nome);

        if (nomeNormalizado !== especialidade.nome) {
            const existente = await this.buscarPorNome(nomeNormalizado);

            if (existente && existente.id !== id) {
                throw { id: 400, msg: "Especialidade já cadastrada" };
            }
        }

        especialidade.nome = nomeNormalizado;

        await this.repository.save(especialidade);
        return especialidade;
    }

    async deletar(id:number) {
        const especialidade = await this.buscarPorIdComRelacionamentos(id);

        if (!especialidade) {
            throw { id: 404, msg: "Especialidade não encontrada" };
        }

        if (especialidade.veterinarios && especialidade.veterinarios.length > 0) {
            throw { id: 400, msg: "Especialidade vinculada a veterinários. Remova os vínculos antes de deletar." };
        }

        await this.repository.delete({ id: id });
        return especialidade;
    }

    private normalizarNome(nome: string): string {
        return nome.trim();
    }

    private async buscarPorNome(nome: string): Promise<Especialidade | null> {
        return await this.repository.findOneBy({ nome: nome });
    }

    private async buscarPorIdComRelacionamentos(id: number): Promise<Especialidade | null> {
        return await this.repository.findOne({
            where: { id: id },
            relations: {
                veterinarios: true
            }
        });
    }
}