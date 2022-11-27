import "./TrainerView.css";

import { useContext, useEffect, useRef, useState } from "react";

import { PersonalCard } from "../../components";
import { API_URL, checkResponseOk } from "../../constants";
import { AuthContext, ImageSelectorContext, TextEditorContext } from "../../contextProviders";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const TrainerView = () => {
  const authContext = useContext(AuthContext);
  const { openImageSelector } = useContext(ImageSelectorContext);
  const openTextEditor = useContext(TextEditorContext);
  const [trainerList, setTrainerList] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    fetchTrainerList();
  }, []);

  const fetchTrainerList = () => {
    fetch(API_URL + "trainer")
      .then((response) => checkResponseOk(response))
      .then((response) => setTrainerList(response))
      .catch((err) => {
        console.error(`Server response: ${err}`);
      });
  };

  const addNewTrainerError = (message) => {
    toast.current.show({ severity: "error", summary: "Błąd", detail: message, life: 6000 });
  };

  const addNewTrainer = (newTrainer, newImages) => {
    let image = newImages.length === 0 ? null : newImages[0];

    if (!image) {
      addNewTrainerError("Profilowe nie zostało wybrane");
      return;
    }

    authContext.performDataUpdate(
      "trainer",
      "POST",
      { name: newTrainer.name, description: newTrainer.description, image: image },
      fetchTrainerList
    );
  };

  const setNewTrainerDescription = (newTrainer, description) => {
    if (!description) {
      addNewTrainerError("Nie dodano opisu");
      return;
    }
    openImageSelector(
      `Wybierz profilowe trenera ${newTrainer.name}`,
      [],
      (images) => addNewTrainer({ ...newTrainer, description: description }, images),
      true
    );
  };

  const setNewTrainerName = (name) => {
    if (!name || name === "Imię") {
      addNewTrainerError("Imię nie zostało wybrane");
      return;
    }
    openTextEditor(`Opis ${name}`, "Opis", (description) => setNewTrainerDescription({ name: name }, description));
  };

  const createNewTrainer = () => {
    openTextEditor("Imię nowego trenera", "Imię", setNewTrainerName, true);
  };

  return (
    <div className="trainer-view">
      {trainerList.map((item, index) => (
        <PersonalCard
          key={index}
          name={item.name}
          images={item.images}
          description={item.description}
          index={index}
          personType="trainer"
          updateParentCallback={fetchTrainerList}
        />
      ))}
      {authContext.isLogged ? (
        <div className="new-trainer">
          <Toast ref={toast} />
          <Button
            className="add-trainer-btn p-button-sm p-button-secondary"
            onClick={createNewTrainer}
            label="Dodaj nowego trenera"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default TrainerView;
