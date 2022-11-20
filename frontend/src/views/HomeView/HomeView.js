import "./HomeView.css";

import { useContext, useEffect, useState } from "react";

import { API_URL, checkResponseOk } from "../../constants";
import { AuthContext, TextEditorContext } from "../../contextProviders";
import { TextBlock } from "../../layouts";

import { Button } from "primereact/button";

const HomeView = () => {
  const authContext = useContext(AuthContext);
  const openTextEditor = useContext(TextEditorContext);
  const [textBlockList, setTextBlockList] = useState([]);
  const [rerender, setRerender] = useState(false);

  const fetchTextBlockList = () => {
    fetch(API_URL + "textBlock")
      .then((response) => checkResponseOk(response))
      .then((response) => setTextBlockList(response))
      .catch((err) => {
        console.error(`Server response: ${err}`);
      });
  };

  useEffect(() => {
    fetchTextBlockList();
  }, []);

  const forceRerender = () => {
    setRerender((prevState) => !prevState);
  };

  useEffect(() => {
    window.addEventListener("resize", forceRerender);
    return () => window.removeEventListener("resize", forceRerender);
  }, [rerender]);

  const addNewTextBlock = (description) => {
    authContext.performDataUpdate("textBlock", "POST", { description: description, image: null }, fetchTextBlockList);
  };

  const createNewBlock = () => {
    openTextEditor("Nowy blok", "Nowy_tekst", addNewTextBlock);
  };

  return (
    <div className="home-view">
      {textBlockList.map((item, index) => (
        <TextBlock
          key={index}
          index={index}
          id={item.id}
          image={item.image}
          description={item.description}
          updateParentCallback={fetchTextBlockList}
        />
      ))}
      {authContext.isLogged ? (
        <div className="new-block">
          <Button
            className="add-block-btn p-button-sm p-button-secondary"
            onClick={createNewBlock}
            label="Dodaj nowy blok"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default HomeView;
