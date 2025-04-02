
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreationClubComponent } from "../creationclub/creationclub.component"; 

@Component({
  selector: 'app-accueil',
  imports: [RouterModule, CreationClubComponent],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {

}
