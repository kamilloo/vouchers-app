import { Injectable } from '@angular/core';
// import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { EnvService } from './env.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // isLoggedIn = false;
  isLoggedIn = true;
  token = {
   token_type: 'Bearer',
   access_token:  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvbXl2b3VjaGVycy5wbFwvYXBpXC9sb2dpbiIsImlhdCI6MTU4MTg4ODQwOSwiZXhwIjoxNTgxODkyMDA5LCJuYmYiOjE1ODE4ODg0MDksImp0aSI6ImJjbkppcURXMVN0TERERFYiLCJzdWIiOjQsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.bD0YwCjjG-WgyY-QteDRjsm2CVqcUd64hLY5p34-KVk'
  };

  constructor(
      private http: HttpClient,
      // private storage: NativeStorage,
      private env: EnvService
  ) { }

  login(email: String, password: String) {
    return this.http.post(this.env.API_URL + 'api/login',
        {email: email, password: password}
    ).pipe(
        tap(token => {
          // this.storage.setItem('token', token)
          //     .then(
          //         () => {
          //           console.log('Token Stored');
          //         },
          //         error => console.error('Error storing item', error)
          //     );
          this.token = token;
          this.isLoggedIn = true;
          return token;
        }),
    );
  }
  register(fName: String, lName: String, email: String, password: String) {
    return this.http.post(this.env.API_URL + 'api/register',
        {fName: fName, lName: lName, email: email, password: password}
    )
  }
  logout() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.post(this.env.API_URL + 'api/logout', { headers: headers })
        .pipe(
            tap(data => {
              // this.storage.remove("token");
              this.isLoggedIn = false;
              delete this.token;
              return data;
            })
        )
  }
  user() {
      const headers = this.getAuthHeaders();
      return this.http.get<User>(this.env.API_URL + 'api/user', { headers: headers })
        .pipe(
            tap(user => {
              return user;
            })
        )
  }

  getAuthHeaders() {
        return new HttpHeaders({
            'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
        });
  }

    getToken() {

      return (new Promise((resolve, reject) => {
          // executor (the producing code, "singer")
      })).then(() => {
          // this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvbXl2b3VjaGVycy5wbFwvYXBpXC9sb2dpbiIsImlhdCI6MTU4MTg4ODQwOSwiZXhwIjoxNTgxODkyMDA5LCJuYmYiOjE1ODE4ODg0MDksImp0aSI6ImJjbkppcURXMVN0TERERFYiLCJzdWIiOjQsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.bD0YwCjjG-WgyY-QteDRjsm2CVqcUd64hLY5p34-KVk';
          // this.isLoggedIn = true;

      });
    // return this.storage.getItem('token').then(
    //     data => {
    //       this.token = data;
    //       if(this.token != null) {
    //         this.isLoggedIn=true;
    //       } else {
    //         this.isLoggedIn=false;
    //       }
    //     },
    //     error => {
    //       this.token = null;
    //       this.isLoggedIn=false;
    //     }
    // );
  }
}
