import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Web3 } from 'web3';

import contractAbi from '../blockchain/contractABI.json';

declare var window: any;

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private isContractReadySource = new BehaviorSubject<boolean | null>(false);
  isContractReady$ = this.isContractReadySource.asObservable();

  setContractReady(isContractReady: boolean) {
    this.isContractReadySource.next(isContractReady);
  }

  getContractReady() {
    return this.isContractReadySource.value;
  }

  private isWeb3BusySource = new BehaviorSubject<boolean | null>(false);
  isWeb3Busy$ = this.isWeb3BusySource.asObservable();

  setWeb3Busy(isWeb3Busy: boolean) {
    this.isWeb3BusySource.next(isWeb3Busy);
  }

  getWeb3Busy() {
    return this.isWeb3BusySource.value;
  }

  private web3 = new Web3(window.ethereum);
  private contract!: any;
  private contractAddress = '0xad6C120F1aFe8Ffda1f1F7B033C67A80947ffFD4';
  // 0xad6C120F1aFe8Ffda1f1F7B033C67A80947ffFD4 - contract address 2024-07-13
  // 0x80639F8EA1e0A6da4E2Edc53473089DB98978b60 - contract address 2024-07-08

  constructor(private zone: NgZone) {
    this.setContractReady(true);
    try {
      if (window.web3) {
        this.contract = new this.web3.eth.Contract(
          contractAbi,
          this.contractAddress
        );

        window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .catch((err: any) => {
            alert(
              'Error code: ' +
                err.code +
                '\n' +
                err.message +
                '\n\nYou have to connect to your decentralized web account first, following by refreshing the page.'
            );
            this.setContractReady(false);
          });
      } else {
        alert(
          'Metamask not found. Install or enable Metamask. Be sure to run Sepolia test network'
        );
        this.setContractReady(false);
      }
    } catch (error) {
      console.log('Error: ', error);
      this.setContractReady(false);
    }
  }

  refreshWallet() {
    alert('Wallet refreshed');
  }

  onEvent(name: string) {
    return this.onEvents(name);
  }

  getAccount(): Promise<string> {
    return this.web3.eth.getAccounts().then((accounts) => accounts[0] || '');
  }

  async chairPersonIsUser(): Promise<boolean> {
    const chairperson = await this.call('chairperson');
    const acc = await this.getAccount();

    if (chairperson == acc) {
      return true;
    } else {
      return false;
    }
  }

  async executeTransaction(fnName: string, ...args: any[]): Promise<void> {
    this.setWeb3Busy(true);
    const acc = await this.getAccount();
    this.contract.methods[fnName](...args)
      .send({ from: acc })
      .on('transactionHash', (hash: any) => {
        console.log('Transaction hash', hash);
      });
    this.setWeb3Busy(false);
  }

  async call(fnName: string, ...args: any[]) {
    const acc = await this.getAccount();
    return this.contract.methods[fnName](...args).call({ from: acc });
  }

  onEvents(event: string) {
    return new Observable((observer) => {
      this.contract.events[event]().on(
        'data',
        (data: { event: any; returnValues: any }) => {
          // THIS MUST RUN INSIDE ANGULAR ZONE AS IT'S LISTENING FOR 'ON'
          this.zone.run(() => {
            observer.next({
              event: data.event,
              payload: data.returnValues,
            });
          });
        }
      );
    });
  }
}
