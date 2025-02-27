import { useState, useEffect } from 'react';
import './IdeaForm4.css';
import photo from "../../../assets/img/defaultPhoto.jpg";
import { getAllUsers } from '../../../services/users.services';
import adIcon from "../../../assets/icons/adIcon.svg";
import { getUserAvatarUrl } from '../../../services/users.services';

const IdeaForm4 = ({ setCoAutorList, setProductorList, idea }) => {
	const [query, setQuery] = useState("");
	const [query2, setQuery2] = useState("");
	const [results, setResults] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [productorResults, setProductorResults] = useState([]);
	const [selectedPdItems, setSelectedPdItems] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const users = await getAllUsers();
			setResults(users);
			setProductorResults(users);
		};
		fetchUsers();

		if (idea && (idea.coAutor.length > 0 || idea.productor.length > 0)) {
			const loadImages = async () => {
				const coautorImages = await Promise.all(
					idea.coAutor.map(async (coautor) => {
						const avatarUrl = await getUserAvatarUrl(coautor.foto);
						return { ...coautor, avatarUrl };
					})
				);

				const productorImages = await Promise.all(
					idea.productor.map(async (productor) => {
						const avatarUrl = await getUserAvatarUrl(productor.foto);
						return { ...productor, avatarUrl };
					})
				);

				setSelectedItems(coautorImages);
				setSelectedPdItems(productorImages);
			};
			loadImages();
		}
	}, [idea]);

	useEffect(() => {
		setCoAutorList(selectedItems);
		setProductorList(selectedPdItems)
	}, [selectedItems, setCoAutorList, setProductorList, selectedPdItems]);

	const handleInputChange = event => {
		setQuery(event.target.value);
	};

	const handleItemClick = async (item) => {
		if (!selectedItems.find((selectedItem) => selectedItem._id === item._id)) {
			try {
				const avatarUrl = await getUserAvatarUrl(item.foto);
				item.avatarUrl = avatarUrl;
				setSelectedItems([...selectedItems, item]);
			} catch (error) {
				console.error("Error al obtener la URL del avatar:", error);
			}
			setQuery("");
		}
	};

	const handleInputChangePd = event => {
		setQuery2(event.target.value);
	};

	const handleItemClickPd = async (item) => {
		if (!selectedPdItems.find((selectedPdItem) => selectedPdItem._id === item._id)) {
			try {
				const avatarUrl = await getUserAvatarUrl(item.foto);
				item.avatarUrl = avatarUrl;
				setSelectedPdItems([...selectedPdItems, item]);
			} catch (error) {

			}
			setQuery2("");
		}
	};

	const onDeleteTask = (id) => {
		const temp = selectedItems.filter(item2 => item2._id !== id)
		setSelectedItems(temp)
	};

	const onDeletePd = (id) => {
		const temp = selectedPdItems.filter(item => item._id !== id)
		setSelectedPdItems(temp)
	};

	const filteredResultsPd = productorResults.filter(pdSearchList => {
		const itemIsSelected = selectedPdItems.find(selectedPdItem => selectedPdItem._id === pdSearchList._id);
		return ((pdSearchList.nombres && pdSearchList.nombres.toLowerCase().includes(query2.toLowerCase()))
			|| (pdSearchList.apellidos && pdSearchList.apellidos.toLowerCase().includes(query2.toLowerCase())))
			&& !itemIsSelected;
	});

	const filteredResults = results.filter(autorSearchList => {
		const itemIsSelected = selectedItems.find(selectedItem => selectedItem._id === autorSearchList._id);
		return ((autorSearchList.nombres && autorSearchList.nombres.toLowerCase().includes(query.toLowerCase()))
			|| (autorSearchList.apellidos && autorSearchList.apellidos.toLowerCase().includes(query.toLowerCase())))
			&& !itemIsSelected;
	});

	return (
		<div className="ideaForm4">
			<div className="ctContentAdd" id="genteExtra">
				<label htmlFor="coautores">
					¿Es una idea conjunta?
					<img src={adIcon} alt="" />
					<span>Agrega a las personas que ayudaron a construir la idea.</span>
				</label>
				<input
					id="coautores"
					type="search"
					placeholder="Menciona a los coautores..."
					autoComplete='off'
					onChange={handleInputChange}
					value={query}
				/>
			</div>
			<div className="ctContentUsers">
				{query.length > 0 && (
					<ul>
						{filteredResults.map((autorSearchList, index) => (
							<li key={index} onClick={() => handleItemClick(autorSearchList)}>
								{autorSearchList.nombres} {autorSearchList.apellidos}
							</li>
						))}
					</ul>
				)}
				{selectedItems.length > 0 && (
					<div className="ctContentUsers">
						{selectedItems.map(autorCardList => (
							<div className="ctcUser" key={autorCardList._id}>
								<figure>
									{autorCardList.foto !== "" && autorCardList.foto !== undefined ? (
										<img src={autorCardList.avatarUrl} alt="" />
									) : (
										<img src={photo} alt="" />
									)}
								</figure>
								<div>
									<h1>{autorCardList.nombres.split(" ")[0]} {autorCardList.apellidos.split(" ")[0]}</h1>
									<h2>{autorCardList.cargo}</h2>
									<button onClick={() => onDeleteTask(autorCardList._id)}>x</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
			<div className="ctContentAdd">
				<label htmlFor="productores">
					¿Quiénes podrán ayudar a construir tu idea?
					<img src={adIcon} alt="" />
					<span>Menciona a las personas que crres pueden ayudar a realizarla, no importa sin son de otra área.</span>
				</label>
				<input
					id="productores"
					type="search"
					placeholder="Menciona a los productores..."
					autoComplete='off'
					onChange={handleInputChangePd}
					value={query2}
				/>
			</div>
			<div className="ctContentUsers">
				{query2.length > 0 && (
					<ul>
						{filteredResultsPd.map((pdSearchList, index) => (
							<li key={index} onClick={() => handleItemClickPd(pdSearchList)}>
								{pdSearchList.nombres} {pdSearchList.apellidos}
							</li>
						))}
					</ul>
				)}
				{selectedPdItems.length > 0 && (
					<div className="ctContentUsers">
						{selectedPdItems.map(autorCardList2 => (
							<div className="ctcUser" key={autorCardList2._id}>
								<figure>
									{autorCardList2.foto !== "" && autorCardList2.foto !== undefined ? (
										<img src={autorCardList2.avatarUrl} alt="" />
									) : (
										<img src={photo} alt="" />
									)}
								</figure>
								<div>
									<h1>{autorCardList2.nombres.split(" ")[0]} {autorCardList2.apellidos.split(" ")[0]}</h1>
									<h2>{autorCardList2.cargo}</h2>
									<button onClick={() => onDeletePd(autorCardList2._id)}>x</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export { IdeaForm4 };