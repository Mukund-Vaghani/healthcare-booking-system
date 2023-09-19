import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment.development';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user_id: any;
  user_role: any;
  isLoggedIn = new BehaviorSubject<boolean>(false);
  constructor(private router: Router, private toastr: ToastrService) { }

  reloadLogin() {
    if (localStorage.getItem('UserToken')) {
      this.isLoggedIn.next(true);
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  reloadRegister() {
    if (localStorage.getItem('UserToken')) {
      this.isLoggedIn.next(true);
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['/register']);
    }
  }

  // SIGNUP API
  userSignUp(data: any) {
    axios({ method: 'post', url: 'http://localhost:8597/v1/doctors/register', headers: { 'api-key': '20230420', 'Content-Type': 'application/json' }, data: data }).then((response) => {
      if (response.data.code == 1) {
        this.toastr.success(response.data.message, 'Success');
        this.router.navigate(["/login"])
      } else {
        this.toastr.error(response.data.message, 'Error');
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  //LOGIN API
  userLogin(data: any) {
    axios({ method: 'post', url: 'http://localhost:8597/v1/doctors/login', headers: { 'api-key': '20230420', 'Content-Type': 'application/json' }, data: data }).then((response) => {
      if (response.data.code == 1) {
        this.toastr.success(response.data.message, 'Success!');
        this.user_id = response.data.data.id;
        this.user_role = response.data.data.role;
        localStorage.setItem('UserToken', response.data.data.tokens);
        localStorage.setItem('role', response.data.data.role);
        this.isLoggedIn.next(true);
        this.router.navigate(['dashboard']);
      } else {
        this.toastr.error(response.data.message, 'Error!');
      };
    }).catch((error: any) => {
      this.toastr.error(error, 'Error!');
    });
  };

  userDetail(data: any): Observable<any> {
    return new Observable<any>((observer) => {

      axios({ method: 'post', url: 'http://localhost:8597/v1/doctors/getprofile', headers: { 'api-key': '20230420', 'token': data, 'Content-Type': 'application/json' } }).then((response) => {
        if (response.data.code == 1) {
          observer.next(response.data.data)
          observer.complete();
        } else {
          observer.error(response.data.message);
        };
      }).catch((error: any) => {
        this.toastr.error(error, 'Error!');
      });
    })
  }

  //LOG OUT API
  userLogOut(data: any) {
    axios({ method: 'post', url: 'http://localhost:8597/v1/doctors/logout', headers: { 'api-key': '20230420', 'token': data, 'Content-Type': 'application/json' } }).then((response) => {
      if (response.data.code == 1) {
        localStorage.clear();
        // this.toastr.success(response.data.message,'Success!');
        this.router.navigate(["/login"])
      } else {
        this.toastr.error(response.data.message, 'Error!');
      };
    }).catch((error: any) => {
      this.toastr.error(error, 'Error!');
    });
  };

  addAvailability(data: any) {
    data.token = localStorage.getItem('UserToken');
    data.doctor_id = this.user_id
    axios({ method: 'post', url: 'http://localhost:8597/v1/doctors/add_availability_Schedule', headers: { 'api-key': '20230420','token': data.token, 'Content-Type': 'application/json' }, data: data }).then((response) => {
      if (response.data.code == 1) {
        this.toastr.success(response.data.message, 'Success');
        this.router.navigate(["/login"])
      } else {
        this.toastr.error(response.data.message, 'Error');
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  getSloteData(data: any): Observable<any> {
    return new Observable<any>((observer) => {

      axios({ method: 'post', url: 'http://localhost:8597/v1/doctors/get_availability_slote', headers: { 'api-key': '20230420', 'token': data, 'Content-Type': 'application/json' } }).then((response) => {
        if (response.data.code == 1) {
          observer.next(response.data.data)
          observer.complete();
        } else {
          observer.error(response.data.message);
        };
      }).catch((error: any) => {
        this.toastr.error(error, 'Error!');
      });
    })
  }

  checkAvailibility(data: any): Observable<any> {
    return new Observable<any>((observer) => {
      axios({
        method: 'post',
        url: 'http://localhost:8597/v1/doctors/checkavailablity',
        headers: {
          'api-key': '20230420',
          'token': localStorage.getItem('UserToken'),
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
      })
        .then((response) => {
          console.log(response.data)
          if (response.data.code == 1) {
            observer.next(response.data.data);
            observer.complete();
          } else {
            // observer.error(response.data.message);
            observer.next(false);
            observer.complete();
          }
        })
        .catch((error: any) => {
          // this.toastr.error(error, 'Error!');
        });
    });
  }


  bookAppointment(data: any) {
    axios({ method: 'post', url: 'http://localhost:8597/v1/doctors/bookdoctor', headers: { 'api-key': '20230420', 'token': localStorage.getItem('UserToken'), 'Content-Type': 'application/json' },data:data }).then((response) => {
      if (response.data.code == 1) {
        this.toastr.success(response.data.message, 'Success');
        this.router.navigate(["/dashboard"])
      } else {
        this.toastr.error(response.data.message, 'Error');
      }
    }).catch((error) => {
      console.log(error);
    })
  }
}
