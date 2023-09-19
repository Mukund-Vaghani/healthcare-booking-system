import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-add-availability',
  templateUrl: './add-availability.component.html',
  styleUrls: ['./add-availability.component.css']
})
export class AddAvailabilityComponent {

  minDate: any;
  availabilityForm : FormGroup;
  submitted = false;

  constructor (private fb:FormBuilder, private router:Router, private user:AuthService) { 
    this.availabilityForm = this.fb.group({
      date:['',Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required]
    })
    
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  get availabilityControls(){
    return this.availabilityForm.controls;
  }
  
  handleForm() {
    this.submitted = true;
    
    if(this.availabilityForm.valid){
      console.log('valid');
      this.user.addAvailability(this.availabilityForm.value)
    }else{
      console.log('invalid');
    }
  }

  ngOnInit(): void {
    // this.user.reloadLogin();
    // this.user.doctorList();
  }

}

