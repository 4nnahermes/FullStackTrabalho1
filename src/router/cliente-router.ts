import { Router } from "express";
import { ClienteController } from "../controller/cliente-controller";

export const clienteRotas = (controller: ClienteController): Router => {
    const router = Router();

    router.post('/', controller.inserir);
    router.get('/', controller.listar);
    router.get('/:id', controller.buscarPorId);
    router.patch('/:id', controller.atualizar);
    router.delete('/:id', controller.deletar);

    return router;
}