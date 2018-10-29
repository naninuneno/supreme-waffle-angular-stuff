import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO - work it so that this isn't called twice (first time from app component onInit)
    // TODO - needs called this second time because async. figure out how to lock state or something
    return this.authenticationService.isAuthenticated()
      .pipe(map(val => {
        const guardAgainstAuth = route.data['reverseAuthCheck'];
        if (guardAgainstAuth) {
          if (val) {
            // if logged in, redirect to index
            this.router.navigate(['/']);
            return false;
          } else {
            return true;
          }
        }

        if (val) {
          return true;
        } else {
          // not logged in so redirect to login page with the return url
          this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
          return false;
        }
      }));
  }
}
