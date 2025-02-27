import './Login.css';
import {LoginForm} from "../../components/LoginComponent/LoginForm"
import { LoginBanner } from '../../components/LoginComponent/LoginBanner';

const Login = () => {
	return(
		<main className='loginMain'>
			<div className='loginContent'>
				<LoginForm/>
				<LoginBanner/>
			</div>
			
		</main>
	);
};

export { Login };