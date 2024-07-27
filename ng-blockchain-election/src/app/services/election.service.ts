import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

import { Web3Service } from './web3.service';
import { ICandidatesInitial } from '../models/candidatesInitial';
import { ICandidateStruct } from '../models/ICandidateStruct';

@Injectable({
  providedIn: 'root',
})
export class ElectionService {
  candidatesToReturn: ICandidatesInitial[] = [];
  candidates: ICandidateStruct[] = [];

  constructor(private web3: Web3Service) {}

  onEvent(name: string) {
    return this.web3.onEvents(name);
  }

  async chairPersonIsUser(): Promise<boolean> {
    const chairperson = await this.web3.call('chairperson');
    const acc = await this.web3.getAccount();

    if (chairperson == acc) {
      return true;
    } else {
      return false;
    }
  }

  async createElection(election: ICandidatesInitial) {
    const result = await this.web3.executeTransaction(
      'initCandidates',
      election.names,
      election.images
    );
    console.log(result);
  }

  async giveRightToVote(address: string) {
    await this.web3.executeTransaction('giveRightToVote', address);
  }

  async voteFor(address: string, voteCandidate: number) {
    const result = await this.web3.executeTransaction('vote', voteCandidate);
    console.log(result);
  }

  canVote(address: string) {
    const result = this.web3.call('allowedToVote', address);
    return result;
  }

  hasVoted(address: string) {
    const result = this.web3.call('votedAlready', address);
    return result;
  }

  async setCandidates(): Promise<ICandidateStruct[]> {    
    const candidatesCount: number = await this.web3.call('candidatesCount');
    // console.log('candidatesCount', candidatesCount);

    for (let c = 0; c < candidatesCount; c++) {
      const candidate: any = await this.web3.call('getCandidate', c);

      const candidateName = ethers.decodeBytes32String(candidate[1]);
      const candidateImage = ethers.decodeBytes32String(candidate[2]);
      this.candidates.push({
        id: candidate[0],
        name: candidateName,
        imageUrl: candidateImage,
        voteCount: candidate[3],
      });
    }
    return this.candidates;
  }
}
