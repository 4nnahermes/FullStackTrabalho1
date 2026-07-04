import { useEffect, useState } from "react";
import { Link } from "react-router";
import PetApiService from "../../service/PetApiService";

export default function ListaPets() {
  const [listaPets, setListaPets] = useState([]);

  useEffect(() => {
    carregarPets();
  }, [])

  function carregarPets() {
    PetApiService.listar().then(
      pets => setListaPets(pets)
    )
  }

  function excluirPet(id: number) {
    if (confirm("Tem certeza que deseja excluir este pet?")) {
      PetApiService.deletar(id).then(() => {
        alert("Pet excluído com sucesso!");
        carregarPets();
      });
    }
  }

  return (
    <div className="pagina">
      <div className="cabecalho-pagina">
        <div>
          <h1>Pets</h1>
          <p>Gerencie os pets cadastrados na clínica.</p>
        </div>

        <Link to="/pets/novo" className="w3-button botao-principal">
          + Novo Pet
        </Link>
      </div>

      <div className="card-conteudo">
        {listaPets.length === 0 && (
          <p>Nenhum pet cadastrado.</p>
        )}

        {listaPets.length > 0 && (
          <table className="w3-table w3-hoverable tabela-sistema">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Espécie</th>
                <th>Raça</th>
                <th>Data de nascimento</th>
                <th>Cliente</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {listaPets.map((pet: any) => (
                <tr key={pet.id}>
                  <td>{pet.nome}</td>
                  <td>{pet.especie}</td>
                  <td>{pet.raca}</td>
                  <td>{pet.dataNascimento}</td>
                  <td>{pet.cliente?.nome}</td>
                  <td>
                    <div className="acoes-tabela">
                      <Link
                        to={"/pets/editar/" + pet.id}
                        className="w3-button w3-text-blue"
                      >
                        <i className="fa fa-pencil"></i>
                      </Link>

                      <button
                        className="w3-button w3-text-red"
                        onClick={() => excluirPet(pet.id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}