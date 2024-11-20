import Web3 from "web3";
import abi from "./abi.json";

const ADAPTER_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function getWeb3() {
  if (!window.ethereum) throw new Error("MetaMask is not installed");
  return new Web3(window.ethereum);
}

function getContract(web3?: Web3) {
  if (!web3) web3 = getWeb3();
  return new web3.eth.Contract(abi, ADAPTER_ADDRESS, {
    from: localStorage.getItem("account") || undefined,
  });
}

type LoginResponse = {
  account: string;
  isAdmin: boolean;
};

export async function login(): Promise<LoginResponse> {
  const web3 = getWeb3();
  const accounts = await web3.eth.requestAccounts();

  if (!accounts || accounts.length === 0) {
    throw new Error("Wallet not connected");
  }

  const contract = getContract(web3);
  const ownerContract = (await contract.methods.owner().call()) as string;

  const normalizedOwner = ownerContract.toLowerCase();
  const normalizedAccount = accounts[0].toLowerCase();

  localStorage.setItem("account", accounts[0]);
  localStorage.setItem("isAdmin", `${normalizedOwner === normalizedAccount}`);

  return {
    account: accounts[0],
    isAdmin: normalizedOwner === normalizedAccount,
  } as LoginResponse;
}
