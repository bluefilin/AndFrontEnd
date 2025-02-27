import "./Header.css"
import logoAndromeda from "../../assets/img/logoAndromeda.svg";
import { PerfilCard } from "../PerfilCard";

const Header = ({isOpen}) => {

	return(
		<>
			<header className='header' style={{display: isOpen ? "flex" : "none"}}>
				<figure>
					<img src={logoAndromeda} alt="" />
				</figure>
				<PerfilCard/>
				
			</header>
		</>
	);
};

export { Header };