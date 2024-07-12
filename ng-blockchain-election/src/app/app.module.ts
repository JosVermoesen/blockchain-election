import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { Web3Service } from './blockchain/web3.service';
import { ElectionComponent } from './election/election.component';
import { ElectionCreateComponent } from './election/election-create/election-create.component';
import { ElectionVoteComponent } from './election/election-vote/election-vote.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    ElectionCreateComponent,
    ElectionComponent,
    ElectionVoteComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [Web3Service],
  bootstrap: [AppComponent],
})
export class AppModule {}
