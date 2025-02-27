import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Layout } from '../pages/Layout';
import { Dashboard } from '../pages/Dashboard';
import { IdeaList } from "../pages/IdeaList";
import { IdeaUsersList } from '../pages/IdeaUsersList';
import { Idea } from '../pages/Idea';
import { ChallengeList } from '../pages/ChallengeList';
import { ChallengeUsersList } from '../pages/ChallengeUsersList';
import { Challenge } from '../pages/Challenge';
import { UserConfig } from '../pages/UserConfig';
import { CommitteeEdit } from '../pages/CommitteeEdit';
import { Committee } from '../pages/Committee';
import { Admin } from '../pages/Admin';
import { FAQ } from '../pages/FAQ';
import { CoAuthorList } from '../pages/CoAuthorList';
import { CreateIdea } from '../pages/CreateIdea';
import { ChangePwByMail } from "../components/LoginComponent/ChangePwByMail";
import { Notifications } from '../pages/Notifications';
import { Reto } from '../pages/reto';
import { ChallengesLaunched } from '../pages/ChallengesLaunched';
import CommitteList from '../pages/CommitteList/CommitteList';
import { ChallengeWithout } from '../pages/ChallengeWithout/ChallengeWithout';
import { PointsAdmin } from '../pages/PointsAdmin';
import { CommitteCreate } from '../pages/CommitteCreate';
const MyRoutes = () => {
	return(
		<BrowserRouter>
			<Routes>
				<Route path="login" element={ <Login /> } />
				<Route path='/' element={ <Layout/> }>
					<Route path='tablero' element={ <Dashboard/> }/>
					<Route path='lista_ideas' element={ <IdeaList/> }/>
					<Route path="lista_coautores" element={ <CoAuthorList/>}/>
					<Route path='lista_ideas_usuarios' element={ <IdeaUsersList/> }/>
					<Route path='idea/:idIdea' element={ <Idea/> }/>
					<Route path='lista_retos' element={ <ChallengeList/> }/>
					<Route path='lista_retos_usuarios' element={ <ChallengeUsersList/> }/>
					<Route path='reto/:idReto' element={ <Reto/> }/>
					<Route path='mi_reto' element={ <Challenge/> }/>
					<Route path='mis_retos_lanzados' element={<ChallengesLaunched/>} />
					<Route path='retos_sin_lanzar' element={<ChallengeWithout/>} />
					<Route path='editar_perfil' element={ <UserConfig/> }/>
					<Route path='gestionar_comite' element={ <CommitteeEdit/> }/>
					<Route path='comites' element={ <CommitteList/> }/>
					<Route path='crear_comite' element={ <CommitteCreate/> }/>
					<Route path='comite/:idComite' element={ <Committee/> }/>
					<Route path='administrador' element={<Admin />}/>
					<Route path='pqr' element={<FAQ />}/>
					<Route path='/crear_idea/:idReto?' element={<CreateIdea />} />
					<Route path='notificaciones' element={<Notifications/>}/>
					<Route path='admipuntos' element={<PointsAdmin/>}/>
				</Route>
				<Route path="forgotPw/:token/:id" element={<ChangePwByMail/>}/>
			</Routes>
		</BrowserRouter>
	);
};


export { MyRoutes };