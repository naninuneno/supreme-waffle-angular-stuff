import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        user => {
          console.log(user);
          console.log('url: ' + this.returnUrl);
          this.router.navigate([this.returnUrl]);
        },
        error => {
          console.log(JSON.stringify(error));
          // wow this is kys material
          if (error.body && error.body.error) {
            this.error = error.body.error;
          } else if (error.error) {
            if (error.error.error) {
              this.error = error.error.error;
            } else {
              this.error = error.error;
            }
          } else {
            this.error = 'An unexpected error occurred';
          }
          if (this.error === 'Unauthorized') {
            this.error = 'Username or password is incorrect';
          }

          this.loading = false;
        });
  }
}
