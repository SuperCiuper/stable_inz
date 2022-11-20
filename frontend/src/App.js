import "./App.css";

import { useContext } from "react";
import { Outlet } from "react-router-dom";

import { ColorContext } from "./contextProviders";
import { Footer, Header } from "./layouts";

const App = () => {
  const { colorContext } = useContext(ColorContext);

  return (
    <div className="App" style={{ backgroundColor: colorContext.backgroundMain }}>
      <Header />
      <div className="Content" style={{ backgroundColor: colorContext.backgroundContent }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default App;
