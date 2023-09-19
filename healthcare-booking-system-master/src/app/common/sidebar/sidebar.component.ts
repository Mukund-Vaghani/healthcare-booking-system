import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  role:any=localStorage.getItem('role');

  constructor(private user: AuthService){}

  logout(){
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Logged Out!',
          'You have successfully logged out. Thank you for using our service.',
          'success'
        );
        this.user.userLogOut(localStorage.getItem('UserToken'));
      }
    })
  }

}
