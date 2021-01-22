/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface FacultiesManagerContract
  extends Truffle.Contract<FacultiesManagerInstance> {
  "new"(
    _application: string,
    meta?: Truffle.TransactionDetails
  ): Promise<FacultiesManagerInstance>;
}

type AllEvents = never;

export interface FacultiesManagerInstance extends Truffle.ContractInstance {
  application(txDetails?: Truffle.TransactionDetails): Promise<string>;

  faculties(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  facultiesLength(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  createFaculty: {
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

  listFaculties(
    _from: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string[]>;

  methods: {
    application(txDetails?: Truffle.TransactionDetails): Promise<string>;

    faculties(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    facultiesLength(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    createFaculty: {
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

    listFaculties(
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