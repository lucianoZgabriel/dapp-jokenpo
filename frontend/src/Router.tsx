import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Admin from "./Admin";
import App from "./App";

export default function Router() {
  type Props = {
    children: JSX.Element;
  };

  function PrivateRoute({ children }: Props) {
    const isAuth = localStorage.getItem("account") !== null;
    return isAuth ? children : <Navigate to="/" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute children={<Admin />} />} />
        <Route path="/app" element={<PrivateRoute children={<App />} />} />
      </Routes>
    </BrowserRouter>
  );
}
