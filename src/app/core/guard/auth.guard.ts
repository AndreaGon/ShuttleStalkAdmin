import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private firebase: AngularFireAuth,
    private router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authService.loggedIn$.pipe(take(1), map(auth=>{
        console.log(auth)
        if(auth){
          return true;
        }
        this.authService.redirectUrl = "dashboard";

        this.router.navigate(["login"]);
        return false;
      }))

      // return this.authService.loggedIn$.parse(map(auth => {
      //   if (isNullOrUndefined(auth)) {
      //     this.router.navigate(['/login']);
      //     return false;
      //   } else {
      //     return true;
      //   }
      // }));
  }  
}
