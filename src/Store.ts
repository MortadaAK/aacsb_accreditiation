import ApplicationStorage from "./contracts/Application.json";
import CertificateStorage from "./contracts/Certificate.json";
import CertificatesManagerStorage from "./contracts/CertificatesManager.json";
import FacultiesManagerStorage from "./contracts/FacultiesManager.json";
import FacultyStorage from "./contracts/Faculty.json";
import InstituionsManagerStorage from "./contracts/InstituionsManager.json";
import InstitutionStorage from "./contracts/Institution.json";
import create from "zustand";
import web3 from "./web3";
import {
  ApplicationInstance,
  CertificateInstance,
  CertificatesManagerInstance,
  FacultiesManagerInstance,
  FacultyInstance,
  InstituionsManagerInstance,
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

export interface NotificationParams {
  eventType: string;
  targetAddress: string;
  targetType: string;
}
type Store = {
  application?: ApplicationInstance;
  facultiesManager?: FacultiesManagerInstance;
  certificatesManager?: CertificatesManagerInstance;
  instituionsManager?: InstituionsManagerInstance;
  subscription?: any;
  account: string;
  initialized: boolean;
  faculty: (address: string) => Promise<FacultyInstance>;
  institution: (address: string) => Promise<InstitutionInstance>;
  certificate: (address: string) => Promise<CertificateInstance>;
};
const notificationTopics = (notification: NotificationParams) => [
  `${notification.targetType}`,
  `${notification.targetType}|${notification.targetAddress}`,
];
export let subscription: any;
export const useSubscription = create<Record<string, Date>>(() => ({}));
const useStore = create<Store>((set, get) => {
  getContractInstance<ApplicationInstance>(ApplicationStorage).then(
    async (application) => {
      if (application) {
        const [
          facultiesManagerAddress,
          certificatesManagerAddress,
          instituionsManagerAddress,
        ] = await Promise.all([
          application.facultiesManager(),
          application.certificatesManager(),
          application.instituionsManager(),
        ]);
        // @ts-ignore
        subscription = application
          // @ts-ignore
          .allEvents({})
          .on("data", ({ args }: { args: NotificationParams }) => {
            const at = new Date();
            notificationTopics(args).forEach((topic) => {
              useSubscription.setState({ [topic]: at });
            });
          });
        set({
          application,
          facultiesManager: await getContractInstance<FacultiesManagerInstance>(
            FacultiesManagerStorage,
            facultiesManagerAddress
          ),
          certificatesManager: await getContractInstance<
            CertificatesManagerInstance
          >(CertificatesManagerStorage, certificatesManagerAddress),
          instituionsManager: await getContractInstance<
            InstituionsManagerInstance
          >(InstituionsManagerStorage, instituionsManagerAddress),
          initialized: true,
        });
      }
    }
  );
  web3.eth.getAccounts().then((accounts) => {
    set({
      account: accounts[0],
    });
  });

  return {
    application: undefined,
    facultiesManager: undefined,
    certificatesManager: undefined,
    instituionsManager: undefined,
    account: "",
    initialized: false,
    faculty: (address) => {
      return getContractInstance<FacultyInstance>(FacultyStorage, address);
    },
    institution: (address) => {
      return getContractInstance<InstitutionInstance>(
        InstitutionStorage,
        address
      );
    },
    certificate: (address) => {
      return getContractInstance<CertificateInstance>(
        CertificateStorage,
        address
      );
    },
  };
});

export default useStore;
