import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import ApexCharts from 'apexcharts';
import { ElectionVote } from 'src/app/models/types';


@Component({
  selector: 'app-election-vote',
  templateUrl: './election-vote.component.html',
  styleUrls: ['./election-vote.component.scss'],
})
export class ElectionVoteComponent implements AfterViewInit {
  @Input()
  voted!: boolean;
  @Input()
  options!: string[];
  @Input()
  results!: number[];
  @Input()
  question!: string;
  @Input()
  id!: number;

  @Output() electionVoted: EventEmitter<ElectionVote> = new EventEmitter();

  voteForm!: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {
    this.voteForm = this.fb.group({
      selected: this.fb.control('', [Validators.required]),
    });
  }

  ngAfterViewInit(): void {
    if (this.voted) {
      this.generateChart();
    }
  }

  submitForm() {
    const electionVoted: ElectionVote = {
      id: this.id,
      vote: this.voteForm.get('selected')!.value,
    };

    this.electionVoted.emit(electionVoted);
  }

  generateChart() {
    const options: ApexCharts.ApexOptions = {
      series: [
        {
          data: this.results,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: this.options,
      },
    };

    const chart = new ApexCharts(
      document.getElementById('election-results'),
      options
    );
    chart.render();
  }
}
