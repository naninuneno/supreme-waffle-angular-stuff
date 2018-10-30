import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

const apiUrl = 'http://localhost:3000';
const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});
const options = {headers: headers, withCredentials: true};

let authStateLock = true;
let loggedIn = false;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }

  getLoggedInState() {
    return new Promise(function (resolve) {
      (function waitForLockFreed() {
        if (!authStateLock) {
          return resolve(loggedIn);
        }
        setTimeout(waitForLockFreed, 200);
      })();
    });
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
    authStateLock = true;
    const resourceUrl = `${apiUrl}/api/is_authenticated`;
    return this.http.get<boolean>(resourceUrl, options)
      .pipe(map(res => {
        authStateLock = false;
        loggedIn = !!res;
        return !!res;
      }));
  }

  logout() {
    const resourceUrl = `${apiUrl}/api/logout`;
    return this.http.post<any>(resourceUrl, {}, options)
      .pipe(map(() => {
        loggedIn = false;
        return true;
      }));
  }
}
