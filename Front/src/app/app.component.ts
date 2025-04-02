// angular import
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { MemberRegistrationComponent } from './features/member-registration/member-registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EventLaunchComponent } from './features/event-launch/event-launch.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, SpinnerComponent
    ,MemberRegistrationComponent ,EventLaunchComponent
  ],
})
export class AppComponent {
  // public props
  title = 'Clubsphere';
}
