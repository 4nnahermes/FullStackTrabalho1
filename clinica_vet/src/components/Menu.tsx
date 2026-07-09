import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

export default function Menu() {
  const classMenuMobile =
    "w3-bar-block menu-verde w3-hide w3-hide-large w3-hide-medium";

  const [selecionado, setSelecionado] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);


  function onClickMenu() {
    setSelecionado(prev => !prev);
  }

  function fecharMenuMobile() {
    setSelecionado(false);
  }

  function sair() {
    fecharMenuMobile();
    logout();
    navigate("/login");
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

        <button
          className="w3-bar-item w3-button w3-right"
          onClick={sair}
        >
          Sair
        </button>
      </nav>

      <nav
        className={classMenuMobile + (selecionado ? " w3-show" : "")}
      >
        <Link to="/" className="w3-bar-item w3-button" onClick={fecharMenuMobile}>
          Home
        </Link>

        <Link to="/clientes" className="w3-bar-item w3-button" onClick={fecharMenuMobile}>
          Clientes
        </Link>

        <Link to="/pets" className="w3-bar-item w3-button" onClick={fecharMenuMobile}>
          Pets
        </Link>

        <Link to="/veterinarios" className="w3-bar-item w3-button" onClick={fecharMenuMobile}>
          Veterinários
        </Link>

        <Link to="/especialidades" className="w3-bar-item w3-button" onClick={fecharMenuMobile}>
          Especialidades
        </Link>

        <Link to="/consultas" className="w3-bar-item w3-button" onClick={fecharMenuMobile}>
          Consultas
        </Link>

        <button
          className="w3-bar-item w3-button w3-right"
          onClick={sair}
        >
          Sair
        </button>
      </nav>
    </div>
  );
}