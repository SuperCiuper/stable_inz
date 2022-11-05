import React, { useContext, useEffect, useState } from "react";
import { AuthContext, ColorContext, ImageSelectorContext, TextEditorContext } from "../../contextProviders";
import "./OfferView.css";
import { API_URL, checkResponseOk } from "../../constants";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Galleria } from "primereact/galleria";
import { Button } from "primereact/button";

const OfferView = () => {
	const authContext = useContext(AuthContext);
	const { colorContext } = useContext(ColorContext);
	const { openImageSelector } = useContext(ImageSelectorContext);
	const openTextEditor = useContext(TextEditorContext);
	const [offerList, setOfferList] = useState([]);

	const fetchOfferList = () => {
		fetch(API_URL + "offer")
			.then((response) => checkResponseOk(response))
			.then((response) => {
				setOfferList(response);
			})
			.catch((err) => {
				console.error(`Server response: ${err}`);
			});
	};

	useEffect(() => {
		fetchOfferList();
	}, []);

	const renderImage = (image) => {
		return (
			<div className='image-block'>
				{/* eslint-disable-next-line */}
				<img src={`${API_URL}image/${image}`} onError={(e) => (e.target.src = `${API_URL}image/${DUMMY_IMAGE}`)} alt={`Image ${image} not found`} />
			</div>
		);
	};

	const handleFetch = (method, body) => {
		fetch(API_URL + "offer", {
			method: method,
			headers: { ...authContext.getAuthHeader(), "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})
			.then((response) => checkResponseOk(response))
			.then(() => {
				fetchOfferList();
				authContext.showDataUpdateSuccess("Zmiany zostałe zapisane");
			})
			.catch((err) => {
				console.error(`Server response: ${err}`);
				authContext.showDataUpdateError(`Błąd serwera: "${err}", zmiany nie zostały zapisane`);
			});
	};

	const saveImages = (item, newImages = []) => {
		handleFetch("PATCH", { ...item, images: newImages });
	};

	const editImages = (item) => {
		openImageSelector(`Wybierz zdjęcia ${item.item}`, item.images, (images) => saveImages(item, images));
	};

	const saveDescription = (item, newDescription = "Opis") => {
		handleFetch("PATCH", { ...item, description: newDescription });
	};

	const editDescription = (item) => {
		openTextEditor(undefined, `Opis ${item.item}`, item.description, (description) => saveDescription(item, description));
	};

	const saveProposedPrice = (item, newProposedPrice = "Proponowana cena") => {
		handleFetch("PATCH", { ...item, proposedPrice: newProposedPrice });
	};

	const editProposedPrice = (item) => {
		openTextEditor(undefined, `Opis ${item.item}`, item.description, (description) => saveProposedPrice(item, description));
	};

	const deleteOffer = (item) => {
		handleFetch("DELETE", { item: item });
	};

	return (
		<div className='offer-view'>
			<Accordion>
				{offerList.map((item, index) => (
					<AccordionTab
						key={index}
						header={item.item}
						headerStyle={{ borderColor: `#${colorContext.detailRGB}`, background: `#${colorContext.mainRGB}` }}
						contentStyle={{ borderColor: `#${colorContext.detailRGB}`, background: `#${colorContext.backgroundRGB}` }}
					>
						<p className='description' onClick={authContext.isLogged ? () => editDescription(item) : () => {}}>
							{item.description}
						</p>
						<p>
							<b>Dla kogo: </b>
							{item.forWhom}
						</p>
						<p onClick={authContext.isLogged ? () => editProposedPrice(item) : () => {}}>
							<b>Proponowana cena: </b>
							{item.proposedPrice}
						</p>
						{item.images.length === 0 ? (
							""
						) : (
							<Galleria
								id={`galleria-${index}`}
								value={item.images}
								item={renderImage}
								circular
								autoPlay
								transitionInterval={4500}
								showItemNavigators // TODO https://stackoverflow.com/questions/42036865/react-how-to-navigate-through-list-by-arrow-keys
								showItemNavigatorsOnHover
								showThumbnails={false}
							/>
						)}
						{authContext.isLogged ? (
							<div className='button-bar'>
								<Button className='btn p-button-sm p-button-warning' onClick={() => editImages(item)} icon='pi pi-images' label='Ustaw zdjęcia'></Button>
								<Button className='btn p-button-sm p-button-danger' onClick={() => deleteOffer(item)} icon='pi pi-trash' label='Usuń'></Button>
							</div>
						) : (
							""
						)}
					</AccordionTab>
				))}
			</Accordion>
		</div>
	);
};

export default OfferView;
