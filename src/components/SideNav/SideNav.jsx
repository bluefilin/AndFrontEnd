import { useState } from 'react';
import './SideNav.css';
import { NavLink } from 'react-router-dom';
import {Grid} from "../../assets/icons/Grid";
import {LightBall} from "../../assets/icons/LightBall";
import {Pointer} from "../../assets/icons/Pointer";
import {Group} from "../../assets/icons/Group";
import {Bell} from "../../assets/icons/Bell";
import { dataDecrypt } from "../../util/encrypt";

const SideNav = ({isOpen}) => {
	const [ideasOpen, setIdeasOpen] = useState(false);
	const [retosOpen, setRetosOpen] = useState(false);
	const [adminOpen, setAdminOpen] = useState(false)
	const [committeeOpen, setCommitteeOpen] = useState(false);

	const user = dataDecrypt(sessionStorage.getItem('user'))

	const toggleIdeas = () => {
		setIdeasOpen(!ideasOpen);
		setRetosOpen(false)
		setCommitteeOpen(false)
		setAdminOpen(false)
	};

	const toggleRetos = () => {
		setRetosOpen(!retosOpen);
		setIdeasOpen(false);
		setCommitteeOpen(false)
		setAdminOpen(false)
	};
	const toggleCommittee = () => {
		setCommitteeOpen(!committeeOpen);
		setIdeasOpen(false);
		setRetosOpen(false);
		setAdminOpen(false);
	}
	const toggleAdmin =()=>{
		setAdminOpen(!adminOpen)
		setIdeasOpen(false);
		setRetosOpen(false);
		setCommitteeOpen(false)
	}
	const setFalseToogle = ()=>{
		setIdeasOpen(false);
		setRetosOpen(false)
		setCommitteeOpen(false)
		setAdminOpen(false)
	}

	return(
		<ul className='sideNav' style={{display: isOpen ? "block" : "none"}}>
			<li onClick={setFalseToogle}>
				<NavLink to='tablero' className="mainMenu" >
					<figure>
						<Grid/>
					</figure>
					<p>Tablero</p>

				</NavLink>
			</li>
			<li>
				<span onClick={toggleIdeas} className={ideasOpen ? "mainMenu mainMenuActive" : "mainMenu"}>
					<figure>
						<LightBall/>
					</figure>
					<p>Ideas</p>
					<figure></figure>
				</span>
				<ul className="subMenu" style={{ maxHeight: ideasOpen ? '500px' : '0'}}>
					<li>
						<NavLink to='crear_idea'>
							Crear ideas
						</NavLink>
					</li>
					<li>
						<NavLink to='lista_ideas'>
							Mis ideas 
						</NavLink>
					</li>
					{/* <li>
						<NavLink to='lista_coautores'>
							Mis co-autorias 
						</NavLink>
					</li> */}
					{user.grupo === "innovacion" ? (
						<li>
							<NavLink to='lista_ideas_usuarios'>
								Ideas de usuarios
							</NavLink>
						</li>
					):""}
					
				</ul>
			</li>
			<li>
				<span onClick={toggleRetos} className={retosOpen ? "mainMenu mainMenuActive" : "mainMenu"}>
					<figure>
						<Pointer/>
					</figure>
					<p>Retos</p>
					<figure></figure>
				</span>
				<ul className="subMenu" style={{ maxHeight: retosOpen ? '200px' : '0' }}>
					<li>
						<NavLink to='mi_reto'>
							Crea tu reto
						</NavLink>
					</li>
					<li>
						<NavLink to='lista_retos'>
							Mis retos
						</NavLink>
					</li>
					{user.grupo === "innovacion" ? (
					<li>
						<NavLink to='lista_retos_usuarios'>
							Retos de usuarios
						</NavLink>
					</li>
					
					) : null}
					
					<li>
						<NavLink to='mis_retos_lanzados'>
							Retos lanzados
						</NavLink>
					</li>
		
					{user.grupo === "innovacion" ? (
					<li>
						<NavLink to='retos_sin_lanzar'>
							Retos Sin lanzar
						</NavLink>
					</li>
					) : null}
				</ul>
			</li>
			{user.grupo === "comite" || user.grupo === "innovacion" ? (
				<li>
					<span onClick={toggleCommittee} className={committeeOpen ? "mainMenu mainMenuActive" : "mainMenu"}>
						<figure>
							<Group/>
						</figure>
						<p>Comites</p>
						<figure></figure>
					</span>
					<ul className="subMenu" style={{ maxHeight: committeeOpen ? '200px' : '0' }}>
						{/* <li>
							<NavLink to='mi_reto'>
								Crear Comité
							</NavLink>
						</li> */}
						<li>
							<NavLink to='comites'>
								Ver Comites
							</NavLink>
							<NavLink to='crear_comite'>
								Crear Comités
							</NavLink>
						</li>
					</ul>
				</li>
			) : ""}
			
			{/* <li onClick={setFalseToogle}>
				<NavLink to='notificaciones' className="mainMenu">
					<figure>
						<Bell/>
					</figure>
					<p>Notificaciones</p>
					<figure></figure>
				</NavLink>
			</li> */}
			{user.grupo === "innovacion" && (
				<li>
					<span onClick={toggleAdmin} className={adminOpen ? "mainMenu mainMenuActive" : "mainMenu"}>
						<figure>
							<Pointer/>
						</figure>
						<p>Administrador</p>
						<figure></figure>
					</span>
					<ul className="subMenu" style={{ maxHeight: adminOpen ? '200px' : '0' }}>
						<li>
							<NavLink to='admipuntos'>
								Administra los puntos
							</NavLink>
						</li>
					</ul>
				</li> 	
			)}
			
		</ul>
	);
};

export { SideNav };
