import { Request, Response } from "express";
import { ConsultaService } from "../service/consulta-service";
import { converterDataBRParaISO } from "../utils/dateHelper";

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

            res.status(201).json(novaConsulta);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };

    listar = async (_req: Request, res: Response): Promise<void> => {
        const consultas = await this.service.listar();
        res.json(consultas);
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const consulta = await this.service.buscarPorId(id);
            res.json(consulta);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };

    atualizar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;
        let consulta = req.body;

        if (consulta.data && consulta.data.includes('/')) {
            consulta = { ...consulta, data: converterDataBRParaISO(consulta.data) };
        }

        try {
            const atualizada = await this.service.atualizar(id, consulta);
            res.json(atualizada);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };

    deletar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const consulta = await this.service.deletar(id);
            res.json(consulta);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };
}