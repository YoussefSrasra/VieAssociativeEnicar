import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http : HttpClient) { }
   //getUserDetails(username, password){
    //return this.http.get('http://localhost:8080/api/public/login/'+username+'/'+password);}

    login(username: string, password: string) {
      return this.http.post<{ token: string, role: string }>(
        'http://localhost:8080/api/public/login',
        { username, password }, // JSON body
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
  
}
