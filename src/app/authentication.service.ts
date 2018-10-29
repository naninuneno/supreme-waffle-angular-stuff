import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

const apiUrl = 'http://localhost:3000';
const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});
const options = {headers: headers, withCredentials: true};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLoggedIn = false;

  constructor(private http: HttpClient) {
  }

  getLoggedInState() {
    return this.isLoggedIn;
  }

  // expected to be set by base app component
  setLoggedInState(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;
  }

  login(username: string, password: string) {
    const resourceUrl = `${apiUrl}/api/login`;
    const body = {
      username: username,
      password: password
    };

    return this.http.post<any>(resourceUrl, body, options)
      .pipe(map(user => {
        if (user) {
          console.log('Successful login');
        } else {
          console.log('Failed login');
        }
      }));
  }

  isAuthenticated() {
    const resourceUrl = `${apiUrl}/api/is_authenticated`;
    return this.http.get<boolean>(resourceUrl, options)
      .pipe(map(res => !!res));
  }

  logout() {
    const resourceUrl = `${apiUrl}/api/logout`;
    return this.http.post<any>(resourceUrl, {}, options)
      .pipe(map(res => true));
  }
}
