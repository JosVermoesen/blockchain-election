import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { ethers } from 'ethers';
import { ICandidatesInitial } from 'src/app/models/candidatesInitial';

import { Web3Service } from 'src/app/services/web3.service';


@Component({
  selector: 'app-election-create',
  templateUrl: './election-create.component.html',
})
export class ElectionCreateComponent {
  Candidates: UntypedFormGroup;
  busyWeb3 = false;

  @Output() electionCreated: EventEmitter<ICandidatesInitial> =
    new EventEmitter();

  constructor(private fb: UntypedFormBuilder, private ws: Web3Service) {
    this.ws.isWeb3Busy$.subscribe((isBusy) => {
      this.busyWeb3 = isBusy || false;
    });

    this.Candidates = this.fb.group({
      nameCandidate1: this.fb.control(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(32),
      ]),
      imageCandidate1: this.fb.control(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(32),
      ]),
      nameCandidate2: this.fb.control(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(32),
      ]),
      imageCandidate2: this.fb.control(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(32),
      ]),
    });
  }

  example() {
    this.Candidates.patchValue({
      nameCandidate1: 'Joe Biden',
      imageCandidate1: 'https://shorturl.at/W3Lji',
      nameCandidate2: 'Donald Trump',
      imageCandidate2: 'https://shorturl.at/ysx0p',
    });
  }

  submitForm() {
    const candidateNames = [
      ethers.encodeBytes32String(this.Candidates.get('nameCandidate1')?.value),
      ethers.encodeBytes32String(this.Candidates.get('nameCandidate2')?.value),
    ];

    const candidateImages = [
      ethers.encodeBytes32String(this.Candidates.get('imageCandidate1')?.value),
      ethers.encodeBytes32String(this.Candidates.get('imageCandidate2')?.value),
    ];

    const formData: ICandidatesInitial = {
      names: candidateNames,
      images: candidateImages,
    };

    this.ws.setWeb3Busy(true);
    this.electionCreated.emit(formData);
  }
}
