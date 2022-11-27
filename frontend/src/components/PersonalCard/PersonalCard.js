import "./PersonalCard.css";

import { useContext, useEffect, useRef, useState } from "react";
import { API_URL } from "../../constants";
import { AuthContext, ColorContext, ImageSelectorContext, TextEditorContext } from "../../contextProviders";

import { Button } from "primereact/button";
import { Galleria } from "primereact/galleria";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

const PersonalCard = ({ name, images, description, index, personType, updateParentCallback = () => {} }) => {
  const authContext = useContext(AuthContext);
  const { colorContext } = useContext(ColorContext);
  const { openImageSelector } = useContext(ImageSelectorContext);
  const openTextEditor = useContext(TextEditorContext);
  const [isFullScreen, setFullScreen] = useState(false);
  const toast = useRef(null);

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
    return <Button className="fullscreen-button" icon={fullScreenClassName} onClick={() => toggleFullScreen()} />;
  };

  const renderImage = (image = images[0]) => {
    return (
      <div className="personal-image-block">
        <img src={`${API_URL}image/${image}`} alt={image} />
        {fullscreenButton()}
      </div>
    );
  };

  const galleriaClassName = classNames("custom-galleria", {
    fullscreen: isFullScreen,
  });

  const handleFetch = (method, body) => {
    authContext.performDataUpdate(personType, method, body, updateParentCallback);
  };

  const saveProfileImage = (newImages = images) => {
    if (newImages.length === 0) {
      toast.current.show({ severity: "error", summary: "Błąd", detail: "Profilowe musi być wybrane", life: 6000 });
      return;
    }
    const newProfileImage = newImages[0];
    let sortedNewImages = images.filter((item) => item !== newProfileImage);
    sortedNewImages.unshift(newProfileImage);

    handleFetch("PUT", { name: name, description: description, images: sortedNewImages });
  };

  const editProfileImage = () => {
    openImageSelector(`Wybierz profilowe zdjęcie ${name}`, [images[0]], saveProfileImage, true);
  };

  const saveImages = (newImages = images) => {
    handleFetch("PUT", { name: name, description: description, images: newImages });
  };

  const editImages = () => {
    openImageSelector(`Wybierz zdjęcia ${name}`, images, saveImages, false, images[0]);
  };

  const saveDescription = (newDescription = description) => {
    handleFetch("PUT", { name: name, description: newDescription, images: images });
  };

  const editDescription = () => {
    openTextEditor(`Opis ${name}`, description, saveDescription);
  };

  const deletePersonalCard = () => {
    handleFetch("DELETE", { name: name });
  };

  return (
    <div className="personal-card" style={{ backgroundColor: colorContext.panel, borderColor: colorContext.detail }}>
      {authContext.isLogged ? <Toast ref={toast} /> : ""}
      {images.length === 0 ? (
        ""
      ) : (
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
      )}
      <h2>{name}</h2>
      <p
        className="description"
        onClick={authContext.isLogged ? editDescription : () => {}}
        style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
      >
        {description}
      </p>
      {authContext.isLogged ? (
        <div className="button-bar">
          <Button
            className="btn p-button-sm p-button-warning"
            onClick={editProfileImage}
            icon="pi pi-images"
            label="Ustaw zdjęcie profilowe"
          />
          <Button
            className="btn p-button-sm p-button-warning"
            onClick={editImages}
            icon="pi pi-images"
            label="Ustaw zdjęcia"
          />
          <Button
            className="btn p-button-sm p-button-danger"
            onClick={deletePersonalCard}
            icon="pi pi-trash"
            label="Usuń"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default PersonalCard;
