import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent {
  minDate: any;
  bookAppointment : FormGroup;
  submitted = false;
  available = false;
  doctorList:any;

  constructor (private fb:FormBuilder, private router:Router, private user:AuthService) { 
    this.bookAppointment = this.fb.group({
      date:['',Validators.required,],
      appointment_time: ['', Validators.required],
      // end_time: ['', Validators.required],
    })
    
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  get bookAppointmentControls(){
    return this.bookAppointment.controls;
  }
  
  doctor:any;
  handleForm() {
    this.submitted = true;
    
    if(this.bookAppointment.valid){
      this.user
      this.available = true
        this.user.checkAvailibility(this.bookAppointment.value).subscribe((response)=>{
          this.doctor = response
        });
    }else{
      console.log('invalid');
    }
  }

  AppointmentBooking(data:any){

  }

  ngOnInit(){
    // this.user.doctorList().subscribe((response)=>{
    //     this.doctorList = response;
    // });
  }
}
