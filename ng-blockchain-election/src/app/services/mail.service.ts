import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IContactmail } from '../models/contactmail';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  baseUrl = environment.apiUrl + 'account/';

  constructor(private http: HttpClient) {}

  sendMail(contactMail: IContactmail) {
    return this.http.post(this.baseUrl + 'contactmail', contactMail);
  }
}
