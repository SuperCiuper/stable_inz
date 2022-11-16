import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, ColorContext, ImageSelectorContext, TextEditorContext } from "../../contextProviders";
import "./OfferView.css";
import { API_URL, checkResponseOk } from "../../constants";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Galleria } from "primereact/galleria";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const OfferView = () => {
	const authContext = useContext(AuthContext);
	const { colorContext } = useContext(ColorContext);
	const { openImageSelector } = useContext(ImageSelectorContext);
	const openTextEditor = useContext(TextEditorContext);
	const [offerList, setOfferList] = useState([]);
	const toast = useRef(null);

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

	const renderImage = (image, images) => {
		if (image === undefined) image = images[0];
		return (
			<div className='image-block'>
				{/* eslint-disable-next-line */}
				<img src={`${API_URL}image/${image}`} alt={`Image ${image} not found`} />
			</div>
		);
	};

	const handleFetch = (method, body) => {
		authContext.performDataUpdate("offer", method, body, fetchOfferList);
	};

	const saveImages = (item, newImages = []) => {
		handleFetch("PATCH", { ...item, images: newImages });
	};

	const editImages = (item) => {
		openImageSelector(`Wybierz zdjęcia ${item.name}`, item.images, (images) => saveImages(item, images));
	};

	const saveDescription = (item, newDescription = "Opis") => {
		handleFetch("PATCH", { ...item, description: newDescription });
	};

	const editDescription = (item) => {
		openTextEditor(`Opis ${item.name}`, item.description, (description) => saveDescription(item, description));
	};

	const saveForWhom = (item, newForWhom = "Dla kogo") => {
		handleFetch("PATCH", { ...item, forWhom: newForWhom });
	};

	const editForWhom = (item) => {
		openTextEditor(`Do kogo skierowana jest oferta ${item.name}`, item.forWhom, (forWhom) => saveForWhom(item, forWhom), true);
	};

	const saveProposedPrice = (item, newProposedPrice = "Proponowana cena") => {
		handleFetch("PATCH", { ...item, proposedPrice: newProposedPrice });
	};

	const editProposedPrice = (item) => {
		openTextEditor(`Proponowana cena za ${item.name}`, item.proposedPrice, (proposedPrice) => saveProposedPrice(item, proposedPrice), true);
	};

	const deleteOffer = (item) => {
		handleFetch("DELETE", { name: item.name });
	};

	const addNewOfferError = (message) => {
		toast.current.show({ severity: "error", summary: "Błąd", detail: message, life: 6000 });
	};

	const setNewOfferProposedPrice = (newOffer, proposedPrice) => {
		if (proposedPrice === null || proposedPrice === "" || proposedPrice === undefined) {
			addNewOfferError("Nie podano proponowanej ceny");
			return;
		}
		handleFetch("POST", { ...newOffer, proposedPrice: proposedPrice });
	};

	const setNewOfferForWhom = (newOffer, forWhom) => {
		if (forWhom === null || forWhom === "" || forWhom === undefined) {
			addNewOfferError("Nie podano informacji dla kogo");
			return;
		}
		openTextEditor(
			`Proponowana cena za ${newOffer.name}`,
			"",
			(proposedPrice) => setNewOfferProposedPrice({ ...newOffer, forWhom: forWhom }, proposedPrice),
			true
		);
	};

	const setNewOfferDescription = (newOffer, description) => {
		if (description === null || description === "" || description === undefined) {
			addNewOfferError("Nie dodano opisu");
			return;
		}
		openTextEditor(
			`Do kogo skierowana jest oferta ${newOffer.name}`,
			"",
			(forWhom) => setNewOfferForWhom({ ...newOffer, description: description }, forWhom),
			true
		);
	};

	const setNewOfferName = (name) => {
		if (name === null || name === "" || name === undefined) {
			addNewOfferError("Nowa oferta nie została dodana");
			return;
		}
		openTextEditor(`Opis ${name}`, "Opis", (description) => setNewOfferDescription({ name: name }, description));
	};

	const createNewOffer = () => {
		openTextEditor("Nazwa nowej oferty", "", setNewOfferName, true);
	};

	return (
		<div className='offer-view'>
			<Accordion>
				{offerList.map((item, index) => (
					<AccordionTab
						key={index}
						header={item.name}
						headerStyle={{ borderColor: colorContext.detail, background: colorContext.backgroundMain }}
						contentStyle={{ borderColor: colorContext.detail, background: colorContext.panel }}
					>
						<p
							className='description'
							onClick={authContext.isLogged ? () => editDescription(item) : () => {}}
							style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
						>
							{item.description}
						</p>
						<p onClick={authContext.isLogged ? () => editForWhom(item) : () => {}} style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}>
							<b>Dla kogo: </b>
							{item.forWhom}
						</p>
						<p onClick={authContext.isLogged ? () => editProposedPrice(item) : () => {}} style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}>
							<b>Proponowana cena: </b>
							{item.proposedPrice}
						</p>
						{item.images.length === 0 ? (
							""
						) : (
							<Galleria
								id={`galleria-${index}`}
								value={item.images}
								item={(image) => renderImage(image, item.images)}
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
								<Button className='btn p-button-sm p-button-warning' onClick={() => editImages(item)} icon='pi pi-images' label='Ustaw zdjęcia' />
								<Button className='btn p-button-sm p-button-danger' onClick={() => deleteOffer(item)} icon='pi pi-trash' label='Usuń' />
							</div>
						) : (
							""
						)}
					</AccordionTab>
				))}
			</Accordion>
			{authContext.isLogged ? (
				<div className='new-offer'>
					<Toast ref={toast} />
					<Button className='add-offer-btn p-button-sm p-button-secondary' onClick={createNewOffer} label='Dodaj nową ofertę' />
				</div>
			) : (
				""
			)}
		</div>
	);
};

export default OfferView;
