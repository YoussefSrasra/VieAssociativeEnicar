
import { Component, OnInit , HostListener  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ParticipantService } from '../services/participant.service';
import { NgForm } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CreationClubComponent } from "../creationclub/creationclub.component";
import { EventLaunchService } from '../services/event-launch.service';
import {ClubAccueilComponent} from 'src/app/clubaccueil/clubaccueil.component';



@Component({
  selector: 'app-accueil',
  imports: [RouterModule, CreationClubComponent  , FormsModule,CommonModule,ClubAccueilComponent,FormsModule,MatToolbarModule,MatButtonModule,MatIconModule,MatMenuModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent implements OnInit {
  activeSection: string = 'hero'; // Section active par défaut

  latestEvent: any = null; // Remplacez upcomingEvents
  isLoading = true;
  formData: any = {};

  constructor(private eventService: EventLaunchService ,    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    this.loadLatestEvent();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const sections = ['hero', 'about', 'services'];
    const scrollPosition = window.scrollY + 100; // Ajustez (+100px pour la hauteur de la navbar)

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          this.activeSection = section;
          break;
        }
      }
    }
  }

  loadLatestEvent(): void {
    this.eventService.getLatestEvent().subscribe({
      next: (event) => {
        this.latestEvent = event;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isLoading = false;
      }
    });
  }
  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.participantService.registerParticipant(this.formData).subscribe({
        next: (response) => {
          alert('Inscription réussie !');
          form.resetForm();
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Une erreur est survenue');
        }
      });
    }
  }
  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


}
