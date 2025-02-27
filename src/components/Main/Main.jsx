import {useState} from 'react';
import './Main.css';
import { Outlet } from 'react-router-dom';
import { SideNav } from '../SideNav';
import { Header } from "../Header"
import { NavFooter } from '../NavFooter';

const Main = () => {
	const [isOpen, setIsOpen] = useState(true)
	const toggle = () => setIsOpen(!isOpen)
	return(
		<>
			<main className='main'>
				<nav style={{width: isOpen ? "278px" : "23px"}}>
					<Header isOpen={isOpen}/>
					<SideNav isOpen={isOpen}/>
					<NavFooter isOpen={isOpen}/>
					<figure className='toogleButton' onClick={toggle} style={{transform: isOpen ? "rotate(0deg)" : "rotate(180deg)"}}></figure>
				</nav>
				<div>
					<section>
							<Outlet/>
					</section>
					{/* <footer>
						<p>Hecho por <a href="https://innovacion.grupoasd.com.co/" target="_blank" rel="noopener noreferrer">Hut 8</a> para <a href="https://www.grupoasd.com/" target="_blank" rel="noopener noreferrer">Grupo ASD</a></p>
					</footer> */}
				</div>
			</main>
		</>
	);
};

export { Main };
