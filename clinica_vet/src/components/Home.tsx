import { Link } from "react-router";
import "./Home.css";

import clientes from "../assets/clientes.png";
import pets from "../assets/pets.png";
import vets from "../assets/vets.png";
import fundo from "../assets/fundo.png";
import especialidades from "../assets/especialidades.png";
import consultas from "../assets/consultas.png";

export default function Home() {
  return (
    <div className="home">
      <section className="home-apresentacao">
        <div className="home-texto">
          <h1>Cadastro Clínico Veterinário</h1>

          <p>
            Gerencie sua clínica de forma simples e organizada.
          </p>
        </div>

        <div className="home-imagem">
          <img src={fundo} alt="Ilustração veterinária" />
        </div>
      </section>

      <section className="home-opcoes">

        <div className="home-opcao">
          <Link to="/clientes" className="home-link">
            <div className="home-card">
              <div className="home-card-imagem">
                <img src={clientes} alt="Clientes" />
              </div>

              <div className="home-card-texto">
                <h2>Clientes</h2>
                <p>Gerencie os clientes da clínica.</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="home-opcao">
          <Link to="/pets" className="home-link">
            <div className="home-card">
              <div className="home-card-imagem">
                <img src={pets} alt="Pets" />
              </div>

              <div className="home-card-texto">
                <h2>Pets</h2>
                <p>Gerencie os pets cadastrados.</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="home-opcao">
          <Link to="/veterinarios" className="home-link">
            <div className="home-card">
              <div className="home-card-imagem">
                <img src={vets} alt="Veterinários" />
              </div>

              <div className="home-card-texto">
                <h2>Veterinários</h2>
                <p>Gerencie os veterinários da clínica.</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="home-opcao">
          <Link to="/especialidades" className="home-link">
            <div className="home-card">
              <div className="home-card-imagem">
                <img src={especialidades} alt="Especialidades" />
              </div>

              <div className="home-card-texto">
                <h2>Especialidades</h2>
                <p>Gerencie as especialidades cadastradas.</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="home-opcao">
          <Link to="/consultas" className="home-link">
            <div className="home-card">
              <div className="home-card-imagem">
                <img src={consultas} alt="Consultas" />
              </div>

              <div className="home-card-texto">
                <h2>Consultas</h2>
                <p>Gerencie os agendamentos da clínica.</p>
              </div>
            </div>
          </Link>
        </div>

      </section>
    </div>
  );
}