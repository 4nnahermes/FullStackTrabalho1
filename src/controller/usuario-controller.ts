import { Request, Response } from "express";
import { UsuarioService } from "../service/usuario-service";

export class UsuarioController {
  private service: UsuarioService;

  constructor(service: UsuarioService) {
    this.service = service;
  }

  inserir = async (req: Request, res: Response): Promise<void> => {
    const { email, senha } = req.body;
    try{ 
        const novoUsuario = await this.service.inserir({ email, senha });
        res.status(201).json(novoUsuario);
    }
    catch(err:any) {
        res.status(err.id).json({ error: err.msg });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    const usuarios = await this.service.listar();
    res.json(usuarios);
  };
}