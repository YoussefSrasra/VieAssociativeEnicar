import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { UserProfile, Filiere, Formation, Niveau, Sexe } from './models/profile.model';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationStart } from '@angular/router';
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
  
  // Messages d'erreur et de succès
  errorMessage: string = '';
  successMessage: string = '';
  fieldErrors: { [key: string]: string } = {};

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
      this.clearMessages();
    });
    this.router.events.subscribe(event => {
      if (this.isFirstLogin && event instanceof NavigationStart) {
        if (!event.url.includes('/profile')) {
          this.router.navigate(['/profile']);
          this.showErrorMessage('Vous devez compléter votre profil avant de naviguer ailleurs.');
          this.scrollToTop();
        }
      }
    });
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.fieldErrors = {};
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;

    setTimeout(() => this.errorMessage = '', 5000); // Disappears after 5 seconds
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.scrollToTop();
    setTimeout(() => this.successMessage = '', 5000); // Disappears after 5 seconds
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
    this.profileService.getCurrentUser().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.currentRole = profile.role;
        this.isFirstLogin = profile.firstLogin;
        this.initializeFormBasedOnRole(profile);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile', error);
        this.isLoading = false;
        this.showErrorMessage('Erreur lors du chargement du profil. Veuillez réessayer.');
      }
    });
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
        this.showErrorMessage('La taille du fichier dépasse 7MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.showErrorMessage('Type de fichier non supporté. Veuillez uploader une image (JPEG, PNG ou GIF)');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result.split(',')[1];
        this.profileForm.patchValue({ photo: base64Image });
        this.userProfile.photo = base64Image;
        this.formModified = true;
      };
      reader.onerror = () => {
        this.showErrorMessage('Erreur lors de la lecture du fichier');
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.clearMessages();
    
    if (this.isFirstLogin) {
      let requiredFields: string[];

      if (this.currentRole === 'MEMBER') {
        requiredFields = ['nom', 'prenom', 'email', 'cin', 'filiere', 'niveau', 'sexe', 'formation'];
      } else if (this.currentRole === 'ADMIN') {
        requiredFields = ['nom', 'prenom', 'email', 'cin', 'sexe'];
      } else if (this.currentRole === 'MANAGER') {
        requiredFields = ['email'];
      }

      let hasErrors = false;
      this.fieldErrors = {};
      
      requiredFields.forEach(field => {
        if (!this.profileForm.get(field).value) {
          this.fieldErrors[field] = 'Ce champ est obligatoire';
          this.profileForm.get(field).markAsTouched();
          hasErrors = true;
        }
      });

      // Vérification spéciale pour le mot de passe lors du premier login
      if (!this.profileForm.get('password').value) {
        this.fieldErrors['password'] = 'Vous devez définir un mot de passe';
        this.profileForm.get('password').markAsTouched();
        hasErrors = true;
      }

      if (hasErrors) {
        this.showErrorMessage('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }

    this.isSubmitting = true;
    const formData = this.filterDataByRole(this.profileForm.getRawValue());

    if (!this.isFirstLogin) {
      const { currentPassword, password, confirmPassword } = formData;

      if (password || confirmPassword) {
        if (!currentPassword) {
          this.fieldErrors['currentPassword'] = 'Le mot de passe actuel est requis';
          this.profileForm.get('currentPassword').markAsTouched();
          this.isSubmitting = false;
          this.showErrorMessage('Le mot de passe actuel est requis pour changer le mot de passe');
          return;
        }
        
        if (password !== confirmPassword) {
          this.fieldErrors['confirmPassword'] = 'Les mots de passe ne correspondent pas';
          this.profileForm.get('confirmPassword').markAsTouched();
          this.isSubmitting = false;
          this.showErrorMessage('Les mots de passe ne correspondent pas');
          this.scrollToTop();
          return;
        }
        
        if (currentPassword === password) {
          this.fieldErrors['password'] = 'Le nouveau mot de passe doit être différent';
          this.profileForm.get('password').markAsTouched();
          this.isSubmitting = false;
          this.showErrorMessage('Le nouveau mot de passe doit être différent de l\'actuel');
          this.scrollToTop();
          return;
        }
      }
    }

    const {confirmPassword: _, ...profileData} = formData;
    const cleanedData = {};
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined && profileData[key] !== '') {
        cleanedData[key] = profileData[key];
      }
    });
    
    if (!cleanedData['password']) {
      delete cleanedData['currentPassword'];
    }
  
    this.profileService.updateProfile(cleanedData).subscribe({
      next: (updatedProfile) => {
        this.userProfile = updatedProfile;
        this.isFirstLogin = false;
        this.isSubmitting = false;
        this.formModified = false;
        this.showSuccessMessage('Profil mis à jour avec succès!');
        this.scrollToTop();
        
        if (this.isFirstLogin) {
          this.router.navigate(['dashboard/default']);
        }
      },
      error: (error) => {
        console.error('Erreur de mise à jour:', error);
        this.isSubmitting = false;
        
        if (error.status === 400) {
          // Gestion des erreurs de validation du serveur
          if (error.error.errors) {
            Object.keys(error.error.errors).forEach(key => {
              this.fieldErrors[key] = error.error.errors[key];
              this.profileForm.get(key)?.markAsTouched();
            });
            this.showErrorMessage('Veuillez corriger les erreurs dans le formulaire');
            this.scrollToTop();
          } else {
            this.showErrorMessage(error.error.message || 'Erreur lors de la mise à jour du profil');
            this.scrollToTop();
          }
        } else if (error.status === 401) {
          this.showErrorMessage('Mot de passe actuel incorrect');
          this.scrollToTop();
          this.fieldErrors['currentPassword'] = 'Mot de passe incorrect';
          this.profileForm.get('currentPassword').markAsTouched();
        } else {
          this.showErrorMessage('Une erreur est survenue. Veuillez réessayer plus tard.');
          this.scrollToTop();
        }
      }
    });
  }

  private filterDataByRole(formData: any): any {
    const filteredData = { ...formData };
    
    if (this.currentRole !== 'MEMBER') {
      delete filteredData.filiere;
      delete filteredData.niveau;
      delete filteredData.formation;
    }
    
    if (this.currentRole === 'MANAGER') {
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
    if (this.isFirstLogin) {
      this.showErrorMessage('Vous devez compléter votre profil avant de quitter cette page.');
      this.scrollToTop();
      return;
    }

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
  
    if (user.photo.startsWith('data:image/')) {
      return user.photo;
    }
  
    return 'data:image/jpeg;base64,' + user.photo;
  }
  private scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Pour un défilement doux
    });
  }
}