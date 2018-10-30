import {Component, NgZone, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export class CommonComponent implements OnInit {
  isLoggedIn = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    console.log('on init');
    this.authenticationService.getLoggedInState()
      .then(res => {
        console.log('Is logged in?: ' + res);
        this.isLoggedIn = res;
      });
  }

  onClick() {
    console.log('Log out attempted');
    this.authenticationService.logout()
      .pipe(first())
      .subscribe(
        () => window.location.href = '/login');
  }
}
