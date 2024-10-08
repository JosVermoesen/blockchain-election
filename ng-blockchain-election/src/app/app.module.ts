import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElectionComponent } from './election/election.component';
import { ElectionCreateComponent } from './election/election-create/election-create.component';
import { ElectionVoteComponent } from './election/election-vote/election-vote.component';
import { AppComponent } from './app.component';
import { Web3Service } from './services/web3.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    ElectionCreateComponent,
    ElectionComponent,
    ElectionVoteComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    Web3Service,
    provideHttpClient(withInterceptorsFromDi()),

    provideToastr({
      positionClass: 'toast-bottom-right',
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
function provideAnimations():
  | import('@angular/core').Provider
  | import('@angular/core').EnvironmentProviders {
  throw new Error('Function not implemented.');
}
