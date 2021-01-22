/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface InstitutionsContract
  extends Truffle.Contract<InstitutionsInstance> {
  "new"(
    _application: string,
    meta?: Truffle.TransactionDetails
  ): Promise<InstitutionsInstance>;
}

export interface InstitutionAdded {
  name: "InstitutionAdded";
  args: {
    by: string;
    institution: string;
    0: string;
    1: string;
  };
}

type AllEvents = InstitutionAdded;

export interface InstitutionsInstance extends Truffle.ContractInstance {
  institutions(
    arg0: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  createInstitution: {
    (_name: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(_name: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(
      _name: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _name: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  listInstitutions(
    _from: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string[]>;

  methods: {
    institutions(
      arg0: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    createInstitution: {
      (_name: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _name: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _name: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _name: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    listInstitutions(
      _from: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string[]>;
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}