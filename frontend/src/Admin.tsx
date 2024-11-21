import React, { useEffect, useState } from "react";
import Header from "./Header";
import {
  Dashboard,
  getDashboard,
  setBid,
  setCommission,
  setContract,
} from "./Web3Service";
import Web3 from "web3";

export default function Admin() {
  const [message, setMessage] = useState("");
  const [dashboard, setDashboard] = useState<Dashboard>({
    bid: "",
    commission: 0,
    address: "",
  });

  useEffect(() => {
    getDashboard()
      .then((data) => {
        setDashboard({
          bid: Web3.utils.fromWei(data.bid || "0", "ether"),
          commission: Number(data.commission) || 0,
          address: data.address || "",
        });
      })
      .catch((err) => setMessage(err.message));
  }, []);

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDashboard((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  }

  function onSetContractClick() {
    if (!dashboard?.address) return setMessage("Invalid address");

    setContract(dashboard?.address)
      .then((tx) => setMessage(`Transaction hash: ${tx}`))
      .catch((err) => setMessage(err.message));
  }

  function onSetBidClick() {
    if (!dashboard?.bid) return setMessage("Invalid bid");

    const bidInWei = Web3.utils.toWei(dashboard.bid, "ether");
    setBid(bidInWei)
      .then((tx) => setMessage(`Transaction hash: ${tx}`))
      .catch((err) => setMessage(err.message));
  }

  function onSetCommissionClick() {
    if (!dashboard?.commission) return setMessage("Invalid commission");

    setCommission(dashboard?.commission)
      .then((tx) => setMessage(`Transaction hash: ${tx}`))
      .catch((err) => setMessage(err.message));
  }

  return (
    <div className="container">
      <Header />
      <main>
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto mb-4"
            src="/logo512.png"
            alt="JoKenPo"
            width="72"
          />
          <h2>Administrative Panel</h2>
          <p className="lead">
            Change the players' bid, your commission and set new contract.
          </p>
          <p className="lead text-danger">{message}</p>
        </div>
        <div className="col-md-8 col-lg-12">
          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="bid" className="form-label">
                Bid (ether):
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="bid"
                  value={dashboard?.bid || ""}
                  onChange={onInputChange}
                />
                <span className="input-group-text bg-secondary">ether</span>
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={onSetBidClick}
                >
                  Set new bid
                </button>
              </div>
            </div>
            <div className="col-sm-6">
              <label htmlFor="commission" className="form-label">
                Comission (%)
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  id="commission"
                  value={dashboard?.commission || ""}
                  onChange={onInputChange}
                />
                <span className="input-group-text bg-secondary">%</span>
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={onSetCommissionClick}
                >
                  Set new commission
                </button>
              </div>
            </div>
          </div>
          <div className="row py-5">
            <div className="col-sm-12">
              <label htmlFor="address" className="form-label">
                New contract address:
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  value={dashboard?.address || ""}
                  onChange={onInputChange}
                />
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={onSetContractClick}
                >
                  Set new contract
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
