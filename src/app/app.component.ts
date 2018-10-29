import {Component, OnInit} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Learning some Angular';
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.authenticationService.isAuthenticated()
      .subscribe(res => {
        this.isLoggedIn = !!res;
        this.authenticationService.setLoggedInState(this.isLoggedIn);
      });
  }

  onClick() {
    console.log('Log out attempted');
    this.authenticationService.logout()
      .pipe(first())
      .subscribe(
        res => {
          this.authenticationService.setLoggedInState(false);
          this.router.navigate(['/login']);
        }
      );
  }
}
