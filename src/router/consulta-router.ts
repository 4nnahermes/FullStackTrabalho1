import { Router } from "express";
import { ConsultaController } from "../controller/consulta-controller";

export const consultaRotas = (controller: ConsultaController): Router => {
    const router = Router();

    router.post('/', controller.inserir);
    router.get('/', controller.listar);
    router.get('/:id', controller.buscarPorId);
    router.patch('/:id', controller.atualizar);
    router.delete('/:id', controller.deletar);

    return router;
}