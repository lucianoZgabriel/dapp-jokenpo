import Web3 from "web3";
import abi from "./abi.json";

type LoginResponse = {
  account: string;
  isAdmin: boolean;
};

export async function login(): Promise<LoginResponse> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.requestAccounts();

  if (!accounts || accounts.length === 0) {
    throw new Error("Wallet not connected");
  }

  const contract = new web3.eth.Contract(
    abi,
    process.env.REACT_APP_CONTRACT_ADDRESS,
    { from: accounts[0] }
  );
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
