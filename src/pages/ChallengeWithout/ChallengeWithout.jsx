import { useEffect, useRef, useState } from "react";
import { dataDecrypt } from "../../util/encrypt";
import "./ChallengeWithout.css";
import { RetosInnovaServices } from "../../services/reto.services";
import { PageListReto } from "../../components/PageListReto/PageListReto"
import { DateRange } from "react-date-range";
import { getFocos } from "../../services/focos.services";
import { getTiposInnovacion } from "../../services/tiposInnovacion.services";
import { getStates } from "../../services/estados.services";

const ChallengeWithout = () => {
  const [retosList, setRetosList] = useState([]);
  const [arrayIds, setArrayIds] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false)
  const [estados, setEstados] = useState([]);
  const [focos, setFocos] = useState([]);
  const [tiposInnovacion, setTiposInnovacion] = useState([]);
  const [filteredRetos, setFilteredRetos] = useState([]);
  const [filter, setFilter] = useState("");
  const [calendar, setCalendar] = useState(false)
  const calendarRef = useRef(null);
  useEffect(() => {
    const listadoTodasRetos = async () => {
      const user = dataDecrypt(sessionStorage.getItem("user"));
      const list = await RetosInnovaServices(23);
      const getEstados = async () => {
        const estados = await getStates("reto");
        setEstados(estados);
      }
      const getFocus = async () => {
        const focos = await getFocos();
        setFocos(focos);
      }
      const getTipoInnovacion = async () => {
        const tiposInnovacion = await getTiposInnovacion();
        setTiposInnovacion(tiposInnovacion);
      }

      getEstados();
      getFocus();
      getTipoInnovacion();
      setRetosList(list);
      setFilteredRetos(list);
      setArrayIds(list.map((retos) => (retos._id)))
    };
    listadoTodasRetos();

  }, []);
  sessionStorage.setItem("idsArray", JSON.stringify(arrayIds))
  const handleFilter = (e) => {
    const search = e.target.value.toLowerCase();
    setFilter(search);
  };
  
  useEffect(() => {
    const filteredRetos = retosList.filter((reto) => {
      const lowerFilter = filter.toLowerCase();
      return (
        reto?.autor?.nombres?.toLowerCase().includes(lowerFilter) ||
        reto?.autor?.apellidos?.toLowerCase().includes(lowerFilter) ||
        reto?.titulo?.toLowerCase().includes(lowerFilter) ||
        reto?.estado?.nombre?.toLowerCase().includes(lowerFilter)
      );
    });
    setFilteredRetos(filteredRetos);
  }, [filter, retosList]);

  const filterRetosFoco = (event) => {
    let criterio = event.target.value;
    if (criterio != "todos") {
      const retosFiltered = retosList.filter((reto) => reto.foco?.nombre == criterio);
      setFilteredRetos(retosFiltered);
    } else {
      setFilteredRetos(retosList);
    }
  }
  const filterRetosTipoInnovacion = (event) => {
    let criterio = event.target.value;
    if (criterio != "todos") {
      const retosFiltered = retosList.filter((reto) => reto.tipo_innovacion?.nombre == criterio);
      setFilteredRetos(retosFiltered);
    } else {
      setFilteredRetos(retosList);
    }
  }
  const toggleFilter = () => {
    setFilterOpen(!filterOpen)
  }
  const handleDateSelect = (date) => {

    let filterDate = retosList.filter((reto) => {
      let retoDate = new Date(reto?.createdAt)
      return (
        retoDate >= (new Date(date.selection.startDate.getTime() - (24 * 60 * 60 * 1000)).setHours(23, 59, 59)) &&
        retoDate <= new Date(date.selection.endDate.setHours(23, 59, 59, 999))
      )
    })
    setStartDate(date.selection.startDate)
    setEndDate(date.selection.endDate)
    setFilteredRetos(filterDate)
  }
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection'
  }
  const toogleDateRange = () => {
    setCalendar(!calendar)
  }
  return (
    <div className="retolist">
      <h2>Retos de usuarios</h2>
      <form>
        <div className="filterView">
          <input
            type="search"
            placeholder='Busca por nombre, reto, estado...'
            onChange={handleFilter}
          />
          <span onClick={toggleFilter}>Ver más filtros</span>
        </div>
        <div className="filterOption" style={{ height: filterOpen ? "30px" : "0" }}>
          <div className="dateRange" ref={calendarRef}>
            <p onClick={toogleDateRange}><span>Rango de fecha</span> <span>&lt;</span></p>
            <DateRange
              ranges={[selectionRange]}
              onChange={handleDateSelect}
              editableDateInputs={true}
              moveRangeOnFirstSelection={false}
              months={2}
              direction="horizontal"
              className={calendar ? "calendarElement" : "calendarHide"}
            />
          </div>
          <select name="" id="" onChange={filterRetosTipoInnovacion}>
            <option value="">Tipo de Innovación</option>
            <option value="todos">Todos</option>
            {tiposInnovacion.map((tipoInnoovacion) => (
              <option key={tipoInnoovacion._id} value={tipoInnoovacion.nombre}>
                {tipoInnoovacion.nombre}
              </option>
            ))}
          </select>
          <select name="" id="" onChange={filterRetosFoco}>
            <option value="">Foco</option>
            <option value="todos">Todos</option>
            {focos.map((foco) => (
              <option key={foco._id} value={foco.nombre}>
                {foco.nombre}
              </option>
            ))}
          </select>
        </div>
      </form>
      <PageListReto
        retosList={filteredRetos}
      />
    </div>
  );
};

export { ChallengeWithout };
