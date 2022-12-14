import "./HorseView.css";

import { useContext, useEffect, useRef, useState } from "react";

import { PersonalCard } from "../../components";
import { API_URL, checkResponseOk } from "../../constants";
import { AuthContext, ImageSelectorContext, TextEditorContext } from "../../contextProviders";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const HorseView = () => {
  const authContext = useContext(AuthContext);
  const { openImageSelector } = useContext(ImageSelectorContext);
  const openTextEditor = useContext(TextEditorContext);
  const [horseList, setHorseList] = useState([]);
  const toast = useRef(null);
  const ENDPOINT = "horses";

  useEffect(() => {
    fetchHorseList();
  }, []);

  const fetchHorseList = () => {
    fetch(API_URL + ENDPOINT)
      .then((response) => checkResponseOk(response))
      .then((response) => setHorseList(response))
      .catch((err) => {
        console.error(`Server response: ${err}`);
      });
  };

  const addNewHorseError = (message) => {
    toast.current.show({ severity: "error", summary: "Błąd", detail: message, life: 6000 });
  };

  const addNewHorse = (newHorse, newImages) => {
    let image = newImages.length === 0 ? null : newImages[0];

    if (!image) {
      addNewHorseError("Profilowe nie zostało wybrane");
      return;
    }

    authContext.performDataUpdate(
      ENDPOINT,
      "POST",
      { name: newHorse.name, description: newHorse.description, image: image },
      fetchHorseList
    );
  };

  const setNewHorseDescription = (newHorse, description) => {
    if (!description) {
      addNewHorseError("Nie dodano opisu");
      return;
    }
    openImageSelector(
      `Wybierz profilowe konia ${newHorse.name}`,
      [],
      (images) => addNewHorse({ ...newHorse, description: description }, images),
      true
    );
  };

  const setNewHorseName = (name) => {
    if (!name || name === "Imię") {
      addNewHorseError("Imię nie zostało wybrane");
      return;
    }
    openTextEditor(`Opis ${name}`, "Opis", (description) => setNewHorseDescription({ name: name }, description));
  };

  const createNewHorse = () => {
    openTextEditor("Imię nowego konia", "Imię", setNewHorseName, true);
  };

  return (
    <div className="horse-view">
      {horseList.map((item, index) => (
        <PersonalCard
          key={index}
          name={item.name}
          images={item.images}
          description={item.description}
          index={index}
          endpoint={ENDPOINT}
          updateParentCallback={fetchHorseList}
        />
      ))}
      {authContext.isLogged ? (
        <div className="new-horse">
          <Toast ref={toast} />
          <Button
            className="add-horse-btn p-button-sm p-button-secondary"
            onClick={createNewHorse}
            label="Dodaj nowego konia"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default HorseView;
