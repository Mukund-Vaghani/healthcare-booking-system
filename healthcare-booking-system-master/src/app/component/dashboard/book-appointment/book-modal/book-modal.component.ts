import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-book-modal',
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.css']
})
export class BookModalComponent {
  @Input() id:any; time:any; date:any;
  reasonForm:FormGroup
  submitted = false;

  formvalue:any
  
  constructor(public activeModal: NgbActiveModal, private user: AuthService, private fb:FormBuilder ) {
    this.reasonForm = this.fb.group({
      reason:['',Validators.required]
    })
  }

  get reasonControl(){
    return this.reasonForm.controls;
  }

  submitForm(data:any,date:any,time:any) {
    this.submitted = true;
    if(this.reasonForm.valid){
      this.formvalue= this.reasonForm.value
      this.formvalue.doctor_id = data
      this.formvalue.appointment_date = date
      this.formvalue.appointment_time = time
      this.user.bookAppointment(this.formvalue);
      this.activeModal.dismiss()
    }else{
      console.log('invalid');
    }
  }

}
