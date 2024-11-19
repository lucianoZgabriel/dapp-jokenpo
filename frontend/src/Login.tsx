import { useState } from "react";
import { login } from "./Web3Service";

function Login() {
  const [message, setMessage] = useState("");

  function onButtonClick() {
    setMessage("Logging in...");
    login()
      .then((response) => alert(JSON.stringify(response)))
      .catch((err) => setMessage(err.message));
  }

  return (
    <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <header className="mb-auto">
        <div>
          <h3 className="float-md-start mb-0">JoKenPo</h3>
          <nav className="nav nav-masthead justify-content-center float-md-end">
            <a
              className="nav-link fw-bold py-1 px-0 active"
              aria-current="page"
              href="#"
            >
              Home
            </a>
            <a className="nav-link fw-bold py-1 px-0" href="#">
              About
            </a>
          </nav>
        </div>
      </header>

      <main className="px-3">
        <h1>Log in to JoKenPo</h1>
        <p className="lead">Play the game and earn points.</p>
        <p className="lead">
          <a
            href="#"
            onClick={onButtonClick}
            className="btn btn-lg btn-light fw-bold border-white bg-white"
          >
            <img src="/assets/metamask.svg" alt="MetaMask logo" width={48} />
            Log in with MetaMask
          </a>
        </p>
        <p className="lead">{message}</p>
      </main>

      <footer className="mt-auto text-white-50">
        <p>
          Built by{" "}
          <a href="https://twitter.com/mdo" className="text-white">
            Luciano Zanin Gabriel
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default Login;
