import { useState, useEffect } from 'react';
import './PageList.css';
import fox from "../../assets/img/defaultPhoto.jpg";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { getUserAvatarUrl } from '../../services/users.services';
const PageList = ({ ideasList }) => {
	const itemsPerPage = 10; // Número de elementos por página
	const [currentPage, setCurrentPage] = useState(1);
	const [avatarUrls, setAvatarUrls] = useState([]);
	const totalPages = Math.ceil(ideasList.length / itemsPerPage);
	const next = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};
	const prev = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = Math.min(startIndex + itemsPerPage, ideasList.length);

	useEffect(() => {

		const loadAvatarUrls = async () => {
		  const urls = await Promise.all(ideasList.slice(startIndex, endIndex).map(async (idea) => {
			if (idea.autor.foto !== "" && idea.autor.foto !== undefined) {
			  return await getUserAvatarUrl(idea.autor.foto);
			} else {
			  return null; 
			}
		  }));
		  setAvatarUrls(urls);
		};
		loadAvatarUrls();
	  }, [ideasList, startIndex, endIndex]);

	const visibleIdeas = ideasList.slice(startIndex, endIndex);

	return (
		<>
			<p>
				{startIndex + 1} - {endIndex} de {ideasList.length}
				<span
					onClick={prev}
					className={currentPage > 1 ? "prevNext" : "prevNextDisable"}
				>
					&lt;
				</span>
				<span
					onClick={next}
					className={currentPage < totalPages ? "prevNext" : "prevNextDisable"}
				>
					&gt;
				</span>
			</p>
			<div className='elementsList'>
				{visibleIdeas.map((idea, index) => (
					<Link
						to={`/idea/${idea._id}`}
						key={index}
					>
						<div className='ideaChallengeBox' >
						<div>
                		{avatarUrls[index] !== null ? (
                  		<img src={avatarUrls[index]} alt="" />
                		) : (
                  		<img src={fox} alt="" />
              			  )}
              				</div>
							<div>
								<h3>{idea?.titulo}</h3>
								<p><b>Autor: </b>{idea?.autor.nombres} {idea?.autor.apellidos}</p>
								<p><b>Estado: </b>{idea?.estado.nombre}</p>
							</div>
							<div>
								<span>Ajustes (1)</span>
								<p><b>Fecha de creación: </b>{format(new Date(idea?.createdAt), 'dd/MMM/yy', { locale: es })}</p>
							</div>
						</div>
					</Link>
				))}
			</div>

		</>
	);
};

export { PageList };