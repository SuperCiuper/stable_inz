import "./ContactView.css";

import { useContext, useEffect, useState } from "react";
import { API_URL, GMAP_API_KEY, checkResponseOk } from "../../constants";
import { AuthContext, ColorContext, TextEditorContext } from "../../contextProviders";

import { Button } from "primereact/button";

const defaultContactInfo = {
  street: "",
  zipCode: "",
  city: "",
  phoneNumber: "",
  mail: "",
  gmapLat: "0",
  gmapLng: "0",
};

const ContactView = () => {
  const authContext = useContext(AuthContext);
  const { colorContext } = useContext(ColorContext);
  const openTextEditor = useContext(TextEditorContext);
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const ENDPOINT = "contactInfo";

  const fetchContactInfo = () => {
    fetch(API_URL + ENDPOINT)
      .then((response) => checkResponseOk(response))
      .then((response) => setContactInfo(response))
      .catch((err) => {
        console.error(`Server response: ${err}`);
      });
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const handleFetch = (name, updatedValue) => {
    let updatedContactInfo = { ...contactInfo };
    updatedContactInfo[name] = updatedValue;
    authContext.performDataUpdate(ENDPOINT, "PUT", updatedContactInfo, fetchContactInfo);
  };

  const editContactInfo = (name, title) => {
    openTextEditor(title, "", (updatedValue) => handleFetch(name, updatedValue), true);
  };

  return (
    <div className="contact-view">
      <img
        className="google-map"
        style={{ borderColor: colorContext.detailRGB }}
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${parseFloat(contactInfo.gmapLat)},${parseFloat(
          contactInfo.gmapLng
        )}&zoom=12&size=640x640&markers=${parseFloat(contactInfo.gmapLat)},${parseFloat(
          contactInfo.gmapLng
        )}&key=${GMAP_API_KEY}`}
        alt="Google map"
      />
      <div className="contact-info">
        <p>
          <b>ADRES</b> <br />
          {/* eslint-disable-next-line */}
          <a
            onClick={authContext.isLogged ? () => editContactInfo("street", "Podaj ulic??") : () => {}}
            style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
          >
            {contactInfo.street},
          </a>
          <br />
          {/* eslint-disable-next-line */}
          <a
            onClick={authContext.isLogged ? () => editContactInfo("zipCode", "Podaj kod pocztowy") : () => {}}
            style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
          >
            {contactInfo.zipCode}
          </a>
          &nbsp;
          {/* eslint-disable-next-line */}
          <a
            onClick={authContext.isLogged ? () => editContactInfo("city", "Podaj miasto") : () => {}}
            style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
          >
            {contactInfo.city}
          </a>
        </p>
        <p>
          <b>NUMER TELEFONU</b>
          <br />
          {/* eslint-disable-next-line */}
          <a
            onClick={authContext.isLogged ? () => editContactInfo("phoneNumber", "Podaj numer telefonu") : () => {}}
            style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
          >
            {contactInfo.phoneNumber}
          </a>
        </p>
        <p>
          <b>MAIL</b>
          <br />
          {/* eslint-disable-next-line */}
          <a
            onClick={authContext.isLogged ? () => editContactInfo("mail", "Podaj adres mailowy") : () => {}}
            style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
          >
            {contactInfo.mail}
          </a>
        </p>
        {authContext.isLogged ? (
          <div className="button-bar">
            <Button
              className="btn p-button-sm p-button-secondary"
              onClick={() => editContactInfo("gmapLat", "Podaj szeroko???? geograficzn??")}
              label="Ustaw szeroko???? geograficzn??"
            />
            <Button
              className="btn p-button-sm p-button-secondary"
              onClick={() => editContactInfo("gmapLng", "Podaj d??ugo???? geograficzn??")}
              label="Ustaw d??ugo???? geograficzn??"
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ContactView;
