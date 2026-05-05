import { Router } from 'express';
import { UsuarioController } from '../controller/usuario-controller';

export const usuarioRotas = (controller: UsuarioController): Router => {
    const router = Router();

    router.post('/', controller.inserir);
    router.get('/', controller.listar);
    return router;
};