import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { EntretienService } from './entretien.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entretiens',
  imports: [CommonModule, FormsModule],
  templateUrl: './entretiens.component.html',
  styleUrl: './entretiens.component.scss'
})


export class EntretiensComponent implements OnInit {
  entretiens: any[] = [];

  constructor(private entretienService: EntretienService) { }

  ngOnInit(): void {
    this.loadEntretiens();
  }

  loadEntretiens(): void {
    this.entretienService.getEntretiens().subscribe({
      next: (data) => this.entretiens = data,
      error: (err) => console.error('Erreur:', err)
    });
  }

  saveEntretien(entretien: any): void {
    this.entretienService.updateEntretien(entretien.id, entretien).subscribe({
      next: () => alert('Modifications sauvegardées!'),
      error: (err) => console.error('Erreur:', err)
    });
  }
}