import { useState } from "react";
import { Link } from "react-router";

export default function Menu() {
  const classMenuMobile =
    "w3-bar-block menu-verde w3-hide w3-hide-large w3-hide-medium";

  const [selecionado, setSelecionado] = useState(false);

  function onClickMenu() {
    setSelecionado(!selecionado);
  }

  return (
    <div className="w3-top">
      <nav className="w3-bar menu-verde">

        <a
          className="w3-bar-item w3-button w3-hide-large w3-hide-medium"
          onClick={onClickMenu}
        >
          &#9776;
        </a>

        <Link to="/" className="w3-bar-item w3-button">
          <i className="fa fa-home"></i>
        </Link>

        <Link to="/clientes" className="w3-bar-item w3-button w3-hide-small">
          Clientes
        </Link>

        <Link to="/pets" className="w3-bar-item w3-button w3-hide-small">
          Pets
        </Link>

        <Link to="/veterinarios" className="w3-bar-item w3-button w3-hide-small">
          Veterinários
        </Link>

        <Link to="/especialidades" className="w3-bar-item w3-button w3-hide-small">
          Especialidades
        </Link>

        <Link to="/consultas" className="w3-bar-item w3-button w3-hide-small">
          Consultas
        </Link>
      </nav>

      <nav
        className={classMenuMobile + (selecionado ? " w3-show" : "")}
      >
        <Link to="/" className="w3-bar-item w3-button">
          Home
        </Link>

        <Link to="/clientes" className="w3-bar-item w3-button">
          Clientes
        </Link>

        <Link to="/pets" className="w3-bar-item w3-button">
          Pets
        </Link>

        <Link to="/veterinarios" className="w3-bar-item w3-button">
          Veterinários
        </Link>

        <Link to="/especialidades" className="w3-bar-item w3-button">
          Especialidades
        </Link>

        <Link to="/consultas" className="w3-bar-item w3-button">
          Consultas
        </Link>
      </nav>
    </div>
  );
}