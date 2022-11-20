import "./TextBlock.css";

import { useContext } from "react";
import { API_URL } from "../../constants";
import { AuthContext, ColorContext, ImageSelectorContext, TextEditorContext } from "../../contextProviders";

import { Button } from "primereact/button";

const ImageBlock = ({ image }) => {
  return (
    <div className="image-block">
      {/* eslint-disable-next-line */}
      <img src={`${API_URL}image/${image}`} alt={`Image ${image} not found`}></img>
    </div>
  );
};

const TextBlock = ({ index, id, image, description, updateParentCallback = () => {} }) => {
  const authContext = useContext(AuthContext);
  const { colorContext } = useContext(ColorContext);
  const { openImageSelector } = useContext(ImageSelectorContext);
  const openTextEditor = useContext(TextEditorContext);

  const handleFetch = (method, body) => {
    authContext.performDataUpdate("textBlock", method, body, updateParentCallback);
  };

  const saveImage = (newImages = image === null ? null : [...image]) => {
    let newImage = newImages.length === 0 ? null : newImages[0];
    handleFetch("PATCH", { id: id, description: description, image: newImage });
  };

  const editImage = () => {
    openImageSelector(`Wybierz obrazek dla ${index + 1}. bloku`, [image], saveImage, true);
  };

  const saveDescription = (newDescription = description) => {
    handleFetch("PATCH", { id: id, description: newDescription, image: image });
  };

  const editDescription = () => {
    openTextEditor(`Opis bloku ${index + 1}`, description, saveDescription);
  };

  const deleteBlock = () => {
    handleFetch("DELETE", { id: id });
  };

  return (
    <div className="text-block" style={{ borderColor: colorContext.detail }}>
      {image && (index % 2 === 1 || window.innerWidth) <= 1200 ? <ImageBlock image={image} /> : ""}
      <div className="content">
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
              onClick={editImage}
              icon="pi pi-images"
              label="Ustaw zdjęcie"
            />
            <Button
              className="btn p-button-sm p-button-danger"
              onClick={deleteBlock}
              icon="pi pi-trash"
              label="Usuń blok"
            />
          </div>
        ) : (
          ""
        )}
      </div>
      {image && index % 2 === 0 && window.innerWidth > 1200 ? <ImageBlock image={image} /> : ""}
    </div>
  );
};

export default TextBlock;
