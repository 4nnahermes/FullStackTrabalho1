import { Request, Response } from "express";
import { PetService } from "../service/pet-service";
import { converterDataBRParaISO, converterDataISOParaBR } from "../utils/dateHelper";

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
            res.status(201).json(this.formatarDatasPet(novoPet));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : 'Internal server error');
            res.status(status).json({ error: message });
        }
    };

    listar = async (_req: Request, res: Response): Promise<void> => {
        const pets = await this.service.listar();
        res.json(pets.map(p => this.formatarDatasPet(p)));
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const pet = await this.service.buscarPorId(id);
            res.json(this.formatarDatasPet(pet));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : 'Internal server error');
            res.status(status).json({ error: message });
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
            res.json(this.formatarDatasPet(atualizado));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : 'Internal server error');
            res.status(status).json({ error: message });
        }
    };

    deletar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const pet = await this.service.deletar(id);
            res.json(this.formatarDatasPet(pet));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : 'Internal server error');
            res.status(status).json({ error: message });
        }
    };

    private formatarDatasPet(pet: any): any {
        if (!pet) {
            return pet;
        }

        let data = pet.dataNascimento as any;

        if (data instanceof Date) {
            data = data.toISOString().split('T')[0];
        }

        if (typeof data === 'string' && data.includes('-')) {
            data = converterDataISOParaBR(data);
        }

        const consultas = Array.isArray(pet.consultas)
            ? pet.consultas.map((consulta: any) => {
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
            : pet.consultas;

        return {
            ...pet,
            dataNascimento: data,
            consultas
        };
    }
}