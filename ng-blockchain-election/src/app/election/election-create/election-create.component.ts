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
  contractReady = false;

  @Output() electionCreated: EventEmitter<ICandidatesInitial> =
    new EventEmitter();

  constructor(private fb: UntypedFormBuilder, private ws: Web3Service) {
    this.ws.isContractReady$.subscribe((result) => {
      this.contractReady = result || false;
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
      nameCandidate1: 'Kamala Harris',
      imageCandidate1: 'https://shorturl.at/92kSq',
      nameCandidate2: 'Donald Trump',
      imageCandidate2: 'https://shorturl.at/uKwGI',
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

    this.ws.setContractReady(false);
    this.electionCreated.emit(formData);
  }
}
