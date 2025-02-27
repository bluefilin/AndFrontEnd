import { useEffect, useRef, useState } from "react";
import { dataDecrypt } from "../../util/encrypt";
import "./IdeaUsersList.css";
import { IdeasInnovaServices } from "../../services/idea.services";
import { PageList } from "../../components/PageList/PageList";
import { DateRange } from "react-date-range";
import { getFocos } from "../../services/focos.services";
import { getTiposInnovacion } from "../../services/tiposInnovacion.services";
import { getStates } from "../../services/estados.services";

const IdeaUsersList = () => {
  const [ideasList, setIdeasList] = useState([]);
  const [arrayIds, setArrayIds] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [estados, setEstados] = useState([]);
  const [focos, setFocos] = useState([]);
  const [tiposInnovacion, setTiposInnovacion] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [filter, setFilter] = useState("");
  const [calendar, setCalendar] = useState(false)
  const calendarRef = useRef(null);
  useEffect(() => {
    const listadoTodasIdeas = async () => {
      const user = dataDecrypt(sessionStorage.getItem("user"));
      const list = await IdeasInnovaServices();
      const getEstados = async () => {
        const estados = await getStates("idea");
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
      setIdeasList(list);
      setFilteredIdeas(list);
      setArrayIds(list.map((ideas) => (ideas._id)))
    };
    listadoTodasIdeas();

  }, []);
  sessionStorage.setItem("idsArray", JSON.stringify(arrayIds))
  const handleFilter = (e) => {
    const search = e.target.value.toLowerCase();
    setFilter(search);
  };
  useEffect(() => {
    const filteredIdeas = ideasList.filter((idea) => {
      const lowerFilter = filter.toLowerCase();
      return (
        idea?.autor?.nombres?.toLowerCase().includes(lowerFilter) ||
        idea?.autor?.apellidos?.toLowerCase().includes(lowerFilter) ||
        idea?.titulo?.toLowerCase().includes(lowerFilter) ||
        idea?.estado?.nombre?.toLowerCase().includes(lowerFilter)
      );
    });
    setFilteredIdeas(filteredIdeas);
  }, [filter, ideasList]);

  const filterIdeasEstado = (event) => {
    let criterio = event.target.value;
    if (criterio != "todos") {
      const ideasFiltered = ideasList.filter((idea) => idea.estado?.nombre == criterio);
      setFilteredIdeas(ideasFiltered);
    } else {
      setFilteredIdeas(ideasList);
    }
  }
  const filterIdeasFoco = (event) => {
    let criterio = event.target.value;
    if (criterio != "todos") {
      const ideasFiltered = ideasList.filter((idea) => idea.foco?.nombre == criterio);
      setFilteredIdeas(ideasFiltered);
    } else {
      setFilteredIdeas(ideasList);
    }
  }
  const filterIdeasTipoInnovacion = (event) => {
    let criterio = event.target.value;
    if (criterio != "todos") {
      const ideasFiltered = ideasList.filter((idea) => idea.tipo_innovacion?.nombre == criterio);
      setFilteredIdeas(ideasFiltered);
    } else {
      setFilteredIdeas(ideasList);
    }
  }
  const toggleFilter = () => {
    setFilterOpen(!filterOpen)
  }
  const handleDateSelect = (date) => {

    let filterDate = ideasList.filter((idea) => {
      let ideaDate = new Date(idea?.createdAt)
      return (
        ideaDate >= (new Date(date.selection.startDate.getTime() - (24 * 60 * 60 * 1000)).setHours(23, 59, 59)) &&
        ideaDate <= new Date(date.selection.endDate.setHours(23, 59, 59, 999))
      )
    })
    setStartDate(date.selection.startDate)
    setEndDate(date.selection.endDate)
    setFilteredIdeas(filterDate)
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
    <div className="idealist">
      <h2>Ideas de usuarios</h2>
      <form>
        <div className="filterView">
          <input
            type="search"
            placeholder='Busca por nombre, idea, estado...'
            onChange={handleFilter}
          />
          <span onClick={toggleFilter}>Ver más filtros</span>
        </div>
        <div className="filterOption" style={{ height: filterOpen ? "30px" : "0" }}>
          <select name="" id="" onChange={filterIdeasEstado}>
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
          <select name="" id="" onChange={filterIdeasTipoInnovacion}>
            <option value="">Tipo de Innovación</option>
            <option value="todos">Todos</option>
            {tiposInnovacion.map((tipoInnoovacion) => (
              <option key={tipoInnoovacion._id} value={tipoInnoovacion.nombre}>
                {tipoInnoovacion.nombre}
              </option>
            ))}
          </select>
          <select name="" id="" onChange={filterIdeasFoco}>
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
      <PageList
        ideasList={filteredIdeas}
      />
    </div>
  );
};

export { IdeaUsersList };
