import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule
} from '@angular/forms';

@Component({
  selector: 'app-member-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './member-registration.component.html',
  styleUrls: ['./member-registration.component.scss']
})
export class MemberRegistrationComponent {
  // Solution garantie pour les Inputs
  @Input()
  set eventName(value: string) {
    this._eventName = value || 'Événement sans nom';
  }
  get eventName(): string {
    return this._eventName;
  }
  private _eventName: string = 'Événement sans nom';

  @Input()
  availableCommittees: string[] = [];

  @Output()
  registrationSubmitted = new EventEmitter<any>();

  // Déclaration FORTEMENT typée
  registrationForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      studyLevel: ['', Validators.required],
      committee: ['', Validators.required],
      role: ['member', Validators.required],
      motivation: ['', [Validators.required, Validators.minLength(50)]]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = {
        event: this.eventName,
        ...this.registrationForm.value,
        registrationDate: new Date()
      };
      this.registrationSubmitted.emit(formData);
    }
  }

  // Getters avec vérification stricte
  get firstName(): AbstractControl {
    return this.registrationForm.get('firstName')!;
  }

  get lastName(): AbstractControl {
    return this.registrationForm.get('lastName')!;
  }

  get email(): AbstractControl {
    return this.registrationForm.get('email')!;
  }

  get studyLevel(): AbstractControl {
    return this.registrationForm.get('studyLevel')!;
  }

  get committee(): AbstractControl {
    return this.registrationForm.get('committee')!;
  }

  get motivation(): AbstractControl {
    return this.registrationForm.get('motivation')!;
  }
}
