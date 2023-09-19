import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  role:any=localStorage.getItem('role');
  slotData:any
  appointmentCount:any

  constructor(private user: AuthService){}

  ngOnInit(){
    this.user.getSloteData(localStorage.getItem('UserToken')).subscribe((response)=>{
      this.slotData=response
    });

    this.user.getAppointmentCount('').subscribe((response)=>{
      this.appointmentCount = response[0]
    })
  }

  infoData(data:any){
    this.user.getAppointmentCount(data).subscribe((response)=>{
      console.log(response);
    })
  }

}
