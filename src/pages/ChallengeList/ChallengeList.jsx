import { useEffect, useState, useRef } from "react";
import './ChallengeList.css';
import { getRetosById } from "../../services/reto.services";
import { dataDecrypt } from "../../util/encrypt";
import { PageListReto } from "../../components/PageListReto/PageListReto";
import { getStates } from "../../services/estados.services";
import { getFocos } from "../../services/focos.services";
import { getTiposInnovacion } from "../../services/tiposInnovacion.services";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const ChallengeList = () => {
  const [misRetos, setMisRetos] = useState([]);
  const [arrayIds, setArrayIds] = useState([]);
  const [estados, setEstados] = useState([]);
  const [focos, setFocos] = useState([]);
  const [tiposInnovacion, setTiposInnovacion] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredRetos, setFilteredRetos] = useState([]);
  const [retosFiltradas, setretosFiltradas] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false)
  const [calendar, setCalendar] = useState(false)
  const calendarRef = useRef(null);
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection'
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const getRetosId = async () => {
      const user = dataDecrypt(sessionStorage.getItem("user"));
      const retos = await getRetosById(user.id);
      setMisRetos(retos);
      setretosFiltradas(retos);
      setArrayIds(retos.map((retos) => (retos._id)))
    };
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

    getRetosId();
    getEstados();
    getFocus();
    getTipoInnovacion();
  }, []);

  
  useEffect(() => {
    sessionStorage.setItem("idsArray", JSON.stringify(arrayIds));
  }, [arrayIds]);

  useEffect(() => {
    const filteredRetos = misRetos.filter((reto) => {
      const lowerFilter = filter.toLowerCase();
      return (
        reto?.autor?.nombres?.toLowerCase().includes(lowerFilter) ||
        reto?.autor?.apellidos?.toLowerCase().includes(lowerFilter) ||
        reto?.titulo?.toLowerCase().includes(lowerFilter) ||
        reto?.estado?.nombre?.toLowerCase().includes(lowerFilter)
      );
    });
    setFilteredRetos(filteredRetos);
  }, [filter, misRetos]);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen)
  }

  const filterRetosEstado = (event) => {
    let criterio = event.target.value;
    if (criterio != "todos") {
      const retosFiltered = misRetos.filter((reto) => reto.estado?.nombre == criterio);
      setFilteredRetos(retosFiltered);
    } else {
      setFilteredRetos(misRetos);
    }
  }

  const handleFilter = (e) => {
    const search = e.target.value.toLowerCase();
    setFilter(search);
  };

  const filterRetosFoco = (event) => {
    let criterio = event.target.value;
    if (criterio != "todos") {
      const retosFiltered = misRetos.filter((reto) => reto.foco?.nombre == criterio);
      setFilteredRetos(retosFiltered);
    } else {
      setFilteredRetos(misRetos);
    }
  }

  const filterRetosTipoInnovacion = (event) => {
    let criterio = event.target.value;
    if (criterio != "todos") {
      const retosFiltered = misRetos.filter((reto) => reto.tipo_innovacion?.nombre == criterio);
      setFilteredRetos(retosFiltered);
    } else {
      setFilteredRetos(misRetos);
    }
  }
  
  const handleDateSelect = (date) => {
    let filterDate = misRetos.filter((reto) => {
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
 
  const toogleDateRange = () => {
    setCalendar(!calendar)
  }
  return (
    <div className="retolist">
      <h2>Mis retos</h2>

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
          <select name="" id="" onChange={filterRetosEstado}>
            <option value="">Estados</option>
            <option value="todos">Todos</option>
            {estados.map((estado) => (
              <option key={estado._id} value={estado.nombre}>
                {estado.nombre}
              </option>
            ))}
          </select>
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

export default ChallengeList;

