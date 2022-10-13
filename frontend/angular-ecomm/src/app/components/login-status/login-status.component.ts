import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  constructor(private oktaAuthService: OktaAuthStateService, @Inject(OKTA_AUTH)private oktaAuth: OktaAuth) { }

  ngOnInit(): void {
    //subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result)=>{
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    )
  }
  getUserDetails() {
    if(this.isAuthenticated){
      this.oktaAuth.getUser().then(
        (res)=>{
          this.userFullName = res.name as string;
        }
      );


    }
  }

  logout(){
    //terminate session with okta and remove current tokens
    this.oktaAuth.signOut();
  }

}
