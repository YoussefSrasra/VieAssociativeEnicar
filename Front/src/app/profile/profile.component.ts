import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { UserProfile, Filiere, Formation, Niveau, Sexe } from './models/profile.model';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';


@Component({
  standalone: true,  // <-- Add this
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: UserProfile;
  isFirstLogin: boolean;
  isLoading = true;
  showCurrentPassword = false;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;
  formModified = false;
  filiereOptions = Object.values(Filiere);
  formationOptions = Object.values(Formation);
  niveauOptions = Object.values(Niveau);
  sexeOptions = Object.values(Sexe);

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadProfile();
    this.profileForm.valueChanges.subscribe(() => {
      this.formModified = this.profileForm.dirty;
    });
  }

  createForm(): void {
    this.profileForm = this.fb.group({
      nom: [''],
      prenom: [''],
      username: [{value: '', disabled: true}],
      email: [''],
      cin: [null],
      filiere: [null],
      niveau: [null],
      sexe: [null],
      formation: [null],
      photo: [null],
      currentPassword: [''],  // Add this for password change verification
      password: [''],
      confirmPassword: ['']
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password').value;
    const confirmPassword = g.get('confirmPassword').value;
    
    if (password || confirmPassword) {
      return password === confirmPassword ? null : {'mismatch': true};
    }
    return null;
  }

  loadProfile(): void {
    this.profileService.getCurrentUser().subscribe(
      (profile) => {
        this.userProfile = profile;
        this.isFirstLogin = profile.firstLogin;
        this.profileForm.patchValue({
          nom: profile.nom,
          prenom: profile.prenom,
          username: profile.username,
          email: profile.email,
          cin: profile.cin,
          filiere: profile.filiere,
          niveau: profile.niveau,
          sexe: profile.sexe,
          formation: profile.formation,
          photo: profile.photo
          // DO NOT patch password fields
      });
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading profile', error);
        this.isLoading = false;
      }
    );
  }

  onFileChange(event): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 7 * 1024 * 1024) {
        alert('File size exceeds 7MB limit');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Update both the form value AND the displayed image
        const base64Image = e.target.result.split(',')[1];
        this.profileForm.patchValue({
          photo: base64Image
        });
        
        // Directly update the displayed image
        this.userProfile.photo = base64Image;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    // First login validation (all fields required)
    if (this.isFirstLogin) {
      const requiredFields = ['nom', 'prenom', 'email', 'cin', 'filiere', 'niveau', 'sexe', 'formation', 'password'];
      for (const field of requiredFields) {
        if (!this.profileForm.get(field).value) {
          alert(`${field} is required for first login`);
          return;
        }
      }
    }

    this.isSubmitting = true;
    const formData = this.profileForm.getRawValue();

    // Password handling for existing users
    if (!this.isFirstLogin) {
      const { currentPassword, password, confirmPassword } = formData;


      // If password fields are empty, remove them (keep existing password)
      if (!password && !confirmPassword) {
        delete formData.password;
        delete formData.confirmPassword;
        delete formData.currentPassword;
      } 
      if (password || confirmPassword) {
        /*if (!currentPassword) {
          alert('Vous devez entrer votre mot de passe actuel pour le changer');
          return;
        }*/
          
        if (password !== confirmPassword) {
          alert('Les nouveaux mots de passe ne correspondent pas');
          return;
        }
        if (currentPassword === password) {
          alert('Le nouveau mot de passe doit être différent de l\'ancien mot de passe');
          return;
        }
      }
    }

    // Remove confirmPassword before sending
    const {confirmPassword: _, ...profileData} = formData;

    const update$ = this.isFirstLogin 
      ? this.profileService.completeProfile(profileData)
      : this.profileService.updateProfile(profileData);

    update$.subscribe({
      next: (updatedProfile) => {
        this.userProfile = updatedProfile;
        this.isFirstLogin = false;
        this.isSubmitting = false;
        alert('Profile updated successfully!');
        this.router.navigate(['dashboard/default']);
      },
      error: (error) => {
        console.error('Update error:', error);
        this.isSubmitting = false;
        alert('Update failed: ' + (error.error?.message || error.message));
      }
    });
}

togglePasswordVisibility(field: string): void {
  if (field === 'currentPassword') {
    this.showCurrentPassword = !this.showCurrentPassword;
  } else if (field === 'password') {
    this.showPassword = !this.showPassword;
  } else if (field === 'confirmPassword') {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}

  // Add this method to validate fields
  validateFields(): boolean {
    if (this.isFirstLogin) {
      const requiredFields = ['nom', 'prenom', 'email', 'cin', 'filiere', 'niveau', 'sexe', 'formation', 'password'];
      return requiredFields.every(field => !!this.profileForm.get(field).value);
    }
    return true;
  }
  checkUnsavedChanges(): void {
    if (this.formModified) {
      if (confirm('Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?')) {
        this.router.navigate(['dashboard/default']); // Or use Location.back()
      }
    } else {
      this.router.navigate(['dashboard/default']); // Or use Location.back()
    }
  }
    @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.formModified) {
      event.preventDefault();
      event.returnValue = 'You have unsaved changes!';
    }
  }
}