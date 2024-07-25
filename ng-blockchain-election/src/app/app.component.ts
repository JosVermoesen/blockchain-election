import { Component, inject, OnInit } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private toastr = inject(ToastrService);

  showFormStartElection = false;

  canVote = false;
  hasVoted = false;

  permissionForm!: FormGroup;
  form!: FormGroup;
  givePermissionForm!: FormGroup;

  busyWeb3 = false;
  busyMail = false;
  busyContract = false;

  sendEmailCaption = 'Send';
  givePermissionCaption = 'Give Permission';

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
    this.ws.isWeb3Busy$.subscribe((isBusy) => {
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

    this.givePermissionForm = this.fb.group({
      voterAddress: [
        '',
        [
          Validators.required,
          Validators.minLength(42),
          Validators.maxLength(42),
        ],
      ],
    });

    this.ws.chairPersonIsUser().then((result) => {
      this.isChairPerson = result;
    });
    this.chairPersonAddress = await this.ws.call('chairperson');
    this.myAddress = await this.ws.getAccount();

    this.initialized = await this.ws.call('initialized');
    if (this.initialized) {
      this.candidatesArray = await this.es.getCandidates();
      // console.log('candidates', this.candidatesArray);
    }

    this.es.onEvent('CandidatesInitiated').subscribe(() => {
      this.busyWeb3 = false;
      this.ws.setWeb3Busy(this.busyWeb3);
      this.busyContract = false;
      this.refresh();
    });

    this.es.onEvent('GiveRightToVote').subscribe(() => {
      this.busyWeb3 = false;
      this.busyContract = false;
      this.ws.setWeb3Busy(this.busyWeb3);
      this.refresh();
    });

    this.es.onEvent('CandidateVoted').subscribe(() => {
      this.busyWeb3 = false;
      this.busyContract = false;
      this.ws.setWeb3Busy(this.busyWeb3);
      this.refresh();
    });
    this.refresh();
  }

  async refresh() {
    this.canVote = await this.es.canVote(
      '0xc8EdD419894Bb41738f9d1d91dE668b375F2624e'
    );
    console.log(
      '0xc8EdD419894Bb41738f9d1d91dE668b375F2624e canVote: ',
      this.canVote
    );
    this.hasVoted = await this.es.hasVoted(
      '0xc8EdD419894Bb41738f9d1d91dE668b375F2624e'
    );
    console.log(
      '0xc8EdD419894Bb41738f9d1d91dE668b375F2624e hasVoted: ',
      this.hasVoted
    );
    console.log('1 ----------------------------');

    this.canVote = await this.es.canVote(
      '0x6d6CBf5754b33D7Ba0A67C4fb294a2cd267dC6ea'
    );
    console.log(
      '0x6d6CBf5754b33D7Ba0A67C4fb294a2cd267dC6ea canVote: ',
      this.canVote
    );
    this.hasVoted = await this.es.hasVoted(
      '0x6d6CBf5754b33D7Ba0A67C4fb294a2cd267dC6ea'
    );
    console.log(
      '0x6d6CBf5754b33D7Ba0A67C4fb294a2cd267dC6ea hasVoted: ',
      this.hasVoted
    );
    console.log('2 ----------------------------');

    this.canVote = await this.es.canVote(
      '0x8aA106b195F5A21c1eC5a4D78c16D6851cc59640'
    );
    console.log(
      '0x8aA106b195F5A21c1eC5a4D78c16D6851cc59640 canVote: ',
      this.canVote
    );
    this.hasVoted = await this.es.hasVoted(
      '0x8aA106b195F5A21c1eC5a4D78c16D6851cc59640'
    );
    console.log(
      '0x8aA106b195F5A21c1eC5a4D78c16D6851cc59640 hasVoted: ',
      this.hasVoted
    );
    console.log('3 ----------------------------');

    this.canVote = await this.es.canVote(
      '0xa43c75770d2d2e21637F1dc70964D57155656fA8'
    );
    console.log(
      '0xa43c75770d2d2e21637F1dc70964D57155656fA8 canVote: ',
      this.canVote
    );
    this.hasVoted = await this.es.hasVoted(
      '0xa43c75770d2d2e21637F1dc70964D57155656fA8'
    );
    console.log(
      '0xa43c75770d2d2e21637F1dc70964D57155656fA8 hasVoted: ',
      this.hasVoted
    );
    console.log('4 ----------------------------');

    console.log('TODO: refreshing voting data');
  }

  async givePermission() {
    this.busyContract = true;
    this.busyWeb3 = true;
    this.ws.setWeb3Busy(this.busyWeb3);
    console.log(this.givePermissionForm.value.voterAddress);
    await this.es.giveRightToVote(this.givePermissionForm.value.voterAddress);
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
    // console.log(this.form.value);
  }

  sendEmail() {
    this.toastr.info('Mail Sending...');
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
    this.busyMail = true;
    this.ms.sendMail(this.contactMail).subscribe({
      next: () => {},
      error: () => {
        this.toastr.error('Mail not sent!');
        this.busyMail = false;
      },
      complete: () => {
        this.busyMail = false;
        this.permissionForm.reset();
        this.toastr.success('Done!');
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
    this.busyContract = true;
    this.ws.setWeb3Busy(this.busyWeb3);
    this.es.createElection(candidatesInitial);
  }

  vote() {
    alert('TODO: voting');
  }

  /* handlePollVote(pollVoted: PollVote) {
    this.ps.vote(pollVoted.id, pollVoted.vote);
  } */
}
