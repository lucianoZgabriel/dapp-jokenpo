import { useEffect } from "react";
import { login, logout } from "./Web3Service";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("account") !== null) {
      if (localStorage.getItem("isAdmin") === "true") {
        login()
          .then((response) => {
            if (!response.isAdmin) {
              localStorage.setItem("isAdmin", "false");
              navigate("/app");
            }
          })
          .catch((error) => {
            console.error(error);
            onLogoutClick();
          });
      } else {
        navigate("/app");
      }
    } else {
      navigate("/");
    }
  }, []);

  function onLogoutClick() {
    logout();
    navigate("/");
  }

  return (
    <header className="d-flex flex-wrap justify-content-center py-3 mb-4">
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none text-white"
      >
        <span className="fs-4">JO-KEN-PO</span>
      </a>
      <div className="col-md-3 text-end">
        <button className="btn btn-outline-danger me-2" onClick={onLogoutClick}>
          Logout
        </button>
      </div>
    </header>
  );
}
