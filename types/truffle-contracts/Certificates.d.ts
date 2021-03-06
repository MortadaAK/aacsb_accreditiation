/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface CertificatesContract
  extends Truffle.Contract<CertificatesInstance> {
  "new"(
    _application: string,
    meta?: Truffle.TransactionDetails
  ): Promise<CertificatesInstance>;
}

export interface CertificateRemoved {
  name: "CertificateRemoved";
  args: {
    by: string;
    certificate: string;
    0: string;
    1: string;
  };
}

export interface CertificateRequested {
  name: "CertificateRequested";
  args: {
    by: string;
    certificate: string;
    0: string;
    1: string;
  };
}

type AllEvents = CertificateRemoved | CertificateRequested;

export interface CertificatesInstance extends Truffle.ContractInstance {
  requestCertificate: {
    (
      _faculty: string,
      _institution: string,
      _degree: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _faculty: string,
      _institution: string,
      _degree: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _faculty: string,
      _institution: string,
      _degree: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _faculty: string,
      _institution: string,
      _degree: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  removeCertificate: {
    (_certificate: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _certificate: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _certificate: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _certificate: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  pendingCertificatesLengthForFaculty(
    _faculty: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  pendingCertificatesForFaculty(
    _faculty: string,
    _from: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string[]>;

  pendingCertificatesLengthForInstitution(
    _institution: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  pendingCertificatesForInstitution(
    _institution: string,
    _from: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string[]>;

  methods: {
    requestCertificate: {
      (
        _faculty: string,
        _institution: string,
        _degree: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _faculty: string,
        _institution: string,
        _degree: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _faculty: string,
        _institution: string,
        _degree: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _faculty: string,
        _institution: string,
        _degree: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    removeCertificate: {
      (_certificate: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _certificate: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _certificate: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _certificate: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    pendingCertificatesLengthForFaculty(
      _faculty: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    pendingCertificatesForFaculty(
      _faculty: string,
      _from: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string[]>;

    pendingCertificatesLengthForInstitution(
      _institution: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    pendingCertificatesForInstitution(
      _institution: string,
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
