import { Request, Response } from "express";
import { VeterinarioService } from "../service/veterinario-service";

export class VeterinarioController {
    private service: VeterinarioService;

    constructor(service: VeterinarioService) {
        this.service = service;
    }

    inserir = async (req: Request, res: Response): Promise<void> => {
        const { veterinario, especialidadesIds } = req.body;

        try {
            const novo = await this.service.inserir(veterinario, especialidadesIds);
            res.status(201).json(novo);
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
            const veterinario = await this.service.buscarPorId(id);
            res.json(veterinario);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };

    atualizar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;
        const { veterinario, especialidadesIds } = req.body;

        try {
            const atualizado = await this.service.atualizar(
                id,
                veterinario,
                especialidadesIds
            );

            res.json(atualizado);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };

    deletar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const removido = await this.service.deletar(id);
            res.json(removido);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };
}