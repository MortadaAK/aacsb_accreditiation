import web3 from "./web3";
import ApplicationStorage from "./contracts/Application.json";
import InstitutionStorage from "./contracts/Institution.json";
import FacultyStorage from "./contracts/Faculty.json";
import CertificateStorage from "./contracts/Certificate.json";
import create from "zustand";
import {
  ApplicationInstance,
  FacultyInstance,
  InstitutionInstance,
} from "../types/truffle-contracts";

const contract = require("@truffle/contract");

async function getContractInstance<T>(
  contractDefinition: any,
  at?: string
): Promise<T> {
  // create the instance
  const instance = contract(contractDefinition);
  instance.setProvider(web3.currentProvider);
  if (at) {
    return instance.at(at);
  } else {
    return instance.deployed();
  }
}
type Store = {
  application?: ApplicationInstance;
  account: string;
  initialized: boolean;
  faculty: (address: string) => Promise<FacultyInstance>;
  instition: (address: string) => Promise<InstitutionInstance>;
  notify: (topic: string, params?: any[]) => void;
  notifications: Record<string, number>;
  notification: (topic: string, params?: any[]) => number;
};
const useStore = create<Store>((set, get) => {
  getContractInstance<ApplicationInstance>(ApplicationStorage).then(
    (application) => {
      set({ application, initialized: true });
    }
  );
  web3.eth.getAccounts().then((accounts) => {
    set({ account: accounts[0] });
  });
  return {
    notifications: {},
    notification: (topic, params) => {
      topic = `__notification__:${JSON.stringify({ topic, params })}`;
      return get().notifications[topic] || 0;
    },

    notify: (topic, params) => {
      topic = `__notification__:${JSON.stringify({ topic, params })}`;
      const notifications = get().notifications;
      const current = notifications[topic] || 0;
      set({ notifications: { ...notifications, [topic]: current + 1 } });
    },
    application: undefined,
    account: "",
    initialized: false,
    faculty: (address) => {
      return getContractInstance<FacultyInstance>(FacultyStorage, address);
    },
    instition: (address) => {
      return getContractInstance<InstitutionInstance>(
        InstitutionStorage,
        address
      );
    },
  };
});

export default useStore;
