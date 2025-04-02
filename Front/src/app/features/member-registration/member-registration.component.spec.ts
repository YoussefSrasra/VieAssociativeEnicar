import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-member-registration',
  templateUrl: './member-registration.component.html',
  styleUrls: ['./member-registration.component.scss'],
  standalone: true,
  imports: [/* vos imports */]
})
export class MemberRegistrationComponent {
  @Input() eventData: any;
  @Output() memberRegistered = new EventEmitter<any>();

  memberForm = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],
    comite: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.memberForm.valid) {
      this.memberRegistered.emit({
        ...this.memberForm.value,
        event_id: this.eventData?.id // Si vous avez un ID d'événement
      });
    }
  }
}
