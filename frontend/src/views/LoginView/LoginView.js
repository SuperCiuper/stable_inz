import "./LoginView.css";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contextProviders";

import { Button } from "primereact/button";
import { Password } from "primereact/password";

const LoginView = () => {
  const authContext = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const saveNewPassword = () => {
    authContext.performDataUpdate("auth/update", "PUT", { password: password }, () => navigate("/"));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (authContext.isLogged) {
        saveNewPassword();
        return;
      }
      authContext.loginUser(password);
      setPassword("");
    }
  };

  return (
    <div className="login-view">
      <p>{authContext.isLogged ? "Nowe hasło" : "Podaj hasło"}</p>
      <Password
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        onKeyDown={handleKeyDown}
        feedback={authContext.isLogged ? true : false}
        promptLabel="Wpisz nowe hasło"
        weakLabel="Słabe"
        mediumLabel="Średnie"
        strongLabel="Silne"
        toggleMask
      />
      {authContext.isLogged ? (
        <Button className="btn p-button-sm p-button-secondary" onClick={saveNewPassword} label="Zmień hasło" />
      ) : (
        <Button
          className="btn p-button-sm p-button-success"
          onClick={() => authContext.loginUser(password)}
          label="Zaloguj"
        />
      )}
    </div>
  );
};

export default LoginView;
