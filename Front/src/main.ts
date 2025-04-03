import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module'; // À adapter selon ton chemin
import { jwtInterceptor } from './app/jwt.interceptor'; // À adapter selon ton chemin

// Configuration principale de l'application
bootstrapApplication(AppComponent, {
  providers: [
    // (1) HttpClient avec intercepteur JWT
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    
    // (2) Modules traditionnels (si nécessaires)
    importProvidersFrom(
      AppRoutingModule, // Routes
      // Autres modules (ex: BrowserModule, FormsModule) si besoin
    ),

    // (3) Animations (optionnel)
    provideAnimations(),

    // (4) Autres providers...
  ]
}).catch((err) => console.error('Erreur de bootstrap :', err));