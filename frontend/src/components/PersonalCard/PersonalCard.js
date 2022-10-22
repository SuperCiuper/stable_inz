import { useContext, useEffect, useState } from "react";
import { ColorContext } from "../../App";
import "./PersonalCard.css";
import { Button } from "primereact/button";
import { Galleria } from "primereact/galleria";
import { classNames } from "primereact/utils";
import { API_URL } from "../../constants";

const PersonalCard = ({ title, images, children, index }) => {
	const colorContext = useContext(ColorContext);
	const [isFullScreen, setFullScreen] = useState(false);

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
				<img
					src={`${API_URL}image/${image}`}
					onError={(e) => (e.target.src = "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")}
					alt={`Image ${image} not found`}
				/>
				{fullscreenButton()}
			</div>
		);
	};

	const galleriaClassName = classNames(`custom-galleria`, {
		fullscreen: isFullScreen,
	});

	return (
		<div className='personal-card' style={{ borderColor: `#${colorContext.detailRGB}` }}>
			{images ? ( // TODO: add thumbnails in fullscreen mode
				<Galleria
					id={`galleria-${index}`}
					className={galleriaClassName}
					value={images}
					item={renderImage}
					circular
					showItemNavigators // https://stackoverflow.com/questions/42036865/react-how-to-navigate-through-list-by-arrow-keys
					showItemNavigatorsOnHover
					showThumbnails={false}
				/>
			) : (
				""
			)}
			<h2>{title}</h2>
			<p className='description'>{children}</p>
		</div>
	);
};

export default PersonalCard;
