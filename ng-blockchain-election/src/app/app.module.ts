import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Web3Service } from './blockchain/web3.service';
import { ElectionCreateComponent } from './election-create/election-create.component';
import { ElectionService } from './election-service/election.service';
import { ElectionVoteComponent } from './election-vote/election-vote.component';
import { ElectionComponent } from './election/election.component';

@NgModule({
  declarations: [
    AppComponent,
    ElectionCreateComponent,
    ElectionComponent,
    ElectionVoteComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [ElectionService, Web3Service],
  bootstrap: [AppComponent],
})
export class AppModule {}
