import { Router } from "express";
import { PetController } from "../controller/pet-controller";

export const petRotas = (controller: PetController): Router => {
    const router = Router();

    router.post('/', controller.inserir);
    router.get('/', controller.listar);
    router.get('/:id', controller.buscarPorId);
    router.put('/:id', controller.atualizar);
    router.delete('/:id', controller.deletar);

    return router;
}