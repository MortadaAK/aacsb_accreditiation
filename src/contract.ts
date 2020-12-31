import web3 from "./web3";
import create from "zustand";
import { abi, networks } from "./contracts/Application.json";
import { EventData as EthEventData } from "web3-eth-contract";
import { Log } from "web3-core";
import { Subscription } from "web3-core-subscriptions";
export type EventData = EthEventData;
const [address] = Object.keys(networks) as Array<keyof typeof networks>;
const Inbox = new web3.eth.Contract(abi as any, networks[address].address);
type State = {
  accounts: string[];
  selectedAccount?: string;
  message?: string;
  loadMessage(): Promise<void>;
  setMessage(message: string): Promise<void>;
  loadAccounts(): Promise<void>;
  reload(): Promise<void>;
};
const useStore = create<State>((set, get) => {
  return {
    accounts: [],
    selectedAccount: undefined,
    message: undefined,
    loadMessage: async () => {
      const message = await Inbox.methods.message().call();
      set({ message: message });
    },
    setMessage: async (message) => {
      let { selectedAccount, loadMessage } = get();
      if (selectedAccount) {
        await Inbox.methods.setMessage(message).send({ from: selectedAccount });
        await loadMessage();
      }
    },
    loadAccounts: async () => {
      const accounts = await web3.eth.getAccounts();
      const selectedAccount = get().selectedAccount || accounts[0];
      useStore.setState({
        accounts: accounts,
        selectedAccount: selectedAccount,
      });
    },
    reload: async () => {
      const { loadAccounts, loadMessage } = get();
      await Promise.all([loadAccounts(), loadMessage()]);
      return;
    },
  };
});
// a list for saving subscribed event instances
const subscribedEvents: Record<string, Subscription<Log>> = {};
// Subscriber method
Inbox.events.allEvents(
  { fromBlock: 0 },
  (error: Error, event: Subscription<Log>) => {
    console.log(event);
  }
);
useStore.getState().reload();
const inboxEvents = () => {
  return Inbox.getPastEvents("allEvents", { fromBlock: 0, toBlock: "latest" });
};
export default useStore;
export { inboxEvents };
