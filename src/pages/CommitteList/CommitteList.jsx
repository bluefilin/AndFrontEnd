import { useEffect, useRef, useState } from "react";
import './CommitteList.css';
import { DateRange } from "react-date-range";
import { getCommitteeList } from '../../services/committee.services';
import { PageListCommittee } from '../../components/CommitteeComponents/PageListCommittee';
import { getStates } from '../../services/estados.services';

const CommitteList = ({ }) => {
	const [committes, setCommittes] = useState([])
	const [filter, setFilter] = useState("");
	const [filterOpen, setFilterOpen] = useState(false);
	const [filterCommittes, setFilterCommittes] = useState([]);
	const [estados, setEstados] = useState([]);
	const calendarRef = useRef(null);
	const [calendar, setCalendar] = useState(false)
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date())
	  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection'
  }
	useEffect(() => {
		const getCommittes = async () => {
			let committesList = await getCommitteeList();
			setCommittes(committesList);
		}
		const getEstados = async () => {
			const estados = await getStates("comite");
			setEstados(estados);
		  }
		getCommittes();
		getEstados();
		

	}, [])
	const handleFilter = (e) => {
		const search = e.target.value.toLowerCase();
		setFilter(search);
	  };
	  useEffect(() => {
		const filteredCommittee = committes.filter((comite) => {
		  const lowerFilter = filter.toLowerCase();
		  return (
			comite?.tipo?.toLowerCase().includes(lowerFilter) ||
			comite?.confidencialidad?.toLowerCase().includes(lowerFilter) ||
			comite?.fechaInicio?.toLowerCase().includes(lowerFilter) 
		  );
		});
		setFilterCommittes(filteredCommittee);
	  }, [filter, committes]);
	  const toggleFilter = () => {
		setFilterOpen(!filterOpen)
	  }
	  const filterComittesEstado = (event) => {
		let criterio = event.target.value;
		if (criterio != "todos") {
			const comittesFiltered = committes.filter((committe) => committe.estado?.nombre == criterio);
			console.log(comittesFiltered);
			setFilterCommittes(comittesFiltered);
		  } else {
			setFilterCommittes(committes);
			
		  }
		}
		const toogleDateRange = () => {
			setCalendar(!calendar)
		  }
		  const handleDateSelect = (date) => {

			let filterDate = committes.filter((comite) => {
			  let retoDate = new Date(comite?.fechaInicio)
			  return (
				retoDate >= (new Date(date.selection.startDate.getTime() - (24 * 60 * 60 * 1000)).setHours(23, 59, 59)) &&
				retoDate <= new Date(date.selection.endDate.setHours(23, 59, 59, 999))
			  )
			})
			setStartDate(date.selection.startDate)
			setEndDate(date.selection.endDate)
			setFilterCommittes(filterDate)
		  }
		  const filterComittesTipo = (event) => {
			const tipoSeleccionado = event.target.value;
			if (tipoSeleccionado !== "todos") {
			  const comittesFiltered = committes.filter((committe) => committe.tipo === tipoSeleccionado);
			  setFilterCommittes(comittesFiltered);
			} else {
			  setFilterCommittes(committes);
			}
		  };
		  
	return (
	<div className='committeeList'>
		<h2>Comités</h2>
		<p className='committeeParagraph'>Revisa la información entre los diferentes tipos de comité </p>
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

			<select name="" id="" onChange={filterComittesEstado}>
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
		  <select name="" id="" onChange={filterComittesTipo}>
  <option value="">Tipo de comité</option>
  <option value="todos">Todos</option>
  {/* Render options based on unique committee types */}
  {Array.from(new Set(committes.map(committe => committe.tipo))).map((tipo, index) => (
    <option key={index} value={tipo}>
      {tipo}
    </option>
  ))}
</select>
			</div>
		</form>
		<PageListCommittee
			committeeList={filterCommittes}
		/>

	</div>
	);
};

export default CommitteList;