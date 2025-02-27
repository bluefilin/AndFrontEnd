import { useEffect, useState } from "react";
import "./ChallengesLaunched.css";
import { RetosInnovaServices } from "../../services/reto.services";
import { PageListRetoLaunch } from "../../components/PageListRetoLaunch/PageListRetoLaunch"

const ChallengesLaunched = () => {
  const [retosList, setRetosList] = useState([]);
  const [arrayIds, setArrayIds] = useState([]);
  const [filteredRetos, setFilteredRetos] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const listadoTodasRetos = async () => {
      const list = await RetosInnovaServices(22);

      setRetosList(list);
      setFilteredRetos(list);
      setArrayIds(list.map((retos) => retos._id));
    };

    listadoTodasRetos();

  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setFilter(searchTerm);

    const filteredList = retosList.filter((retos) =>
      retos.titulo.toLowerCase().includes(searchTerm)
    );

    setFilteredRetos(filteredList);
  };

  return (
    <div className="ChallengesLaunched">
      <h2>Retos Lanzados</h2>
      <p>Lánzate a crear una solución y gana recompensas por tu participación</p>
      <div className="Buscador">
        <input
          id="retos"
          type="search"
          placeholder="Busca por nombre del reto o palabra clave..."
          autoComplete="off"
          onChange={handleSearch}
          value={filter}
        />
      </div>

      <PageListRetoLaunch retosList={filteredRetos} showChallengedInfo={true} />
    </div>
  );
};

export default ChallengesLaunched;
