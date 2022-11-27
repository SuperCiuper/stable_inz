import "./OfferView.css";

import { useContext, useEffect, useRef, useState } from "react";
import { API_URL, checkResponseOk } from "../../constants";
import { AuthContext, ColorContext, ImageSelectorContext, TextEditorContext } from "../../contextProviders";

import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Galleria } from "primereact/galleria";
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
      .then((response) => setOfferList(response))
      .catch((err) => {
        console.error(`Server response: ${err}`);
      });
  };

  useEffect(() => {
    fetchOfferList();
  }, []);

  const renderImage = (image, images) => {
    if (!image) image = images[0];
    return (
      <div className="image-block">
        <img src={`${API_URL}image/${image}`} alt={image} />
      </div>
    );
  };

  const handleFetch = (method, body) => {
    authContext.performDataUpdate("offer", method, body, fetchOfferList);
  };

  const saveName = (item, newName = "Nazwa") => {
    handleFetch("PUT", { ...item, name: newName });
  };

  const editName = (item) => {
    openTextEditor(`Stara nazwa ${item.name}`, "", (name) => saveName(item, name), true);
  };

  const saveImages = (item, newImages = []) => {
    handleFetch("PUT", { ...item, images: newImages });
  };

  const editImages = (item) => {
    openImageSelector(`Wybierz zdjęcia ${item.name}`, item.images, (images) => saveImages(item, images));
  };

  const saveDescription = (item, newDescription = "Opis") => {
    handleFetch("PUT", { ...item, description: newDescription });
  };

  const editDescription = (item) => {
    openTextEditor(`Opis ${item.name}`, item.description, (description) => saveDescription(item, description));
  };

  const saveForWhom = (item, newForWhom = "Dla kogo") => {
    handleFetch("PUT", { ...item, forWhom: newForWhom });
  };

  const editForWhom = (item) => {
    openTextEditor(
      `Do kogo skierowana jest oferta ${item.name}`,
      item.forWhom,
      (forWhom) => saveForWhom(item, forWhom),
      true
    );
  };

  const saveProposedPrice = (item, newProposedPrice = "Proponowana cena") => {
    handleFetch("PUT", { ...item, proposedPrice: newProposedPrice });
  };

  const editProposedPrice = (item) => {
    openTextEditor(
      `Proponowana cena za ${item.name}`,
      item.proposedPrice,
      (proposedPrice) => saveProposedPrice(item, proposedPrice),
      true
    );
  };

  const deleteOffer = (item) => {
    handleFetch("DELETE", { id: item.id });
  };

  const addNewOfferError = (message) => {
    toast.current.show({ severity: "error", summary: "Błąd", detail: message, life: 6000 });
  };

  const setNewOfferProposedPrice = (newOffer, proposedPrice) => {
    if (!proposedPrice) {
      addNewOfferError("Nie podano proponowanej ceny");
      return;
    }
    handleFetch("POST", { ...newOffer, proposedPrice: proposedPrice });
  };

  const setNewOfferForWhom = (newOffer, forWhom) => {
    if (!forWhom) {
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
    if (!description) {
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
    if (!name) {
      addNewOfferError("Nazwa oferty nie została podana");
      return;
    }
    openTextEditor(`Opis ${name}`, "Opis", (description) => setNewOfferDescription({ name: name }, description));
  };

  const createNewOffer = () => {
    openTextEditor("Nazwa nowej oferty", "", setNewOfferName, true);
  };

  return (
    <div className="offer-view">
      <Accordion>
        {offerList.map((item, index) => (
          <AccordionTab
            key={index}
            header={item.name}
            headerStyle={{ borderColor: colorContext.detail, background: colorContext.backgroundMain }}
            contentStyle={{ borderColor: colorContext.detail, background: colorContext.panel }}
          >
            <p
              className="description"
              onClick={authContext.isLogged ? () => editDescription(item) : () => {}}
              style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
            >
              {item.description}
            </p>
            <p
              onClick={authContext.isLogged ? () => editForWhom(item) : () => {}}
              style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
            >
              <b>Dla kogo: </b>
              {item.forWhom}
            </p>
            <p
              onClick={authContext.isLogged ? () => editProposedPrice(item) : () => {}}
              style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
            >
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
                showItemNavigators
                showItemNavigatorsOnHover
                showThumbnails={false}
              />
            )}
            {authContext.isLogged ? (
              <div className="button-bar">
                <Button
                  className="btn p-button-sm p-button-secondary"
                  onClick={() => editName(item)}
                  icon="pi pi-images"
                  label="Zmień nazwę"
                />
                <Button
                  className="btn p-button-sm p-button-warning"
                  onClick={() => editImages(item)}
                  icon="pi pi-images"
                  label="Ustaw zdjęcia"
                />
                <Button
                  className="btn p-button-sm p-button-danger"
                  onClick={() => deleteOffer(item)}
                  icon="pi pi-trash"
                  label="Usuń"
                />
              </div>
            ) : (
              ""
            )}
          </AccordionTab>
        ))}
      </Accordion>
      {authContext.isLogged ? (
        <div className="new-offer">
          <Toast ref={toast} />
          <Button
            className="add-offer-btn p-button-sm p-button-secondary"
            onClick={createNewOffer}
            label="Dodaj nową ofertę"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default OfferView;
