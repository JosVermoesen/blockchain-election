import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Candidates } from '../election-vote/models/types';
import { ethers } from 'ethers';

@Component({
  selector: 'app-election-create',
  templateUrl: './election-create.component.html',
  styleUrls: ['./election-create.component.scss'],
})
export class ElectionCreateComponent {
  Candidates: UntypedFormGroup;

  @Output() electionCreated: EventEmitter<Candidates> = new EventEmitter();

  constructor(private fb: UntypedFormBuilder) {
    this.Candidates = this.fb.group({
      nameCandidate1: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(32),
      ]),
      imageCandidate1: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(32),
      ]),
      nameCandidate2: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(32),
      ]),
      imageCandidate2: this.fb.control('', [
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
      ethers.encodeBytes32String(
        this.Candidates.get('nameCandidate1')?.value
      ),
      ethers.encodeBytes32String(
        this.Candidates.get('nameCandidate2')?.value
      ),
    ];

    const candidateImages = [
      ethers.encodeBytes32String(
        this.Candidates.get('imageCandidate1')?.value
      ),
      ethers.encodeBytes32String(
        this.Candidates.get('imageCandidate2')?.value
      ),
    ];

    const formData: Candidates = {
      names: candidateNames,
      images: candidateImages,
    };
    //console.log('formData', formData);

    this.electionCreated.emit(formData);
  }
}
