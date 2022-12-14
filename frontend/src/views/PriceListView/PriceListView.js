import "./PriceListView.css";

import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, ColorContext, TextEditorContext } from "../../contextProviders";
import { API_URL, checkResponseOk } from "../../constants";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const PriceListView = () => {
  const authContext = useContext(AuthContext);
  const { colorContext } = useContext(ColorContext);
  const openTextEditor = useContext(TextEditorContext);
  const [priceList, setPriceList] = useState([]);
  const toast = useRef(null);
  const ENDPOINT = "prices";

  const fetchPriceList = () => {
    fetch(API_URL + ENDPOINT)
      .then((response) => checkResponseOk(response))
      .then((response) => setPriceList(response))
      .catch((err) => {
        console.error(`Server response: ${err}`);
      });
  };

  useEffect(() => {
    fetchPriceList();
  }, []);

  const handleFetch = (method, body) => {
    authContext.performDataUpdate(ENDPOINT, method, body, fetchPriceList);
  };

  const saveName = (item, newName = "") => {
    handleFetch("PUT", { ...item, name: newName });
  };

  const editName = (item) => {
    openTextEditor(`Nowa nazwa ${item.name}`, item.name, (name) => saveName(item, name));
  };

  const savePrice = (item, newPrice = "") => {
    handleFetch("PUT", { ...item, price: newPrice });
  };

  const editPrice = (item) => {
    openTextEditor(`Nowa cena ${item.name}`, item.price, (price) => savePrice(item, price));
  };

  const deletePrice = (item) => {
    handleFetch("DELETE", { id: item.id });
  };

  const addNewPriceError = (message) => {
    toast.current.show({ severity: "error", summary: "Błąd", detail: message, life: 6000 });
  };

  const setNewPricePrice = (newPrice, price) => {
    if (!price) {
      addNewPriceError("Nie dodano ceny");
      return;
    }
    handleFetch("POST", { ...newPrice, price: price });
  };

  const setNewPriceName = (name) => {
    if (!name) {
      addNewPriceError("Nowy przedmiot nie został dodany");
      return;
    }
    openTextEditor(`Cena ${name}`, "", (price) => setNewPricePrice({ name: name }, price), true);
  };

  const createNewPrice = () => {
    openTextEditor("Nazwa nowego przedmiotu", "", setNewPriceName, true);
  };

  return (
    <div className="priceList-view">
      <table style={{ borderColor: colorContext.detail }}>
        <thead style={{ backgroundColor: colorContext.backgroundMain }}>
          <tr>
            <th style={{ borderColor: colorContext.detail }}>Usługa</th>
            <th style={{ borderColor: colorContext.detail }}>Cena</th>
            {authContext.isLogged ? <th style={{ borderColor: colorContext.detail }}>Usuń</th> : ""}
          </tr>
        </thead>
        <tbody style={{ backgroundColor: colorContext.panel }}>
          {priceList.map((item, index) => (
            <tr key={index}>
              <td
                onClick={authContext.isLogged ? () => editName(item) : () => {}}
                style={{ borderColor: colorContext.detail, cursor: authContext.isLogged ? "pointer" : "inherit" }}
              >
                {item.name}
              </td>
              <td
                onClick={authContext.isLogged ? () => editPrice(item) : () => {}}
                style={{ borderColor: colorContext.detail, cursor: authContext.isLogged ? "pointer" : "inherit" }}
              >
                {item.price}
              </td>
              {authContext.isLogged ? (
                <td className="delete-tab" style={{ borderColor: colorContext.detail }}>
                  <Button
                    className="delete-price-btn p-button-sm p-button-danger"
                    icon="pi pi-trash"
                    onClick={() => deletePrice(item)}
                  />
                </td>
              ) : (
                ""
              )}
            </tr>
          ))}
          {authContext.isLogged ? (
            <tr>
              <td className="new-price" colSpan="3" style={{ borderColor: colorContext.detail }}>
                <Toast ref={toast} />
                <Button
                  className="add-price-btn p-button-sm p-button-secondary"
                  onClick={createNewPrice}
                  label="Dodaj nowy przedmiot"
                />
              </td>
            </tr>
          ) : (
            ""
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PriceListView;
