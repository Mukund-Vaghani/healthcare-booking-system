import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm: FormGroup;
  submitted = false;
  // registerControls: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private user:AuthService){
    this.registrationForm = this.formBuilder.group({
      fname:['',Validators.required],
      lname:['',Validators.required],
      email:['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      password:['',[Validators.required,Validators.pattern('^[a-zA-Z]+$')]],
      role:['',Validators.required],
      date_of_birth:['',Validators.required],
      address:['',Validators.required],
      speciality:['']
    })

    this.registrationForm.get('role')?.valueChanges.subscribe((role) => {
      if (role === 'doctor') {
        this.registrationForm.get('speciality')?.setValidators(Validators.required)
      } else {
        this.registrationForm.get('speciality')?.clearValidators();
      }
      this.registrationForm.get('speciality')?.updateValueAndValidity();
    })
  }

  

  get registerControls(){
    return this.registrationForm.controls;
  }

  signUp(data:any):void{
    console.log(data);
  }
  
  
  submitForm(){
    this.submitted = true;
    if(this.registrationForm.valid){
      console.log('valid',this.registrationForm.value)
      this.user.userSignUp(this.registrationForm.value)
    }else{
      console.log('invalid')
    }
  }

  ngOnInit(): void {
    this.user.reloadRegister();
  }
}
