import { createContext, useEffect, useState } from "react";
import { API_URL, checkResponseOk } from "../../constants";

var defaultColors = {
  backgroundMain: "#ffffff",
  backgroundContent: "#f0f0f0",
  panel: "#f0f0f0",
  header: "#ffffff",
  detail: "#000000",
  button: "#000000",
  highlight: "#000000",
};

export const ColorContext = createContext({ colorContext: { ...defaultColors } });

export const ColorContextProvider = ({ children }) => {
  const [colorContext, setColorContext] = useState(defaultColors);

  useEffect(() => {
    fetch(API_URL + "colorInfo")
      .then((response) => checkResponseOk(response))
      .then((response) => setColorContext(response))
      .catch((err) => {
        console.error(`Server response: ${err}`);
      });
  }, []);

  return <ColorContext.Provider value={{ colorContext, setColorContext }}>{children}</ColorContext.Provider>;
};
