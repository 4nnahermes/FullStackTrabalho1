import express, { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Cliente } from './entity/cliente';
import { Consulta } from './entity/consulta';
import { ConsultaService } from './service/consulta-service';
import { ConsultaController } from './controller/consulta-controller';
import { ClienteService } from './service/cliente-service';
import { ClienteController } from './controller/cliente-controller';
import { Especialidade } from './entity/especialidade';
import { EspecialidadeService } from './service/especialidade-service';
import { EspecialidadeController } from './controller/especialidade-controller';
import { PetController } from './controller/pet-controller';
import { PetService } from './service/pet-service';
import { Pet } from './entity/pet';
import { Veterinario } from './entity/veterinario';
import { VeterinarioService } from './service/veterinario-service';
import { VeterinarioController } from './controller/veterinario-controller';
import { clienteRotas } from './router/cliente-router';
import { petRotas } from './router/pet-router';
import { especialidadeRotas } from './router/especialidade-router';
import { veterinarioRotas } from './router/veterinario-router';
import { consultaRotas } from './router/consulta-router';

const app = express();
const port = 3000;
app.use(express.json());

AppDataSource.initialize().then(async => {

    app.get('/hello', (req: Request, res: Response) => {
        res.json({ message: 'Hello, World!' });
    });

    const clienteRepository = AppDataSource.getRepository(Cliente);
    const clienteService = new ClienteService(clienteRepository);
    const clienteController = new ClienteController(clienteService);

    const petRepository = AppDataSource.getRepository(Pet);
    const petService = new PetService(petRepository, clienteRepository);
    const petController = new PetController(petService);

    const especialidadeRepository = AppDataSource.getRepository(Especialidade);
    const especialidadeService = new EspecialidadeService(especialidadeRepository);
    const especialidadeController = new EspecialidadeController(especialidadeService);

    const veterinarioRepository = AppDataSource.getRepository(Veterinario);
    const veterinarioService = new VeterinarioService(veterinarioRepository, especialidadeRepository);
    const veterinarioController = new VeterinarioController(veterinarioService);

    const consultaRepository = AppDataSource.getRepository(Consulta);
    const consultaService = new ConsultaService(consultaRepository, petRepository, veterinarioRepository);
    const consultaController = new ConsultaController(consultaService);

    app.use('/api/clientes', clienteRotas(clienteController));
    app.use('/api/pets', petRotas(petController));
    app.use('/api/especialidades', especialidadeRotas(especialidadeController));
    app.use('/api/veterinarios', veterinarioRotas(veterinarioController));
    app.use('/api/consultas', consultaRotas(consultaController));

    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
});