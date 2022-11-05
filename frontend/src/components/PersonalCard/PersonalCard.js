import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, ColorContext } from "../../contextProviders";
import "./PersonalCard.css";
import { Button } from "primereact/button";
import { Galleria } from "primereact/galleria";
import { classNames } from "primereact/utils";
import { API_URL, DUMMY_IMAGE, checkResponseOk } from "../../constants";
import { ImageSelectorModal, TextEditorModal } from "../../components";
import { Toast } from "primereact/toast";

const PersonalCard = ({ name, images, description, index, personType, updateParentCallback = () => {} }) => {
	const { colorContext } = useContext(ColorContext);
	const authContext = useContext(AuthContext);
	const [isFullScreen, setFullScreen] = useState(false);
	const [imageSelectorModalVisibility, setImageSelectorModalVisibility] = useState(false);
	const [profileImageSelectorModalVisibility, setProfileImageSelectorModalVisibility] = useState(false);
	const [textEditorModalVisibility, setTextEditorModalVisibility] = useState(false);
	const toast = useRef(null);

	const toggleImageSelectorModal = () => {
		setImageSelectorModalVisibility((prevState) => !prevState);
	};

	const toggleProfileImageSelectorModalVisibility = () => {
		setProfileImageSelectorModalVisibility((prevState) => !prevState);
	};

	const toggleTextEditorModal = () => {
		setTextEditorModalVisibility((prevState) => !prevState);
	};

	const onFullScreenChange = () => {
		setFullScreen((current) => !current);
	};

	useEffect(() => {
		const bindDocumentListeners = () => {
			document.addEventListener("fullscreenchange", onFullScreenChange);
			document.addEventListener("mozfullscreenchange", onFullScreenChange);
			document.addEventListener("webkitfullscreenchange", onFullScreenChange);
			document.addEventListener("msfullscreenchange", onFullScreenChange);
		};

		const unbindDocumentListeners = () => {
			document.removeEventListener("fullscreenchange", onFullScreenChange);
			document.removeEventListener("mozfullscreenchange", onFullScreenChange);
			document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
			document.removeEventListener("msfullscreenchange", onFullScreenChange);
		};

		bindDocumentListeners();

		return () => unbindDocumentListeners();
	}, []);

	const closeFullScreen = () => {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	};

	const openFullScreen = () => {
		let elem = document.querySelector(`#galleria-${index}`);

		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			/* Firefox */
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			/* Chrome, Safari & Opera */
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			/* IE/Edge */
			elem.msRequestFullscreen();
		}
	};

	const toggleFullScreen = () => {
		isFullScreen ? closeFullScreen() : openFullScreen();
	};

	const fullscreenButton = () => {
		let fullScreenClassName = classNames("pi", {
			"pi-window-maximize": !isFullScreen,
			"pi-window-minimize": isFullScreen,
		});
		return <Button className='fullscreen-button' icon={fullScreenClassName} onClick={() => toggleFullScreen()} />;
	};

	const renderImage = (image) => {
		return (
			<div className='image-block'>
				{/* eslint-disable-next-line */}
				<img src={`${API_URL}image/${image}`} onError={(e) => (e.target.src = `${API_URL}image/${DUMMY_IMAGE}`)} alt={`Image ${image} not found`} />
				{fullscreenButton()}
			</div>
		);
	};

	const galleriaClassName = classNames(`custom-galleria`, {
		fullscreen: isFullScreen,
	});

	const handleFetch = (method, body) => {
		fetch(API_URL + personType, {
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

	const saveImages = (newImages = images) => {
		handleFetch("PATCH", { name: name, description: description, images: newImages });
	};

	const saveProfileImage = (newImages = images) => {
		if (newImages.length === 0) {
			toast.current.show({ severity: "error", summary: "Błąd", detail: "Profilowe musi być wybrane", life: 6000 });
			return;
		}
		let newProfileImage = newImages[0];
		let sortedNewImages = images.filter((item) => item !== newProfileImage);
		sortedNewImages.unshift(newProfileImage);
		console.log(sortedNewImages);
		handleFetch("PATCH", { name: name, description: description, images: sortedNewImages });
	};

	const saveText = (newDescription = description) => {
		handleFetch("PATCH", { name: name, description: newDescription, image: images });
	};

	const deletePersonalCard = () => {
		handleFetch("DELETE", { name: name });
	};

	return (
		<div className='personal-card' style={{ borderColor: `#${colorContext.detailRGB}` }}>
			{authContext.isLogged ? (
				<>
					<Toast ref={toast} />
					<ImageSelectorModal
						visibilityToggle={toggleImageSelectorModal}
						visible={imageSelectorModalVisibility}
						title={`Wybierz zdjęcia ${name}`}
						images={images}
						returnImageCallback={saveImages}
						profileImage={images[0]}
					></ImageSelectorModal>
					<ImageSelectorModal
						visibilityToggle={toggleProfileImageSelectorModalVisibility}
						visible={profileImageSelectorModalVisibility}
						title={`Wybierz profilowe zdjęcie ${name}`}
						images={[images[0]]}
						returnImageCallback={saveProfileImage}
						singleImage={true}
					></ImageSelectorModal>
					<TextEditorModal
						visibilityToggle={toggleTextEditorModal}
						visible={textEditorModalVisibility}
						subtitle={`Opis ${name}`}
						text={description}
						saveText={saveText}
					></TextEditorModal>
				</>
			) : (
				""
			)}
			{images ? (
				<Galleria
					id={`galleria-${index}`}
					className={galleriaClassName}
					value={images}
					item={renderImage}
					circular
					showItemNavigators // TODO https://stackoverflow.com/questions/42036865/react-how-to-navigate-through-list-by-arrow-keys
					showItemNavigatorsOnHover
					showThumbnails={false} // TODO: add thumbnails in fullscreen mode
				/>
			) : (
				""
			)}
			<h2>{name}</h2>
			<p className='description'>{description}</p>
			{authContext.isLogged ? (
				<div className='button-bar'>
					<Button
						className='btn p-button-sm p-button-warning'
						onClick={toggleProfileImageSelectorModalVisibility}
						icon='pi pi-images'
						label='Ustaw zdjęcie profilowe'
					></Button>
					<Button className='btn p-button-sm p-button-warning' onClick={toggleImageSelectorModal} icon='pi pi-images' label='Ustaw zdjęcia'></Button>
					<Button className='btn p-button-sm p-button-danger' onClick={deletePersonalCard} icon='pi pi-trash' label='Usuń'></Button>
				</div>
			) : (
				""
			)}
		</div>
	);
};

export default PersonalCard;
