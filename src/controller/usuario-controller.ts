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
        const status = err && err.id ? err.id : 500;
        const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
        res.status(status).json({ error: message });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await this.service.listar();
      res.json(usuarios);
    } catch (err:any) {
      const status = err && err.id ? err.id : 500;
      const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
      res.status(status).json({ error: message });
    }
  };
}