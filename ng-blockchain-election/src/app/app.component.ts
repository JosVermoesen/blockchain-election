import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Election } from './models/types';
import { ICandidateStruct } from './models/ICandidateStruct';
import { ElectionService } from './services/election.service';
import { Web3Service } from './services/web3.service';
import { ICandidatesInitial } from './models/candidatesInitial';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IContactmail } from './models/contactmail';
import { MailService } from './services/mail.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  showFormStartElection = false;

  permissionForm!: FormGroup;
  form!: FormGroup;

  busyWeb3 = false;
  sendEmailCaption = 'Send';

  chairPersonAddress = '';
  myAddress = '';
  isChairPerson = false;
  initialized = false;

  initializeCaption = 'New Election';
  activeElection: Election | undefined;

  candidatesToInit: any = [];
  candidatesArray: ICandidateStruct[] = [];

  contactMail!: IContactmail;
  templateName = 'contact.html';
  templateBody = '';
  mailSubject = 'Permission to vote';

  constructor(
    private fb: FormBuilder,
    private es: ElectionService,
    private ws: Web3Service,
    private http: HttpClient,
    private ms: MailService
  ) {
    this.ws.isBusy$.subscribe((isBusy) => {
      this.busyWeb3 = isBusy || false;
    });
  }

  async ngOnInit() {
    this.permissionForm = this.fb.group({
      voterAddress: this.fb.control(this.myAddress, [Validators.required]),
      voterEmail: this.fb.control(null, [
        Validators.required,
        Validators.email,
      ]),
    });

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

  refreshTemplateBody() {
    const stringNameToReplace = '.{name}';
    // name insert
    this.templateBody = this.templateBody.replace(
      stringNameToReplace,
      this.permissionForm.value.voterEmail
    );

    const stringInBlockToReplace = '.{address}';
    // name insert
    this.templateBody = this.templateBody.replace(
      stringInBlockToReplace,
      this.permissionForm.value.voterAddress
    );

    this.form.value.template = this.templateBody;
    // console.log(this.form.value);
  }

  createContactForm() {
    this.form = this.fb.group({
      subject: [this.mailSubject, Validators.required],
      name: [this.permissionForm.value.voterAddress, Validators.required],
      rR: [
        '00000000000',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      email: [
        this.permissionForm.value.voterEmail,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ]),
      ],
      phone: [''],
      copySender: [true],
      message: ['', Validators.required],
      template: [this.templateBody],
      data: [null],
      apiGuid: [environment.apiVsoftMailGuid, Validators.required],
      apiMailKey: [environment.apiVsoftSendFromAddress, Validators.required],
      apiNameKey: [environment.apiVsoftSendFromName, Validators.required],
    });
    console.log(this.form.value);
  }

  sendEmail() {
    this.ws.setBusy(true);
    alert('Soon available!');
    this.ws.setBusy(false);

    this.http
      .get('assets/templates/mail/' + this.templateName, {
        responseType: 'text',
      })
      .subscribe((data) => {
        // console.log(data);
        this.templateBody = data;
        this.createContactForm();
        this.submitContactMail();
      });
  }

  submitContactMail() {
    this.refreshTemplateBody();
    // console.log(this.form.value);
    this.contactMail = Object.assign({}, this.form.value);
    this.ws.setBusy(true);
    this.ms.sendMail(this.contactMail).subscribe({
      next: () => {
        /* this.ts.get('CONTACT.SendSuccess').subscribe((res: string) => {
          this.toastr.info(res);
        }); */
        console.log('next');
      },
      error: () => {
        /* this.ts.get('CONTACT.SendFailed').subscribe((res: string) => {
          this.toastr.error(res);
          
        }); */
        console.log('error');
        this.ws.setBusy(false);
      },
      complete: () => {
        this.ws.setBusy(false);
        this.permissionForm.reset();
        console.log('complete');
      },
    });
  }

  /* setActivePoll(poll: Poll | undefined) {
    this.activePoll = undefined;

    setTimeout(() => {
      this.activePoll = poll;
    }, 100);
  } */

  handleElectionCreate(candidatesInitial: ICandidatesInitial) {
    this.busyWeb3 = true;
    this.ws.setBusy(this.busyWeb3);
    this.es.createElection(candidatesInitial);
  }

  /* handlePollVote(pollVoted: PollVote) {
    this.ps.vote(pollVoted.id, pollVoted.vote);
  } */
}
