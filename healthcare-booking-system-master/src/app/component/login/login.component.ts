import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm : FormGroup;
  submitted = false;

  constructor (private fb:FormBuilder, private router:Router, private user:AuthService) { 
    this.loginForm = this.fb.group({
      email:['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      password : ['',[Validators.required,Validators.pattern('^[a-zA-Z]+$')]],
    })
  }

  get loginControl(){
    return this.loginForm.controls;
  }
  
  handlelogin() {
    this.submitted = true;
    if(this.loginForm.valid){
      this.user.userLogin(this.loginForm.value);
      // this.router.navigate(['dashboard'])
    }else{
      console.log('invalid');
    }
  }

  ngOnInit(): void {
    this.user.reloadLogin();
  }
}
