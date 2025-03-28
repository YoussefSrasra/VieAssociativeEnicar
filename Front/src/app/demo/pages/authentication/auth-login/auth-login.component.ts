// project import
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-auth-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss'
})
/*export class AuthLoginComponent implements OnInit {
  model : any = {};
  getData : boolean;
  constructor(private loginservice:LoginService , private router : Router) { }


  ngOnInit(): void {}
  loginUser(){
    var username = this.model.username;
    var password = this.model.password;
    console.log(username + " "+ password);
    this.loginservice.login(username, password).subscribe((res: boolean) => {
      this.getData = res; // 0 or 1 (though res is typed as boolean)
      
      if (this.getData == true) {
        this.router.navigate(["/dashboard/default"]);
      } else {
        alert("Invalid username/password");
      }
    });
  }
  // public method

  
}*/
export class AuthLoginComponent {
  model = { username: '', password: '' };

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  loginUser() {
    this.loginService.login(this.model.username, this.model.password).subscribe({
      next: (response) => {
        // Save token & role (e.g., in localStorage)
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        
        // Redirect to dashboard
        this.router.navigate(['/dashboard/default']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid username/password');
      }
    });
  }
}
