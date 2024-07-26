import { Component, inject, Input, OnInit } from '@angular/core';
import { Web3Service } from '../services/web3.service';
import { ElectionService } from '../services/election.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
})
export class ElectionComponent implements OnInit {
  private toastr = inject(ToastrService);
  private ws = inject(Web3Service);
  private es = inject(ElectionService);

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
  isChairman = false;

  async ngOnInit() {
    this.myAddress = await this.ws.getAccount();
    this.canVote = await this.es.canVote(this.myAddress);
    this.hasVoted = await this.es.hasVoted(this.myAddress);
    this.isChairman = await this.ws.chairPersonIsUser();
  }

  async vote(candidateId: number | undefined) {
    this.ws.setContractReady(false);
    console.log('vote', candidateId);

    if (this.isChairman) {
      this.toastr.error('Chairperson is not alowed to vote!');
      this.ws.setContractReady(true);
      return;
    }

    if (!this.canVote) {
      this.toastr.warning('Ask permission to vote first!');
      this.ws.setContractReady(true);
      return;
    }

    if (this.hasVoted) {
      this.toastr.error('You have already voted!');
      this.ws.setContractReady(true);
      return;
    }

    // await this.es.vote(candidateId);
  }
}
