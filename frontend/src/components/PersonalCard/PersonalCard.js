import { useContext, useEffect, useState } from "react";
import { ColorContext } from "../../App";
import "./PersonalCard.css";
import { Button } from "primereact/button";
import { Galleria } from "primereact/galleria";
import { classNames } from "primereact/utils";
import { API_URL } from "../../constants";

const PersonalCard = ({ title, images, children }) => {
	const colorContext = useContext(ColorContext);
	const [isFullScreen, setFullScreen] = useState(false);

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

	useEffect(() => {
		bindDocumentListeners();

		return () => unbindDocumentListeners();
	}, []);

	const toggleFullScreen = () => {
		if (isFullScreen) {
			closeFullScreen();
		} else {
			openFullScreen();
		}
	};

	const onFullScreenChange = () => {
		setFullScreen((prevState) => !prevState);
	};

	const openFullScreen = () => {
		let elem = document.querySelector(".custom-galleria");
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

	const fullscreenButton = () => {
		let fullScreenClassName = classNames("pi", {
			"pi-window-maximize": !isFullScreen,
			"pi-window-minimize": isFullScreen,
		});
		return <Button className='fullscreen-button' icon={fullScreenClassName} onClick={() => toggleFullScreen()} />;
	};

	const renderImage = (image) => {
		if (isFullScreen) {
			return (
				<div className='image-block'>
					<img
						src={`${API_URL}image/${image}`}
						onError={(e) => (e.target.src = "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")}
						alt={`${image} not found`}
					/>
					{fullscreenButton()}
				</div>
			);
		}
		return (
			<div className='image-block'>
				<img
					src={`${API_URL}image/${image}`}
					onError={(e) => (e.target.src = "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")}
					alt={`${image} not found`}
				/>
				{fullscreenButton()}
			</div>
		);
	};

	const galleriaClassName = classNames("custom-galleria", {
		fullscreen: isFullScreen,
	});

	return (
		<div className='personal-card' style={{ borderColor: `#${colorContext.detailRGB}` }}>
			{images ? (
				<Galleria
					className={galleriaClassName}
					value={images}
					item={renderImage}
					circular
					showItemNavigators
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
