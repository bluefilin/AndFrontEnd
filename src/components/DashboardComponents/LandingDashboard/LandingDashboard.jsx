import './LandingDashboard.css';
import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { dataDecrypt } from "../../../util/encrypt";
import { IdeaServices, getIdeasById } from "../../../services/idea.services.js";
import { getAllRetos, getRetosById } from '../../../services/reto.services.js';
import dashIdea from "../../../assets/img/dashIdea.jpg";
import dashReto from "../../../assets/img/dashReto.jpg";
import { Challenge } from '../../../assets/icons/Challenge.jsx';
import { LightBall } from '../../../assets/icons/LightBall.jsx';
import { RetosInnovaServices } from '../../../services/reto.services.js';


const LandingDashboard = ({ }) => {
	const [allIdeas, setAllIdeas] = useState([]);
	const [userIdeas, setUserIdeas] = useState([])
	const [allRetos, setAllRetos] = useState([]);
	const [userRetos, setUserRetos] = useState([])
	const [newChallenge, setNewChallenge] = useState([])
	const containerRef = useRef(null);
	useEffect(() => {
		const dataTotalIdeas = async () => {
			const resIdeasTotal = await IdeaServices();
			setAllIdeas(resIdeasTotal)
		}
		const dataIdeasUsuarios = async () => {
			const resIeasUsuario = await getIdeasById(user.id);
			setUserIdeas(resIeasUsuario)
		}
		const dataTotalRetos = async () => {
			const resIRetosTotal = await getAllRetos();
			setAllRetos(resIRetosTotal)
		}
		const datRetossUsuarios = async () => {
			const resRetosUsuario = await getRetosById(user.id);
			setUserRetos(resRetosUsuario)
		}
		const validateChallange = async ()=> {
			const resChallenge = await RetosInnovaServices(22);
			setNewChallenge(resChallenge)
		}
		dataTotalIdeas();
		dataIdeasUsuarios();
		dataTotalRetos();
		datRetossUsuarios();
		validateChallange();
		const container = containerRef.current;

		const handleWheel = (event) => {
		if (container) {
			container.scrollLeft += event.deltaY;
			// Puedes ajustar la velocidad del desplazamiento cambiando la cantidad que se suma a scrollLeft
		};

		event.preventDefault();
		};

		if (container) {
		container.addEventListener('wheel', handleWheel);

		return () => {
			container.removeEventListener('wheel', handleWheel);
		};
		}
	}, [])
	const navigate = useNavigate()
	const irAlReto =(id)=>{
		navigate(`/reto/${id}`)
	}
	const user = dataDecrypt(sessionStorage.getItem('user'))
	return (
		<div className='landingdashboard'>
			<section>
				<article>
					<h1>¡Hagamos de la <br /><span>innovación</span> la <br />meta que nos une!</h1>
					<p>Andrómeda, es el lugar en el que podrás explorar y explotar tus habilidades de una manera diferente</p>
				</article>
				<article>
					<div>
						<figure>
							<LightBall/>
						</figure>
						<p>{allIdeas.length}</p>
						<span>Ideas en total </span>
					</div>
					<div>
						<figure>
							<Challenge/>
						</figure>
						<p>{allRetos.length}</p>
						<span>Retos en total</span>
					</div>
					<div>
						<figure>
							<LightBall/>
						</figure>
						<p>{userIdeas.length}</p>
						<span>Ideas propuestas</span>
					</div>
					<div>
						<figure>
							<Challenge/>
						</figure>
						<p>{userRetos.length}</p>
						<span>Retos subidos</span>
					</div>
				</article>
				<article>
					<div>
						<figure><img src={dashReto} alt="" /></figure>
						<h4>Las ideas son las que mueven el mundo</h4>
						<p>Esa idea que ronda por tu cabeza, ese chispazo que surgió y piensas “que pasaría si...”<br />
							Déjanos ver esa creatividad. 🎨</p>
						<NavLink to='../crear_idea'>
							Agregar idea
						</NavLink>
					</div>
					<div>
						<figure><img src={dashIdea} alt="" /></figure>
						<h4>¿Tienes un problema que no sabes cómo resolver?</h4>
						<p>No te acostumbres a vivir con problemas, compartenos ese reto para que entre todos encontremos la mejor solución.🐜</p>
						<NavLink to='../mi_reto'>
							Agregar reto
						</NavLink>
					</div>
				</article>
				<article>
					<h3>Retos en lanzamiento</h3>
					<div className='carrusel' ref={containerRef}>
						{newChallenge && newChallenge.map((reto, index) => (
							<div key={index} className='campainChallenge'>
								<figure>
									<h4>{reto?.tipo_innovacion?.nombre}</h4>
									<p><span></span>En {Math.ceil((new Date(reto.fechaFinal) - new Date()) / (1000 * 60 * 60 * 24))} días termina</p>
								</figure>
								<div className='campainChallengeContent'>
									<p>{reto.titulo}</p>
									<div>
										<button onClick={()=>irAlReto(reto._id)}>Ver reto 👀</button>
										<button>
											<NavLink to="../mis_retos_lanzados">
												Explorar retos 🔍
											</NavLink>
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</article>
			</section>
		</div>
	);
};


export { LandingDashboard };