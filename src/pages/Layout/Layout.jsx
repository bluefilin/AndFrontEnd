import './Layout.css';
import { Main } from '../../components/Main';
import { Navigate } from 'react-router-dom';

const Layout = () => {
	if(sessionStorage.getItem("user") === null){
		return(<Navigate to="login"/>)
	}

	return (
		<>
			<Main/>
		</>
	);
};

export { Layout };