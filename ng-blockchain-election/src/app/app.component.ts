import { Component } from '@angular/core';

import { Election, ElectionVote } from './election/models/types';
import { Web3Service } from './blockchain/web3.service';
import { ElectionService } from './election/election-service/election.service';
import { ICandidateStruct } from './election/models/ICandidateStruct';
import { ICandidatesInitial } from './election/models/ICandidatesInitial';

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

  candidatesToInit: any = [];
  candidatesArray: ICandidateStruct[] = [];

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
    this.myAddress = await this.ws.getAccount();
    this.initialized = await this.ws.call('initialized');

    if (this.initialized) {
      this.candidatesArray = await this.es.getCandidates();
      console.log('candidates', this.candidatesArray);
    } else {
      this.es.onEvent('CandidatesInitiated').subscribe(() => {
        console.log('CandidatesInitiated');
        this.ws.setBusy(false);
        this.candidatesToInit = this.es.getCandidates();
      });
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

  handleElectionCreate(candidatesInitial: ICandidatesInitial) {
    // console.log('election', election);
    this.busyWeb3 = true;
    this.ws.setBusy(this.busyWeb3);
    this.es.createElection(candidatesInitial);
  }

  askPermissionToVote() {
    alert('Soon available!');
  }

  /* handlePollVote(pollVoted: PollVote) {
    this.ps.vote(pollVoted.id, pollVoted.vote);
  } */
}
