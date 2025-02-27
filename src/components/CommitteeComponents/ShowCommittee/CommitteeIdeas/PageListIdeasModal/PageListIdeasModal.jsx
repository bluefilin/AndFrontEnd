import { useState, useEffect } from 'react';
import './PageListIdeasModal.css';
import fox from "../../../../../assets/img/defaultPhoto.jpg";
import { getUserAvatarUrl } from '../../../../../services/users.services';

const PageListIdeasModal = ({ ideasList, selectedIdeas, setSelectedIdeas }) => {
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
	console.log(ideasList);

	const toggleCheckbox = (ideaId) => {
		const ideaIds= ideaId._id
		const isSelected = selectedIdeas.includes(ideaIds);
		if (isSelected) {
		  setSelectedIdeas(selectedIdeas.filter((id) => id !== ideaIds));
		} else {
		  setSelectedIdeas([...selectedIdeas, ideaIds]);
		}
	  };
	  console.log(selectedIdeas);

	return (
		<>
			<p>
				{startIndex + 1} - {endIndex} de {ideasList.length}
				<span
					onClick={prev}
					className={currentPage > 1 ? "prevNextI" : "prevNextDisableI"}
				>
					&lt;
				</span>
				<span
					onClick={next}
					className={currentPage < totalPages ? "prevNextI" : "prevNextDisableI"}
				>
					&gt;
				</span>
			</p>
			<div>
				{visibleIdeas.map((idea, index) => (
					<div className='ideaChallengeBox' key={index}>
					<div className='imgIdeasComite'>
					  {avatarUrls[index] !== null ? (
						<img src={avatarUrls[index]} alt="" />
					  ) : (
						<img src={fox} alt="" />
					  )}
					</div>
					<div className='contendoIdeaComite'>
					  <h3>{idea?.titulo}</h3>
					  <p><b>Autor: </b>{idea?.autor.nombres} {idea?.autor.apellidos}</p>
					  <p><b>Estado: </b>{idea?.estado.nombre}</p>
					</div>
					<input
					  className="inputCheckIdea"
					  type='checkbox'
					  checked={selectedIdeas.includes(idea._id)}
					  onChange={() => toggleCheckbox(idea)}
					/>
				  </div>
				))}
			  </div>
			</>
		  );
		};

export { PageListIdeasModal };