import { Component, Input, OnInit } from '@angular/core';
import { Web3Service } from '../services/web3.service';
import { ElectionService } from '../services/election.service';
import { waitForAsync } from '@angular/core/testing';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
})
export class ElectionComponent implements OnInit {
  @Input()
  candidateId?: number;
  @Input()
  candidateName?: string;
  @Input()
  candidateImage?: string;
  @Input()
  candidateVotes?: number;

  myAddress = '';
  canVote = false;
  hasVoted = false;

  constructor(private ws: Web3Service, private es: ElectionService) {}

  async ngOnInit() {
    this.myAddress = await this.ws.getAccount();
    this.canVote = await this.es.canVote(this.myAddress);
    this.hasVoted = await this.es.hasVoted(this.myAddress);
  }

  async vote(candidateId: number | undefined) {
    this.ws.setWeb3Busy(true);


  
    console.log('vote', candidateId);
    

    // await this.es.vote(candidateId);
  }
}
