import { Request, Response } from "express";
import { VeterinarioService } from "../service/veterinario-service";
import { converterDataISOParaBR } from "../utils/dateHelper";

export class VeterinarioController {
    private service: VeterinarioService;

    constructor(service: VeterinarioService) {
        this.service = service;
    }

    inserir = async (req: Request, res: Response): Promise<void> => {
        let { veterinario, especialidadesIds } = req.body as any;

        if (!veterinario) {
            const { nome, cpf, especialidades } = req.body as any;
            veterinario = { nome, cpf };
            if (especialidades && Array.isArray(especialidades)) {
                if (especialidades.length > 0 && typeof especialidades[0] === 'number') {
                    especialidadesIds = especialidades.map((e: any) => Number(e));
                } else {
                    especialidadesIds = especialidades.map((e: any) => Number(e.id));
                }
            }
        }

        try {
            const novo = await this.service.inserir(veterinario, especialidadesIds);
            res.status(201).json(this.formatarVeterinario(novo));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    };

    listar = async (_req: Request, res: Response): Promise<void> => {
        try {
            const lista = await this.service.listar();
            res.json(lista.map(veterinario => this.formatarVeterinario(veterinario)));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const veterinario = await this.service.buscarPorId(id);
            res.json(this.formatarVeterinario(veterinario));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    };

    atualizar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;
        let { veterinario, especialidadesIds } = req.body as any;

        if (!veterinario) {
            const { nome, cpf, especialidades } = req.body as any;
            veterinario = { nome, cpf };
            if (especialidades && Array.isArray(especialidades)) {
                if (especialidades.length > 0 && typeof especialidades[0] === 'number') {
                    especialidadesIds = especialidades.map((e: any) => Number(e));
                } else {
                    especialidadesIds = especialidades.map((e: any) => Number(e.id));
                }
            }
        }

        try {
            const atualizado = await this.service.atualizar(
                id,
                veterinario,
                especialidadesIds
            );

            res.json(this.formatarVeterinario(atualizado));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    };

    deletar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const removido = await this.service.deletar(id);
            res.json(this.formatarVeterinario(removido));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    };

    private formatarVeterinario(veterinario: any): any {
        if (!veterinario) {
            return veterinario;
        }

        const consultas = Array.isArray(veterinario.consultas)
            ? veterinario.consultas.map((consulta: any) => {
                let dataConsulta = consulta.data as any;

                if (dataConsulta instanceof Date) {
                    dataConsulta = dataConsulta.toISOString().split('T')[0];
                }

                if (typeof dataConsulta === 'string' && dataConsulta.includes('-')) {
                    dataConsulta = converterDataISOParaBR(dataConsulta);
                }

                return {
                    ...consulta,
                    data: dataConsulta
                };
            })
            : veterinario.consultas;

        return {
            ...veterinario,
            consultas
        };
    }
}