import { useContext, useState } from "react";
import { ColorContext } from "../../contextProviders";
import "./TextBlock.css";
import { API_URL, checkResponseOk } from "../../constants";
import { AuthContext } from "../../contextProviders";
import { ImageSelectorModal, TextEditorModal } from "../../components";
import { Button } from "primereact/button";

const ImageBlock = ({ image }) => {
	return (
		<div className='ImageBlock'>
			{/* eslint-disable-next-line */}
			<img src={`${API_URL}image/${image}`} alt={`Image ${image} not found`}></img>
		</div>
	);
};

const TextBlock = ({ index, id, image, description, updateParentCallback = () => {} }) => {
	const { colorContext } = useContext(ColorContext);
	const authContext = useContext(AuthContext);
	const [imageSelectorModalVisibility, setImageSelectorModalVisibility] = useState(false);
	const [textEditorModalVisibility, setTextEditorModalVisibility] = useState(false);

	const toggleImageSelectorModal = () => {
		setImageSelectorModalVisibility((prevState) => !prevState);
	};

	const toggleTextEditorModal = () => {
		setTextEditorModalVisibility((prevState) => !prevState);
	};

	const handleFetch = (method, body) => {
		fetch(API_URL + "textBlock", {
			method: method,
			headers: { ...authContext.getAuthHeader(), "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})
			.then((response) => checkResponseOk(response))
			.then(() => {
				updateParentCallback();
				authContext.showDataUpdateSuccess("Zmiany zostałe zapisane");
			})
			.catch((err) => {
				console.error(`Server response: ${err}`);
				authContext.showDataUpdateError(`Błąd serwera: "${err}", zmiany nie zostały zapisane`);
			});
	};

	const saveImage = (newImages = image === null ? null : [...image]) => {
		let newImage = newImages.length === 0 ? null : newImages[0];
		handleFetch("PATCH", { id: id, description: description, image: newImage });
	};

	const saveText = (newDescription = description) => {
		handleFetch("PATCH", { id: id, description: newDescription, image: image });
	};

	const deleteBlock = () => {
		handleFetch("DELETE", { id: id });
	};

	return (
		<div className='text-block' style={{ borderColor: `#${colorContext.detailRGB}` }}>
			{authContext.isLogged ? (
				<>
					<ImageSelectorModal
						visibilityToggle={toggleImageSelectorModal}
						visible={imageSelectorModalVisibility}
						title={`Wybierz obrazek dla ${index + 1}. bloku `}
						images={[image]}
						returnImageCallback={saveImage}
						singleImage={true}
					></ImageSelectorModal>
					<TextEditorModal
						visibilityToggle={toggleTextEditorModal}
						visible={textEditorModalVisibility}
						subtitle={`Opis bloku ${index + 1}`}
						text={description}
						saveText={saveText}
					></TextEditorModal>
				</>
			) : (
				""
			)}

			{image && index % 2 === 1 ? <ImageBlock image={image} /> : ""}
			<div className='content'>
				<p
					className='description'
					onClick={authContext.isLogged ? toggleTextEditorModal : () => {}}
					style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
				>
					{description}
				</p>
				{authContext.isLogged ? (
					<div className='button-bar'>
						<Button className='btn p-button-sm p-button-warning' onClick={toggleImageSelectorModal} icon='pi pi-images' label='Ustaw zdjęcie'></Button>
						<Button className='btn p-button-sm p-button-danger' onClick={deleteBlock} icon='pi pi-trash' label='Usuń blok'></Button>
					</div>
				) : (
					""
				)}
			</div>
			{image && index % 2 === 0 ? <ImageBlock image={image} /> : ""}
		</div>
	);
};

export default TextBlock;
