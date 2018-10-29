import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getAll() {
    const apiUrl = 'http://localhost:3000';
    return this.http.get<User[]>(`${apiUrl}/users`);
  }
}
