import { useState, useEffect } from 'react';
import './MainRetoChallenge.css';
import profilePhoto from "../../../assets/img/defaultPhoto.jpg";
import pdfIcon from "../../../assets/icons/pdfIcon.svg";
import { getUserAvatarUrl } from '../../../services/users.services';
import lanzarRetoImg from "../../../assets/img/lanzarRetoImg.png"
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStates } from '../../../services/estados.services';
import { Link } from 'react-router-dom';
import { SendModal } from '../SendModalLaunch/SendModal';
import doubtFox from "../../../assets/img/doubtFox.png";
import { postNewStage } from '../../../services/reto.services';
import sendedFox from "../../../assets/img/sendedFox.png";
import { Comments } from '../../Comments/Comments';
import { putCreateComment } from '../../../services/reto.services';
const MainRetoChallenge = ({ retoResume }) => {
	const retoResumeMain = retoResume;
	const apiDownload = `${import.meta.env.VITE_REACT_APP_API_URL}api/imagen/download/`;
	const [coAutoresAvatarUrls, setCoAutoresAvatarUrls] = useState([]);
	const [desafiadosAvatarUrls, setDesafiadosAvatarUrls] = useState([]);
	const [sendConfirmatioModal, setSendConfirmatioModal] = useState(false);
	const [sendDoneModal, setSendDoneModal] = useState(false);
	const [currentTab, setCurrentTab] = useState(1);
	const [Estado, setEstado] = useState([]);

	useEffect(() => {
		const fetchEstados = async () => {
			const result = await getStates("reto");
			const estado = result.find(estado => estado.id_estado === "22");
			setEstado(estado);

		};

		fetchEstados();

	}, []);


	useEffect(() => {
		const loadAvatarUrls = async () => {


			const coAutoresUrls = await Promise.all(retoResumeMain.coAutor.map(async (coAutor) => {
				if (coAutor.foto !== "" && coAutor.foto !== undefined) {
					return await getUserAvatarUrl(coAutor.foto);
				} else {
					return null;
				}
			}));
			const desafiadosUrls = await Promise.all(retoResumeMain.desafiados.map(async (desafiado) => {
				if (desafiado.foto !== "" && desafiado.foto !== undefined) {
					return await getUserAvatarUrl(desafiado.foto);
				} else {
					return null;
				}
			}));
			setCoAutoresAvatarUrls(coAutoresUrls);
			setDesafiadosAvatarUrls(desafiadosUrls);
		};
		loadAvatarUrls();
	}, [retoResumeMain]);
	function switchTab(tabNumber) {
		setCurrentTab(tabNumber);
	}
	const modalConfirmSend = () => {

		setSendConfirmatioModal(true)

	}
	const esDesafiado = Estado.id_estado === '22' && retoResume.estado.id_estado === '22';
	const closeConfirmSend = () => {
		setSendConfirmatioModal(false)

	}
	const onSubmit = async () => {

	};
	const reloadPage = () => {
		window.location.reload();
	}
	return (
		<div className='MainRetoChallenge'>
			<h2>{retoResume.titulo}</h2>
			<div className="retoResume">
				{/* <div className='retoResumeAtributes'>
					<span>1er nivel</span><span>Ajuste 1</span>
				</div> */}
				<img className='banerReto' src={lanzarRetoImg} alt="" />
				{esDesafiado ? (
					<div className='launch-challenge'>
						<div>
							<h3>Este reto recibe ideas hasta</h3>
							<p><b></b>{retoResume?.fechaInicio ? format(new Date(retoResume?.fechaInicio), 'dd-MMMM', { locale: es }).replace(/\b\w/g, l => l.toUpperCase()) : ''}
								-
								<b></b>{retoResume?.fechaFinal ? format(new Date(retoResume?.fechaFinal), 'dd-MMMM', { locale: es }).replace(/\b\w/g, l => l.toUpperCase()) : ''}</p>
						</div>
						<div className='createChallengeButtons1'>
							{/* <button className='button buttonOutline' onClick={modalConfirmSend}>Guardar reto</button> */}
							{sendConfirmatioModal ? (
								<SendModal
									titulo={"¿Guardar reto?"}
									img={doubtFox}
									paragraf={"Si guardas este reto, podrás resolverlo después. Recuerda revisar el plazo para resolvero."}
									btn1={"No, cancelar"}
									btn2={"Sí, guardar reto"}
									fnct1={closeConfirmSend}
									fnct2={onSubmit}
								/>) : ""}
							{sendDoneModal ? (
								<SendModal
									titulo={"¡Se ha enviado tu reto! "}
									img={sendedFox}
									paragraf={"Tu reto está listo para ser revisado, en los próximos días puedes hacerle seguimiento a su avance."}
									btn2={"Entendido"}
									fnct2={reloadPage}
								/>
							) : ""}
							<button className='button buttonFill'>
								<Link to={`/crear_idea/${retoResume._id}`}>
									¡Hacer reto!
								</Link>
							</button>

						</div>

					</div>
				) : null}
				<div className='tabs'>
					<div className='tab-buttons'>

						<button onClick={() => switchTab(1)} className={currentTab === 1 ? 'active' : ''}>
							Detalles del reto
						</button>
						<button onClick={() => switchTab(2)} className={currentTab === 2 ? 'active' : ''}>
							Adjuntos
						</button>
						<button onClick={() => switchTab(3)} className={currentTab === 3 ? 'active' : ''}>
							Desafiados
						</button>
						{esDesafiado ? (
							<div>
								<button onClick={() => switchTab(4)} className={currentTab === 4 ? 'active' : ''}>
									Recompensas
								</button>
							</div>
						) : null}
					</div>
				</div>

				<div className='tab-content'>
					<div className={`MainRetoChallenge-form1 ${currentTab === 1 ? '' : 'none'}`}>
						<h3>Problema o situación</h3>
						<p>{retoResume.problema}</p>
						<h3>¿Quiénes son los usuarios?</h3>
						<p>{retoResume.clientes}</p>
						<h3>¿Cuáles serán los beneficios para los usuarios?</h3>
						<p>{retoResume.beneficioC}</p>
						<h3>¿Cuáles serán los beneficios para Grupo ASD?</h3>
						<p>{retoResume.beneficioU}</p>
					</div>
					<div className={`MainRetoChallenge-form2 ${currentTab === 2 ? '' : 'none'}`}>
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
					<div className={`MainRetoChallenge-form ${currentTab === 3 ? '' : 'none'}`}>
						<h3>Co-autores</h3>
						<div className="retoResumeCoautor">
							{retoResumeMain.coAutor.length !== 0 ? (
								<>
									{retoResumeMain.coAutor.map((coAutor, index) => (
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
													{coAutor.nombres} {coAutor.apellidos}
												</h4>
												<p>{coAutor.cargo}</p>
											</div>
										</div>
									))}
								</>
							) : ("No hay coautores")}
						</div>
						<h3>Desafiados</h3>
						<div className="retoResumeDesafiados">
							{retoResumeMain.desafiados.length !== 0 ? (
								<>
									{retoResumeMain.desafiados.map((desafiado, index) => (
										<div className="itcUser" key={index}>
											<figure>
												{desafiadosAvatarUrls[index] !== null ? (
													<img src={desafiadosAvatarUrls[index]} alt="" />
												) : (
													<img src={profilePhoto} alt="" />
												)}
											</figure>
											<div>
												<h4>
													{desafiado.nombres} {desafiado.apellidos}
												</h4>
												<p>{desafiado.cargo}</p>
											</div>
										</div>
									))}
								</>
							) : ("No hay desafiados")}
						</div>
					</div>
					<div className={`MainRetoChallenge-form ${currentTab === 4 ? '' : 'none'}`}>
						<h3>Problema o situación</h3>
						<li>Registrar una idea para solucionar este reto:<p>20 puntos</p></li>
						<li>Presentar la idea de solución al comité  de innovación:<p>50 puntos</p></li>
						<li>Participar en el desarrollo de un proyecto de innovación:<p>100 puntos</p></li>
						<li>Implementar un proyecto de innovación: <p>200 puntos</p></li>
						<h3>Redime tus puntos en:</h3>
						<li>100 puntos =<p>1/2 día compensatorio 😊</p></li>
						<li>200 puntos =<p>1día compensatorio 😁</p></li>
						<li>300 puntos<p> =  inscripción al curso que elijas, hasta de $ 150.000 😎</p></li>
					</div>
				</div>

			</div>

			<Comments
				idea={retoResume}
				putCreateComment={putCreateComment}
			/>

		</div>
	);
};

export { MainRetoChallenge };
