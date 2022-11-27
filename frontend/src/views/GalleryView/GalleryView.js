import "./GalleryView.css";

import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, ImageSelectorContext } from "../../contextProviders";
import { API_URL, checkResponseOk } from "../../constants";

import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";

const GalleryView = () => {
  const authContext = useContext(AuthContext);
  const { openImageSelector, fetchImages } = useContext(ImageSelectorContext);
  const [imageList, setImageList] = useState([]);
  const fileUpload = useRef(null);

  const fetchImageList = () => {
    fetch(API_URL + "image")
      .then((response) => checkResponseOk(response))
      .then((response) => {
        /* shuffle images to get different gallery every time */
        for (let i = response.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [response[i], response[j]] = [response[j], response[i]];
        }
        setImageList(response);
      })
      .catch((err) => {
        console.error(`Server response: ${err}`);
      });
  };

  useEffect(() => {
    fetchImageList();
  }, []);

  const fetchUpdatedImages = () => {
    fetchImages();
    fetchImageList();
  };

  const uploadImages = async ({ files }) => {
    const formData = new FormData();
    files.forEach((image) => formData.append("images", image));

    authContext.performDataUpdate("image", "POST", formData, fetchUpdatedImages);
    fileUpload.current.clear();
  };

  const updateImages = async (hiddenImages) => {
    let updatedImages = await Promise.all(
      imageList.map(async (item) => {
        if (await hiddenImages.find((image) => image === item.image)) {
          return { ...item, visible: false };
        }
        return { ...item, visible: true };
      })
    );

    authContext.performDataUpdate("image", "PUT", updatedImages, fetchUpdatedImages);
  };

  const saveImages = (images) => {
    authContext.performDataUpdate("image", "DELETE", images, fetchUpdatedImages);
  };

  const changeVisibility = () => {
    let hiddenImages = imageList.reduce((result, item) => {
      if (!item.visible) result.push(item.image);
      return result;
    }, []);
    openImageSelector(`Ukryj zdjęcia w galerii`, hiddenImages, updateImages);
  };

  const deleteImages = () => {
    openImageSelector(`Wybierz zdjęcia, które chcesz usunąć`, [], saveImages);
  };

  return (
    <div className="gallery-view">
      {authContext.isLogged ? (
        <div className="button-bar">
          <FileUpload
            className="btn"
            ref={fileUpload}
            mode="basic"
            accept="image/*"
            maxFileSize={1000000}
            multiple
            chooseOptions={{
              className: "btn p-button-sm p-button-success",
              label: "Dodaj zdjęcia",
              icon: "pi pi-images",
            }}
            auto
            customUpload
            uploadHandler={uploadImages}
          />
          <Button
            className="btn p-button-sm p-button-secondary"
            onClick={changeVisibility}
            icon="pi pi-trash"
            label="Ukryj zdjęcia"
          />
          <Button
            className="btn p-button-sm p-button-danger"
            onClick={deleteImages}
            icon="pi pi-trash"
            label="Usuń zdjęcia"
          />
        </div>
      ) : (
        ""
      )}
      {imageList.map((item, index) =>
        item.visible ? (
          <div className="image-container" key={index}>
            <Image className="image-item" src={`${API_URL}image/${item.image}`} alt={item.image} preview />
          </div>
        ) : (
          ""
        )
      )}
      <div className="image-container"></div>
    </div>
  );
};

export default GalleryView;
