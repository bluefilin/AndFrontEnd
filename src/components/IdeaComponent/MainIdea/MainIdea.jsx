import { useState, useEffect } from 'react';
import './MainIdea.css';
import profilePhoto from "../../../assets/img/defaultPhoto.jpg";
import pdfIcon from "../../../assets/icons/pdfIcon.svg";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getUserAvatarUrl } from '../../../services/users.services';
import { Comments } from '../../Comments/Comments';
import { useRef } from 'react';
import { putCreateComment } from "../../../services/idea.services";
const MainIdea = ({ideaResume}) => {
	const ideaResumeMain = ideaResume;
	const apiFile = `${import.meta.env.VITE_REACT_APP_API_URL}api/file/`;
	const profilePhotoLink = `${import.meta.env.VITE_REACT_APP_API_URL}api/avatar/`;
	const apiDownload = `${import.meta.env.VITE_REACT_APP_API_URL}api/imagen/download/`;
	const showVideo = apiFile + ideaResumeMain?.pitch;
	const showToolkit = apiDownload + ideaResumeMain?.toolkit;
	let loadVideo = false;
	if (ideaResumeMain?.pitch !== "") {
		loadVideo = true;
	}
	const downloadFile = ideaResumeMain?.filesIds?.filter(
		(e) => e.includes(".jpg") || e.includes(".png") || e.includes(".jpeg")
	);
	const downloadDocs = ideaResumeMain?.filesIds?.filter(
		(e) =>
			e.includes(".pdf") ||
			e.includes(".doc") ||
			e.includes(".docx") ||
			e.includes(".ppt") ||
			e.includes(".pptx")
	);
	let fileCondicional = false;
	if (
		ideaResumeMain?.filesIds?.filter(
			(e) =>
				e.includes(".jpg") ||
				e.includes(".jpeg") ||
				e.includes(".png") ||
				e.includes(".pdf") ||
				e.includes(".doc") ||
				e.includes(".docx") ||
				e.includes(".ppt") ||
				e.includes(".pptx")
		).length !== 0
	) {
		fileCondicional = true;
	}
	let arrayFileList = [];
	for (let i = 0; i < downloadFile?.length; i++) {
		if (
			ideaResumeMain.filesIds?.filter(
				(e) => e.includes(".jpg") || e.includes(".png") || e.includes(".jpeg")
			).length > 0
		) {
			arrayFileList.push(apiDownload + downloadFile[i]);
		}
	}

	let arrayDocsList = [];
	for (let i = 0; i < downloadDocs?.length; i++) {
		if (
			ideaResumeMain.filesIds?.filter(
				(e) =>
					e.includes(".pdf") ||
					e.includes(".doc") ||
					e.includes(".docx") ||
					e.includes(".ppt") ||
					e.includes(".pptx")
			)
		) {
			arrayDocsList.push(apiDownload + downloadDocs[i]);
		}
	}
	const [coAutoresAvatarUrls, setCoAutoresAvatarUrls] = useState([]);
	const [ProductoresAvatarUrls, setCoProductoresAvatarUrls] = useState([]);
	useEffect(() => {
		const loadAvatarUrls = async () => {
			const coAutoresUrls = await Promise.all(ideaResume.coAutor.map(async (coAutor) => {
				console.log(coAutoresAvatarUrls);
				if (coAutor.foto !== "" && coAutor.foto !== undefined) {
					return await getUserAvatarUrl(coAutor.foto);
				} else {
					return null;
				}
			}));
			const ProductoresUrls = await Promise.all(ideaResume.productor.map(async (productor) => {
				if (productor.foto !== "" && productor.foto !== undefined) {
					return await getUserAvatarUrl(productor.foto);
				} else {
					return null;
				}
			}));
			setCoProductoresAvatarUrls(ProductoresUrls)
			setCoAutoresAvatarUrls(coAutoresUrls);
		};
		loadAvatarUrls();
	}, [ideaResume]);

	const tituloRef = useRef(null);
	const fechaRef = useRef(null);
	const problemsRef = useRef(null);
	const usuRef = useRef(null);
	const funRef = useRef(null);
	const impleRef = useRef(null);
	const beneRef = useRef(null);
	const beneUsuRef = useRef(null);
	const coautoresRef = useRef(null);
	const ejeRef = useRef(null);
	const linksRef = useRef(null);
	const archivosRef = useRef(null);
	

	const switchTab = (tabIndex) => {
		setCurrentTab(tabIndex);
		switch (tabIndex) {
			case 1:
				tituloRef.current.scrollIntoView({ behavior: 'smooth' });
				break;
			case 2:
				fechaRef.current.scrollIntoView({ behavior: 'smooth' });
				break;
			case 3:
				problemsRef.current.scrollIntoView({ behavior: 'smooth' });
				break;
			case 4:
				usuRef.current.scrollIntoView({ behavior: 'smooth' });
				break;
			case 5:
				funRef.current.scrollIntoView({ behavior: 'smooth' });
				break;
			case 6:
				impleRef.current.scrollIntoView({ behavior: 'smooth' });
				break;
			case 7:
				beneRef.current.scrollIntoView({ behavior: 'smooth' });
				break;
			case 8:
				beneUsuRef.current.scrollIntoView({ behavior: 'smooth' });
				break;
			case 9:
				coautoresRef.current.scrollIntoView({ behavior: 'smooth' });
				break;
			case 10:
				ejeRef.current.scrollIntoView({ behavior: 'smooth' });
				break;
			case 11:
				linksRef.current.scrollIntoView({ behavior: 'smooth' });
				break;
			case 12:
				archivosRef.current.scrollIntoView({ behavior: 'smooth' });
				break;
			default:
				break;
		}
	}; 
	
	const [currentTab, setCurrentTab] = useState(1);
	const totalTabs = 12; // Ajusta esto según la cantidad total de pestañas
	const tabsToShow = 5; // Ajusta esto según la cantidad de pestañas que deseas mostrar
	const visibleTabs = Array.from({ length: tabsToShow }, (_, index) => index + 1);

	const incrementTab = () => {
		const nextTab = currentTab < totalTabs ? currentTab + 1 : totalTabs;
		setCurrentTab(nextTab);
	};

	const decrementTab = () => {
		const prevTab = currentTab > 1 ? currentTab - 1 : 1;
		setCurrentTab(prevTab);
	};
	const tabNames = ['Título de la idea', 'Fecha', 'Problema o situación', '¿Quiénes serán los usuarios?', '¿Cómo funcionaría?', '¿Cómo se implementará?', '¿Cuáles serán los beneficios para Grupo ASD?', '¿Cuáles serán los beneficios para los usuarios?', 'Co-autores', 'Posibles ejecutadores de la idea', 'Links agregados','Archivos subidos'];

	return (
		<div className='mainidea'>


			<h2>Idea</h2>
			<div className='tab-buttons'>
				<button onClick={decrementTab}>&#60;</button>
				{Array.from({ length: totalTabs }, (_, index) => {
					const tabIndex = index + 1;
					if (tabIndex >= currentTab && tabIndex < currentTab + tabsToShow) {
						return (
							<button
								key={tabIndex}
								onClick={() => switchTab(tabIndex)}
								className={currentTab === tabIndex ? 'active' : ''}
							>
								{tabNames[tabIndex - 1]}
							</button>
						);
					}
					return null;
				})}
				<button onClick={incrementTab}>&#62;</button>
			</div>



			<div className="ideaResume">

				<div className='ideaResumeAtributes'>
					<span>1er nivel</span><span>Ajuste 1</span>
				</div>
				<div className="ideaResumeMainInfo">
					<div>
						<div className="ideaResumeReto">
							{ideaResume.reto && Object.keys(ideaResume.reto).length > 0 && (
								<div className="ctContentUsers">
									<h3>Esta idea proviene de un reto</h3>
									<div className="ctcUser">
										<figure>
											<img src={profilePhoto} alt="" />
										</figure>
										<div>
											<h2>{ideaResume.reto.titulo}</h2>
										</div>
									</div>
								</div>
							)}
						</div>


						<h3 ref={tituloRef}>Título de la idea</h3>
						<p className='titulo'>{ideaResume.titulo}</p>
						<h3>{ideaResume.autor.nombres.split(" ")[0]} {ideaResume.autor.apellidos.split(" ")[0]}</h3>
						<p ref={fechaRef}>{format(new Date(ideaResume?.createdAt), 'dd/MMM/yy', { locale: es })}</p>
						<h3 ref={problemsRef}>Problema o situación</h3>
						<p>{ideaResume.problema}</p>
					</div>
					<div>
						<div className='adjuntos'>
							<h4>Información adicional</h4>
							<h3>Adjuntos</h3>
							{ideaResume.toolkit !== "" && ideaResume.toolkit !== undefined ? (
								<div>
									<a
										key={arrayFileList}
										className="downloadIcon jpg"
										download
										href={showToolkit}>
									</a>
								</div>
							) : (
								<p>
									La idea no posee archivos adjuntos
								</p>
							)}
						</div>
						{ideaResume?.pitch !== "" && ideaResume?.pitch !== undefined ? (
							<video preload="auto" controls >
								<source src={showVideo} type="video/mp4" />
							</video>
						) : (
							<p className='noVideo'>La idea no posee video</p>
						)}

					</div>
				</div>
				<div className="ideaResumeRestInfo">
					<h3 ref={usuRef}>¿Quiénes son los usuarios?</h3>
					<p>{ideaResume.clientes}</p>
					<h3 ref={funRef}>¿Cómo funcionaría?</h3>
					<p>{ideaResume.funcion}</p>
					<h3 ref={impleRef}>¿Cómo se implementará?</h3>
					<p>{ideaResume.implementacion}</p>
					<h3 ref={beneRef}>¿Cuáles serán los beneficios para Grupo ASD?</h3>
					<p>{ideaResume.beneficioC}</p>
					<h3 ref={beneUsuRef}>¿Cuáles serán los beneficios para los usuarios?</h3>
					<p>{ideaResume.beneficioC}</p>
					<h3 ref={coautoresRef}>Co-autores</h3>
					<div className="ideaResumeCoautor">
						{ideaResume.coAutor.length !== 0 ? (
							<>
								{ideaResume.coAutor.map((coAutor, index) => (
									<div className="itcUser" key={index}>
										<figure>
											{coAutoresAvatarUrls[index] !== null ? (
												<img src={coAutoresAvatarUrls[index]} alt="" />
											) : (
												<img src={profilePhoto} alt="" />
											)}
										</figure>
										<div>
											<h4>
												{coAutor.nombres.split(" ")[0]} {coAutor.apellidos.split(" ")[0]}
											</h4>
											<p>{coAutor.cargo}</p>
										</div>
									</div>
								))}
							</>

						) : ("No hay co-atores")}
					</div>
					<h3 ref={ejeRef}>Posibles ejecutadores de la idea</h3>
					<div className="ideaResumeCoautor">
						{ideaResume.productor.length !== 0 ? (
							<>
								{ideaResume.productor.map((productor, index) => (
									<div className="itcUser" key={index}>
										<figure>
											{ProductoresAvatarUrls[index] !== null ? (
												<img src={ProductoresAvatarUrls[index]} alt="" />
											) : (
												<img src={profilePhoto} alt="" />
											)}
										</figure>
										<div>
											<h4>
												{productor.nombres.split(" ")[0]} {productor.apellidos.split(" ")[0]}
											</h4>
											<p>{productor.cargo}</p>
										</div>
									</div>
								))}
							</>

						) : ("No hay ejecutores")}
					</div>
					<h3 ref={linksRef}>Links agregados</h3>
					<ul className='linksIdea'>
						{ideaResume.links.map((link, index) => (
							<li key={index}><a href={link.enlace} target='_blank'>{link.title}</a></li>
						))}
					</ul>
					<h3 ref={archivosRef}>Archivos subidos</h3>
					<div className='downloadFiles'>
						{ideaResume.archivos.map((files, index) => (
							<div key={index}>
								<a href={apiDownload + files} download>
									<img src={pdfIcon} alt="" />
								</a>
								<p>{files.split("_")[1]}</p>
							</div>
						))}
					</div>

				</div>
			</div>
			<Comments 
			idea={ideaResume}
				putCreateComment={putCreateComment}					
			/>
		</div>
	);
};

export { MainIdea };