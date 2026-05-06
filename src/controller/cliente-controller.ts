
import { Request, Response } from "express";
import { ClienteService } from "../service/cliente-service";
import { converterDataISOParaBR } from "../utils/dateHelper";

export class ClienteController {
    private service: ClienteService;

    constructor(service: ClienteService) {
        this.service = service;
    }

    inserir = async (req: Request, res: Response): Promise<void> => {
        const cliente = req.body;

        try {
            const novoCliente = await this.service.inserir(cliente);
            res.status(201).json(this.formatarDatasCliente(novoCliente));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    }

    listar = async (_req: Request, res: Response): Promise<void> => {
        try {
            const clientes = await this.service.listar();
            res.json(clientes.map(cliente => this.formatarDatasCliente(cliente)));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    }

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            const cliente = await this.service.buscarPorId(id);
            res.json(this.formatarDatasCliente(cliente));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    }

     atualizar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;
        const cliente = req.body;

        try {
            res.json(this.formatarDatasCliente(await this.service.atualizar(id, cliente)));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    }

    deletar = async (req: Request, res: Response): Promise<void> => {
        const id = +req.params.id;

        try {
            res.json(this.formatarDatasCliente(await this.service.deletar(id)));
        } catch (err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    }

    private formatarDatasCliente(cliente: any): any {
        if (!cliente) {
            return cliente;
        }

        const pets = Array.isArray(cliente.pets)
            ? cliente.pets.map((pet: any) => {
                let dataNascimento = pet.dataNascimento as any;

                if (dataNascimento instanceof Date) {
                    dataNascimento = dataNascimento.toISOString().split('T')[0];
                }

                if (typeof dataNascimento === 'string' && dataNascimento.includes('-')) {
                    dataNascimento = converterDataISOParaBR(dataNascimento);
                }

                return {
                    ...pet,
                    dataNascimento
                };
            })
            : cliente.pets;

        return {
            ...cliente,
            pets
        };
    }
}
