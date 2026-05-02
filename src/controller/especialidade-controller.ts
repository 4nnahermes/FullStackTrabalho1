import { Request, Response } from "express";
import { EspecialidadeService } from "../service/especialidade-service";

export class EspecialidadeController {
    private service: EspecialidadeService;

    constructor(service: EspecialidadeService) {
        this.service = service;
    }

    inserir = async (req: Request, res: Response): Promise<void> => {
        const especialidade = req.body;

        try {
            const nova = await this.service.inserir(especialidade);
            res.status(201).json(nova);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };

    listar = async (_req: Request, res: Response): Promise<void> => {
        const lista = await this.service.listar();
        res.json(lista);
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const especialidade = await this.service.buscarPorId(id);
            res.json(especialidade);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };

    atualizar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;
        const especialidade = req.body;

        try {
            const atualizada = await this.service.atualizar(id, especialidade);
            res.json(atualizada);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };

    deletar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const removida = await this.service.deletar(id);
            res.json(removida);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };
}