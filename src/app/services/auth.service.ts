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
  isLoggedIn = false;
  token: any;

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
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.get<User>(this.env.API_URL + 'api/user', { headers: headers })
        .pipe(
            tap(user => {
              return user;
            })
        )
  }
  getToken() {

      return (new Promise((resolve, reject) => {
          // executor (the producing code, "singer")
      })).then(() => {
          this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvbXl2b3VjaGVycy5wbFwvYXBpXC9sb2dpbiIsImlhdCI6MTU4MTc4OTM0MiwiZXhwIjoxNTgxNzkyOTQyLCJuYmYiOjE1ODE3ODkzNDIsImp0aSI6ImEzdzhwdkNjWEtpc0JMcHkiLCJzdWIiOjQsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.yvtg_EY6gJmjuuN5FO3uVIlrsqPsSVJYhIb12opXnrI';
          this.isLoggedIn = true;

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
