import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from '../../service/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthJeGuard implements CanActivate {

  role: string;

  constructor(private router: Router,private userService: UserService) {
    if(this.userService.getDecodedAccessToken() != null){
      this.getUser();
    }
  }

  public getUser(): void {
    const token = this.userService.getDecodedAccessToken();
    this.role = token.auth;
    console.log('day la role',this.role);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean |
    UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.role === 'ROLE_JE'){
      return false;
    }
    if (localStorage.getItem('auth-token')) {
      // logged in so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/home/'], {queryParams: {returnUrl: state.url}}).then(r =>console.log(r));
    return true;
  }

}
