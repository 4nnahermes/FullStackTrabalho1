import express, { Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from '../data-source';

import { Cliente } from './entity/cliente';
import { Pet } from './entity/pet';
import { Veterinario } from './entity/veterinario';
import { Especialidade } from './entity/especialidade';
import { Consulta } from './entity/consulta';
import { Usuario } from './entity/usuario';

import { ClienteService } from './service/cliente-service';
import { PetService } from './service/pet-service';
import { VeterinarioService } from './service/veterinario-service';
import { EspecialidadeService } from './service/especialidade-service';
import { ConsultaService } from './service/consulta-service';
import { UsuarioService } from './service/usuario-service';
import { LoginService } from './service/login-service';

import { ClienteController } from './controller/cliente-controller';
import { PetController } from './controller/pet-controller';
import { VeterinarioController } from './controller/veterinario-controller';
import { EspecialidadeController } from './controller/especialidade-controller';
import { ConsultaController } from './controller/consulta-controller';
import { UsuarioController } from './controller/usuario-controller';
import { LoginController } from './controller/login-controller';

import { clienteRotas } from './router/cliente-router';
import { petRotas } from './router/pet-router';
import { especialidadeRotas } from './router/especialidade-router';
import { veterinarioRotas } from './router/veterinario-router';
import { consultaRotas } from './router/consulta-router';
import { usuarioRotas } from './router/usuario-router';

import { TokenMiddleware } from './middleware/token-middleware';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

AppDataSource.initialize().then(async () => {

    app.get('/hello', (req: Request, res: Response) => {
        res.json({ message: 'Hello, World!' });
    });

    const clienteRepository = AppDataSource.getRepository(Cliente);
    const petRepository = AppDataSource.getRepository(Pet);
    const especialidadeRepository = AppDataSource.getRepository(Especialidade);
    const veterinarioRepository = AppDataSource.getRepository(Veterinario);
    const consultaRepository = AppDataSource.getRepository(Consulta);
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    let clinicaGeral = await especialidadeRepository.findOneBy({
        nome: "Clínica Geral"
    });

    if (!clinicaGeral) {
        clinicaGeral = especialidadeRepository.create({
            nome: "Clínica Geral"
        });

        await especialidadeRepository.save(clinicaGeral);
    }

    const usuarioService = new UsuarioService(usuarioRepository);
    const usuarioController = new UsuarioController(usuarioService);
    app.use('/api/usuarios', usuarioRotas(usuarioController));

    const loginService = new LoginService(usuarioRepository);
    const loginController = new LoginController(loginService);
    app.post('/api/login', loginController.realizaLogin);

    const tokenMiddleware = new TokenMiddleware(loginService);
    app.use(tokenMiddleware.verificarAcesso);

    const clienteService = new ClienteService(clienteRepository, petRepository);
    const clienteController = new ClienteController(clienteService);
    app.use('/api/clientes', clienteRotas(clienteController));

    const petService = new PetService(petRepository, clienteRepository);
    const petController = new PetController(petService);
    app.use('/api/pets', petRotas(petController));

    const especialidadeService = new EspecialidadeService(especialidadeRepository);
    const especialidadeController = new EspecialidadeController(especialidadeService);
    app.use('/api/especialidades', especialidadeRotas(especialidadeController));

    const veterinarioService = new VeterinarioService(veterinarioRepository, especialidadeRepository);
    const veterinarioController = new VeterinarioController(veterinarioService);
    app.use('/api/veterinarios', veterinarioRotas(veterinarioController));

    const consultaService = new ConsultaService(consultaRepository, petRepository, veterinarioRepository);
    const consultaController = new ConsultaController(consultaService);
    app.use('/api/consultas', consultaRotas(consultaController));

    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
});