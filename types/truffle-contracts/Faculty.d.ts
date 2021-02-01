/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface FacultyContract extends Truffle.Contract<FacultyInstance> {
  "new"(
    _facultiesManager: string,
    _id: number | BN | string,
    _name: string,
    _owner: string,
    meta?: Truffle.TransactionDetails
  ): Promise<FacultyInstance>;
}

type AllEvents = never;

export interface FacultyInstance extends Truffle.ContractInstance {
  certificates(
    arg0: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  currentInstitution(txDetails?: Truffle.TransactionDetails): Promise<string>;

  name(txDetails?: Truffle.TransactionDetails): Promise<string>;

  owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

  update: {
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

  assignInstitution: {
    (
      _institutionAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _institutionAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _institutionAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _institutionAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  allowed(
    _address: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  addCertificate: {
    (
      _certificate: string,
      _address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _certificate: string,
      _address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _certificate: string,
      _address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _certificate: string,
      _address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  certificatesLength(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  listCertificates(
    _from: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string[]>;

  pendingCertificatesLength(
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  pendingCertificates(
    _from: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string[]>;

  methods: {
    certificates(
      arg0: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    currentInstitution(txDetails?: Truffle.TransactionDetails): Promise<string>;

    name(txDetails?: Truffle.TransactionDetails): Promise<string>;

    owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

    update: {
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

    assignInstitution: {
      (
        _institutionAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _institutionAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _institutionAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _institutionAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    allowed(
      _address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    addCertificate: {
      (
        _certificate: string,
        _address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _certificate: string,
        _address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _certificate: string,
        _address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _certificate: string,
        _address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    certificatesLength(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    listCertificates(
      _from: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string[]>;

    pendingCertificatesLength(
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    pendingCertificates(
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
