import "./ImageSelectorModal.css";

import { createContext, useEffect, useState } from "react";
import { API_URL, checkResponseOk } from "../../constants";

import { Button } from "primereact/button";

export const ImageSelectorContext = createContext({});

export const ImageSelectorContextProvider = ({ children }) => {
  const [imageList, setImageList] = useState([]);
  const ENDPOINT = "images";

  const fetchImages = () => {
    fetch(API_URL + ENDPOINT)
      .then((response) => checkResponseOk(response))
      .then(async (response) => {
        await response.forEach((item, index) => {
          response[index] = item.image;
        });
        setImageList(response);
      })
      .catch((err) => {
        console.error(`Server response: ${err}`);
      });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const [title, setTitle] = useState("Wybierz zdjęcia");
  const [selectedImages, setSelectedImages] = useState([]);
  const [visibility, setVisibility] = useState(false);
  const [returnImageCallback, setReturnImageCallback] = useState(() => () => {});
  const [singleImage, setSingleImage] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const openImageSelector = (
    title = "Wybierz zdjęcia",
    selectedImages = [],
    callback = () => {},
    singleImage = false,
    profileImage = ""
  ) => {
    setTitle(title);
    setSelectedImages([...selectedImages]);
    setVisibility(true);
    setReturnImageCallback(() => (selectedImages) => callback(selectedImages));
    setSingleImage(singleImage);
    setProfileImage(profileImage);
  };

  const saveChanges = () => {
    setVisibility(false);
    returnImageCallback(selectedImages);
  };

  const onClickImage = (image) => {
    setSelectedImages((prevState) => {
      if (prevState.every((item) => item !== image)) {
        if (singleImage) return [image];
        else return [...prevState, image];
      } else return [...prevState.filter((item) => item !== image)];
    });
  };

  return (
    <ImageSelectorContext.Provider value={{ openImageSelector, fetchImages }}>
      <div
        className="image-selector-modal"
        style={{ visibility: visibility ? "visible" : "hidden" }}
        onClick={() => setVisibility(false)}
      >
        <div className="modal-window" onClick={(event) => event.stopPropagation()}>
          <h2 className="title">{title}</h2>
          <div className="image-gallery">
            {imageList.map((image, index) => (
              <div
                className="image-container"
                key={index}
                onClick={image === profileImage ? () => {} : () => onClickImage(image)}
              >
                {/* eslint-disable-next-line */}
                <img src={`${API_URL}${ENDPOINT}/${image}`} alt={`Image ${image} not found`}></img>
                <div
                  className="selected-image"
                  style={{
                    visibility: selectedImages.some((item) => item === image) && visibility ? "visible" : "hidden",
                  }}
                >
                  <i className="pi pi-star-fill" style={{ fontSize: "2rem" }} />
                </div>
              </div>
            ))}
          </div>
          <Button
            className="save-text-btn p-button-sm p-button-secondary"
            onClick={saveChanges}
            label="Zapisz"
          ></Button>
        </div>
      </div>
      {children}
    </ImageSelectorContext.Provider>
  );
};
