import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss'],
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

  /* @Input()
  votes: number[] = []; // [0, 1, 5, 7]
  @Input()
  voted!: boolean; */
  
  numberOfVotes!: number;

  constructor() {}

  ngOnInit(): void {
    /* if (this.votes.length) {
      this.numberOfVotes = this.votes.reduce((acc, curr) => {
        return (acc += curr);
      });
    } */
  }
}
