import { Request, Response } from "express";
import { PetService } from "../service/pet-service";
import { converterDataBRParaISO } from "../utils/dateHelper";

export class PetController {
    private service: PetService;

    constructor(service: PetService) {
        this.service = service;
    }

    inserir = async (req: Request, res: Response): Promise<void> => {
        const { nome, especie, dataNascimento, raca, cliente } = req.body;
        const clienteId = cliente?.id !== undefined ? Number(cliente.id) : undefined;

        let dataConvertida = dataNascimento;
        if (dataNascimento && dataNascimento.includes('/')) {
            dataConvertida = converterDataBRParaISO(dataNascimento);
        }

        const pet = { nome, especie, dataNascimento: dataConvertida, raca } as any;

        try {
            const novoPet = await this.service.inserir(pet, clienteId);
            res.status(201).json(novoPet);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };

    listar = async (_req: Request, res: Response): Promise<void> => {
        const pets = await this.service.listar();
        res.json(pets);
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const pet = await this.service.buscarPorId(id);
            res.json(pet);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };

    atualizar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;
        let pet = req.body;

        if (pet.dataNascimento && pet.dataNascimento.includes('/')) {
            pet = { ...pet, dataNascimento: converterDataBRParaISO(pet.dataNascimento) };
        }

        try {
            const atualizado = await this.service.atualizar(id, pet);
            res.json(atualizado);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };

    deletar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const pet = await this.service.deletar(id);
            res.json(pet);
        } catch (err: any) {
            res.status(err.id).json({ error: err.msg });
        }
    };
}