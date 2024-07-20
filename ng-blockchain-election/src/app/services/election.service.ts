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

  createElection(election: ICandidatesInitial) {
    const result = this.web3.executeTransaction(
      'initCandidates',
      election.names,
      election.images
    );
    console.log(result);
  }

  async getCandidates(): Promise<ICandidateStruct[]> {
    const candidatesCount: number = await this.web3.call('candidatesCount');
    console.log('candidatesCount', candidatesCount);
    
    for (let c = 0; c < candidatesCount; c++) {
      const candidate: any = await this.web3.call('getCandidate', c);

      const candidateName = ethers.decodeBytes32String(candidate[1]);
      const candidateImage = ethers.decodeBytes32String(candidate[2]);
      this.candidates.push({
        id: candidate[0],
        name: candidateName,
        imageUrl: candidateImage,
        voteCount: candidate[3]
      });
    }
    return this.candidates;
  }



  /* async getCandidates(): Promise<Candidates[]> {
    const candidatesCount: number = await this.web3.call('candidatesCount');
    console.log('candidatesCount', candidatesCount);
    for (let c = 0; c < candidatesCount; c++) {
      const candidate = await this.web3.call('getCandidate', c);

      const candidateName = ethers.decodeBytes32String(candidate[1]);
      const candidateImage = ethers.decodeBytes32String(candidate[2]);
      this.candidatesToReturn.push({
        names: [candidateName],
        images: [candidateImage],
      });
    }
    return this.candidatesToReturn;
  } */

  /* vote(pollId: number, voteNumber: number) {
    console.log(pollId, voteNumber);
    this.web3.executeTransaction('vote', pollId, voteNumber);
  }

  private normalizeVoter(voter: any[][]) {
    return {
      id: voter[0],
      votedIds: voter[1].map((vote) => parseInt(vote)),
    };
  }

  private normalizeElection(electionRaw: any, voter: any): Election {
    return {
      id: parseInt(electionRaw[0]),
      question: electionRaw[1],
      thumbnail: electionRaw[2],
      results: electionRaw[3].map((vote: any) => parseInt(vote)),
      options: electionRaw[4].map((opt: any) =>
        toAscii(opt).replace(/\u0000/g, '')
      ),
      voted:
        voter.votedIds.length &&
        voter.votedIds.find(
          (votedId: any) => votedId === parseInt(electionRaw[0])
        ) != undefined,
    };
  } */

  /* async getElections(): Promise<Election[]> {
    const elections: Election[] = [];
    const totalElections = await this.web3.call('getTotalElections');
    const acc = await this.web3.getAccount();
    const voter = await this.web3.call('getVoter', acc);
    const voterNormalized = this.normalizeVoter(voter);

    for (let i = 0; i < totalElections; i++) {
      const electionRaw = await this.web3.call('getPoll', i);
      const electionNormalized = this.normalizeElection(
        electionRaw,
        voterNormalized
      );
      elections.push(electionNormalized);
    }

    return elections;
  } */
}
