import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// type NewType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (newFunction()) {
      console.log(sessionStorage.getItem('session'))

      return true;
    } else {
      // this.router.navigate(['login']);
      console.log(sessionStorage.getItem('session'))

      return false;
    }


    function newFunction() {
      return sessionStorage.getItem('session')?true:false;
    }
  }

}
