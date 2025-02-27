import './NavFooter.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { Help } from "../../assets/icons/Help"
import {Out} from "../../assets/icons/Out"

const NavFooter = ({isOpen}) => {
	const goToLogout = useNavigate();
	const logOut = async()=>{
		sessionStorage.clear();
		goToLogout("/logout")
	}
	return(
		<>
			<div className='navfooter' style={{display: isOpen ? "block" : "none"}}>
				<div>
					{/* <a href="">
						<figure>
							<Help/>
						</figure>
						<p>Ayuda</p>
					</a> */}
					<NavLink to="/login" onClick={logOut}>
						<figure>
							<Out/>
						</figure>
						<p>Salir</p>
					</NavLink>
				</div>
				
			</div>
		</>
	)
	
};

export { NavFooter };