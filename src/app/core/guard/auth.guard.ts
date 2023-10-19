import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AdminService } from '../services/admin.service';

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
        var userRole = this.authService.getRole();
        if(auth && userRole == route.data["roles"] || userRole == "superadmin"){
          return true;
        }

        this.authService.redirectUrl = "dashboard";
          
        this.router.navigate(["login"]);
        return false;
        
      }))
  }  
}
