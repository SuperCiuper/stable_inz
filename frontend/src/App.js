import { Outlet } from "react-router-dom";
import "./App.css";
import { Footer, Header } from "./layouts";

const App = () => {
  return (
    <div className="App">
      <Header />
      <div className="Content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default App;
