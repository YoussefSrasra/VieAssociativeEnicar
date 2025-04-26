import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { UserProfile, Filiere, Formation, Niveau, Sexe } from './models/profile.model';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: UserProfile;
  currentRole: string;
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
      email: ['', [Validators.required, Validators.email]],
      cin: [null],
      filiere: [null],
      niveau: [null],
      sexe: [null],
      formation: [null],
      photo: [null],
      currentPassword: [''],
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
        this.currentRole = profile.role;
        this.isFirstLogin = profile.firstLogin;
        this.initializeFormBasedOnRole(profile);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading profile', error);
        this.isLoading = false;
      }
    );
  }

  private initializeFormBasedOnRole(profile: UserProfile): void {
    const formValues: any = {
      username: profile.username,
      email: profile.email,
      photo: profile.photo
    };

    if (this.currentRole === 'MEMBER') {
      formValues.nom = profile.nom;
      formValues.prenom = profile.prenom;
      formValues.cin = profile.cin;
      formValues.filiere = profile.filiere;
      formValues.niveau = profile.niveau;
      formValues.sexe = profile.sexe;
      formValues.formation = profile.formation;
    } 
    else if (this.currentRole === 'ADMIN') {
      formValues.nom = profile.nom;
      formValues.prenom = profile.prenom;
      formValues.cin = profile.cin;
      formValues.sexe = profile.sexe;
    }

    this.profileForm.patchValue(formValues);
  }

  onFileChange(event): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 7 * 1024 * 1024) {
        alert('La taille du fichier dépasse 7MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result.split(',')[1];
        this.profileForm.patchValue({ photo: base64Image });
        this.userProfile.photo = base64Image;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.isFirstLogin && this.currentRole === 'ROLE_MEMBER') {
      const requiredFields = ['nom', 'prenom', 'email', 'cin', 'filiere', 'niveau', 'sexe', 'formation', 'password'];
      for (const field of requiredFields) {
        if (!this.profileForm.get(field).value) {
          alert(`${field} est obligatoire pour la première connexion`);
          return;
        }
      }
    }

    this.isSubmitting = true;
    const formData = this.filterDataByRole(this.profileForm.getRawValue());

    if (!this.isFirstLogin) {
      const { currentPassword, password, confirmPassword } = formData;

      if (password || confirmPassword) {
        if (password !== confirmPassword) {
          alert('Les mots de passe ne correspondent pas');
          this.isSubmitting = false;
          return;
        }
        if (currentPassword === password) {
          alert('Le nouveau mot de passe doit être différent');
          this.isSubmitting = false;
          return;
        }
      }
    }

    const {confirmPassword: _, ...profileData} = formData;

    const update$ = this.isFirstLogin 
      ? this.profileService.completeProfile(profileData)
      : this.profileService.updateProfile(profileData);

    update$.subscribe({
      next: (updatedProfile) => {
        this.userProfile = updatedProfile;
        this.isFirstLogin = false;
        this.isSubmitting = false;
        alert('Profil mis à jour avec succès!');
        this.router.navigate(['dashboard/default']);
      },
      error: (error) => {
        console.error('Erreur de mise à jour:', error);
        this.isSubmitting = false;
        alert('Erreur: ' + (error.error?.message || error.message));
      }
    });
  }

  private filterDataByRole(formData: any): any {
    const filteredData = { ...formData };
    
    if (this.currentRole !== 'ROLE_MEMBER') {
      delete filteredData.filiere;
      delete filteredData.niveau;
      delete filteredData.formation;
    }
    
    if (this.currentRole === 'ROLE_MANAGER') {
      delete filteredData.nom;
      delete filteredData.prenom;
      delete filteredData.cin;
      delete filteredData.sexe;
    }
    
    return filteredData;
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

  checkUnsavedChanges(): void {
    if (this.formModified) {
      if (confirm('Vous avez des modifications non enregistrées. Quitter quand même ?')) {
        this.router.navigate(['dashboard/default']);
      }
    } else {
      this.router.navigate(['dashboard/default']);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.formModified) {
      event.preventDefault();
      event.returnValue = 'Vous avez des modifications non enregistrées';
    }
  }
  formatImage(user: UserProfile | null): string {
    if (!user || !user.photo) {
      return 'assets/images/default-profile.png';
    }
  
    // Check if the photo already starts with "data:image/"
    if (user.photo.startsWith('data:image/')) {
      return user.photo; // Already has the header, return directly
    }
  
    // Otherwise, add the header manually
    return 'data:image/jpeg;base64,' + user.photo;
  }
}