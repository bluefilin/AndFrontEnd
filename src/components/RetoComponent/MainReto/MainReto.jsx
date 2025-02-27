import { useState, useEffect } from 'react';
import './MainReto.css';
import profilePhoto from "../../../assets/img/defaultPhoto.jpg";
import pdfIcon from "../../../assets/icons/pdfIcon.svg";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getUserAvatarUrl } from '../../../services/users.services';
import { Comments } from '../../Comments/Comments';
import { useRef } from 'react';

const MainReto = ({ retoResume }) => {
	const retoResumeMain = retoResume;
	const apiFile = `${import.meta.env.VITE_REACT_APP_API_URL}api/file/`;
	const profilePhotoLink = `${import.meta.env.VITE_REACT_APP_API_URL}api/avatar/`;
	const apiDownload = `${import.meta.env.VITE_REACT_APP_API_URL}api/imagen/download/`;
	const showVideo = apiFile + retoResumeMain?.pitch;
	const showToolkit = apiDownload + retoResumeMain?.toolkit;
	let loadVideo = false;
	if (retoResumeMain?.pitch !== "") {
		loadVideo = true;
	}
	const downloadFile = retoResumeMain?.filesIds?.filter(
		(e) => e.includes(".jpg") || e.includes(".png") || e.includes(".jpeg")
	);
	const downloadDocs = retoResumeMain?.filesIds?.filter(
		(e) =>
			e.includes(".pdf") ||
			e.includes(".doc") ||
			e.includes(".docx") ||
			e.includes(".ppt") ||
			e.includes(".pptx")
	);
	let fileCondicional = false;
	if (
		retoResumeMain?.filesIds?.filter(
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
			retoResumeMain.filesIds?.filter(
				(e) => e.includes(".jpg") || e.includes(".png") || e.includes(".jpeg")
			).length > 0
		) {
			arrayFileList.push(apiDownload + downloadFile[i]);
		}
	}


	const [coAutoresAvatarUrls, setCoAutoresAvatarUrls] = useState([]);
	const [DesafiadosAvatarUrls, setCoDesafiadosAvatarUrls] = useState([]);
	useEffect(() => {
		const loadAvatarUrls = async () => {
			const coAutoresUrls = await Promise.all(retoResume.coAutor.map(async (coAutor) => {
				if (coAutor.foto !== "" && coAutor.foto !== undefined) {
					return await getUserAvatarUrl(coAutor.foto);
				} else {
					return null;
				}
			}));
			const DesafiadosUrls = await Promise.all(retoResume.desafiados.map(async (desafiados) => {
				if (desafiados.foto !== "" && desafiados.foto !== undefined) {
					return await getUserAvatarUrl(desafiados.foto);
				} else {
					return null;
				}
			}));
			setCoDesafiadosAvatarUrls(DesafiadosUrls)
			setCoAutoresAvatarUrls(coAutoresUrls);
		};
		loadAvatarUrls();
	}, [retoResume]);

	const tituloRef = useRef(null);
	const fechaRef = useRef(null);
	const problemsRef = useRef(null);
	const usuRef = useRef(null);
	const funRef = useRef(null);

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
			default:
				break;
		}
	};

	const [currentTab, setCurrentTab] = useState(1);


	return (
		<div className='mainReto'>


			<h2>Reto</h2>
			
			<div className='tab-buttons'>
				<button >
					&#60;
				</button>
				<button onClick={() => switchTab(1)} className={currentTab === 1 ? 'active' : ''}>
					Título del reto 
				</button>
				<button onClick={() => switchTab(2)} className={currentTab === 2 ? 'active' : ''}>
					Fecha
				</button>
				<button onClick={() => switchTab(3)} className={currentTab === 3 ? 'active' : ''}>
					Problema o situación
				</button>
				<button onClick={() => switchTab(4)} className={currentTab === 4 ? 'active' : ''}>
					¿Quiénes serán los usuarios?
				</button>
				<button onClick={() => switchTab(5)} className={currentTab === 5 ? 'active' : ''}>
					¿Cómo funcionaría?
				</button>
				{/* <button onClick={() => switchTab(6)} className={currentTab === 6 ? 'active' : ''}>
					Detalles del reto 
				</button>
				<button onClick={() => switchTab(7)} className={currentTab === 7 ? 'active' : ''}>
					Detalles del reto 
				</button>
				<button onClick={() => switchTab(8)} className={currentTab === 8 ? 'active' : ''}>
					Detalles del reto 
				</button><button onClick={() => switchTab(9)} className={currentTab === 9 ? 'active' : ''}>
					Detalles del reto 
				</button> */}
				<button
				>		&#62;
				</button>
			</div>
			<div className="retoResume">

				<div className='retoResumeAtributes'>
					<span>1er nivel</span><span>Ajuste 1</span>
				</div>
				<div className="retoResumeMainInfo">
					<div>
						<h4 ref={tituloRef}>Título el reto</h4>
						<p className='titulo'>{retoResume.titulo}</p>
						<h3>{retoResume.autor.nombres.split(" ")[0]} {retoResume.autor.apellidos.split(" ")[0]}</h3>
						<p ref={fechaRef}>{format(new Date(retoResume?.createdAt), 'dd/MMM/yy', { locale: es })}</p>
						<h3 ref={problemsRef}>Problema o situación</h3>
						<p>{retoResume.problema}</p>
					</div>
					<div>
					
						
					</div>
				</div>
				<div className="retoResumeRestInfo">
					<h3 ref={usuRef}>¿Quiénes son los usuarios?</h3>
					<p>{retoResume.clientes}</p>
					<h3 ref={funRef}>¿Cómo funcionaría?</h3>
					<p>{retoResume.funcion}</p>
					<h3>¿Cómo se implementará?</h3>
					<p>{retoResume.implementacion}</p>
					<h3>¿Cuáles serán los beneficios para Grupo ASD?</h3>
					<p>{retoResume.beneficioC}</p>
					<h3>¿Cuáles serán los beneficios para los usuarios?</h3>
					<p>{retoResume.beneficioC}</p>
					<h3>Co-autores</h3>
					<div className="retoResumeCoautor">
						{retoResume.coAutor.length !== 0 ? (
							<>
								{retoResume.coAutor.map((coAutor, index) => (
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
					<h3>Posibles ejecutadores del reto.</h3>
					<div className="retoResumeCoautor">
						{retoResume.desafiados.length !== 0 ? (
							<>
								{retoResume.desafiados.map((desafiados, index) => (
									<div className="itcUser" key={index}>
										<figure>
											{DesafiadosAvatarUrls[index] !== null ? (
												<img src={DesafiadosAvatarUrls[index]} alt="" />
											) : (
												<img src={profilePhoto} alt="" />
											)}
										</figure>
										<div>
											<h4>
												{desafiados.nombres.split(" ")[0]} {desafiados.apellidos.split(" ")[0]}
											</h4>
											<p>{desafiados.cargo}</p>
										</div>
									</div>
								))}
							</>

						) : ("No hay ejecutores")}
					</div>
					<h3>Links agregados</h3>
					<ul className='linksReto'>
						{retoResume.links.map((link, index) => (
							<li key={index}><a href={link.enlace} target='_blank'>{link.title}</a></li>
						))}
					</ul>
					<h3>Archivos subidos</h3>
					<div className='downloadFiles'>
						{retoResume.archivos.map((files, index) => (
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
			<Comments reto={retoResume} />
		</div>
	);
};

export { MainReto };