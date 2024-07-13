import { Component } from '@angular/core';

import {
  Election,
  Candidates,
  ElectionVote,
} from './election/models/types';
import { Web3Service } from './blockchain/web3.service';
import { ElectionService } from './election/election-service/election.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showFormStartElection = false;
  busyWeb3 = false;

  chairPersonAddress = '';
  myAddress = '';
  isChairPerson = false;
  initialized = false;

  initializeCaption = 'Toggle New Election';
  activeElection: Election | undefined;
  candidates: any = [];

  constructor(private es: ElectionService, private ws: Web3Service) {
    this.ws.isBusy$.subscribe((isBusy) => {
      this.busyWeb3 = isBusy || false;
    });
  }

  async ngOnInit() {
    this.ws.chairPersonIsUser().then((result) => {
      this.isChairPerson = result;
    });
    this.chairPersonAddress = await this.ws.call('chairperson');
    // console.log('chairperson', this.chairPersonAddress);
    this.myAddress = await this.ws.getAccount();
    // console.log('myAddress', this.myAddress);
    this.initialized = await this.ws.call('initialized');
    // console.log('initialized', this.initialized);

    if (this.initialized) {
      this.candidates = await this.es.getCandidates();
      console.log('candidates', this.candidates);
    }

    /* this.es.onEvent('ElectionCreated').subscribe(() => {
      this.showFormStartElection = false;
      // this.polls = this.ps.getPolls();
    }); */

    /* this.ps.onEvent('PollVoted').subscribe(() => {
      console.log('ok voted');
      this.activePoll = undefined;
      this.polls = this.ps.getPolls();
    }); */
  }

  /* setActivePoll(poll: Poll | undefined) {
    this.activePoll = undefined;

    setTimeout(() => {
      this.activePoll = poll;
    }, 100);
  } */

  handleElectionCreate(election: Candidates) {
    // console.log('election', election);

    this.es.createElection(election);
  }

  askPermissionToVote() {
    alert('Soon available!');
  } 

  /* handlePollVote(pollVoted: PollVote) {
    this.ps.vote(pollVoted.id, pollVoted.vote);
  } */
}
