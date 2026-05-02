import { Router } from "express";
import { VeterinarioController } from "../controller/veterinario-controller";

export const veterinarioRotas = (controller: VeterinarioController): Router => {
    const router = Router();

    router.post('/', controller.inserir);
    router.get('/', controller.listar);
    router.get('/:id', controller.buscarPorId);
    router.put('/:id', controller.atualizar);
    router.delete('/:id', controller.deletar);

    return router;
}