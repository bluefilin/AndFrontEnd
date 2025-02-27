import './Dashboard.css';
import {LandingDashboard} from "../../components/DashboardComponents/LandingDashboard"

const Dashboard = () => {
	return(
		<div className='dashboard'>
			<h2>Inicio</h2>
			<LandingDashboard/>
		</div>
	);
};


export default Dashboard;