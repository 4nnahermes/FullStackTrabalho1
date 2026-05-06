import { Request, Response } from "express";
import { ConsultaService } from "../service/consulta-service";
import { converterDataBRParaISO, converterDataISOParaBR } from "../utils/dateHelper";

export class ConsultaController {
    private service: ConsultaService;

    constructor(service: ConsultaService) {
        this.service = service;
    }

    inserir = async (req: Request, res: Response): Promise<void> => {
        let { consulta, petId, veterinarioId } = req.body;

        if (consulta.data && consulta.data.includes('/')) {
            consulta = { ...consulta, data: converterDataBRParaISO(consulta.data) };
        }

        try {
            const novaConsulta = await this.service.inserir(
                consulta,
                petId,
                veterinarioId
            );

            res.status(201).json(this.formatarDatasConsulta(novaConsulta));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    };

    listar = async (_req: Request, res: Response): Promise<void> => {
        try {
            const consultas = await this.service.listar();
            res.json(consultas.map(consulta => this.formatarDatasConsulta(consulta)));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const consulta = await this.service.buscarPorId(id);
            res.json(this.formatarDatasConsulta(consulta));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    };

    atualizar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;
        const { consulta, petId, veterinarioId } = req.body;
        let consultaAlterada = consulta ?? req.body;

        if (consultaAlterada.data && consultaAlterada.data.includes('/')) {
            consultaAlterada = { ...consultaAlterada, data: converterDataBRParaISO(consultaAlterada.data) };
        }

        const payload = {
            ...consultaAlterada,
            petId,
            veterinarioId
        };

        try {
            const atualizada = await this.service.atualizar(id, payload as any);
            res.json(this.formatarDatasConsulta(atualizada));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    };

    deletar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const consulta = await this.service.deletar(id);
            res.json(this.formatarDatasConsulta(consulta));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    };

    private formatarDatasConsulta(consulta: any): any {
        if (!consulta) {
            return consulta;
        }

        let data = consulta.data as any;

        if (data instanceof Date) {
            data = data.toISOString().split('T')[0];
        }

        if (typeof data === 'string' && data.includes('-')) {
            data = converterDataISOParaBR(data);
        }

        return {
            ...consulta,
            data
        };
    }
}