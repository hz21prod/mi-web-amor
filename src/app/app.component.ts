import { Component, inject } from '@angular/core';
import { FaIconComponent, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faEnvelope, faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FontAwesomeModule, FaIconComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  heartIcon = faHeart;
  envelopeIcon = faEnvelope;
  starIcon = faStar;

  private readonly faIconLibrary: FaIconLibrary = inject(FaIconLibrary);

  constructor() {
    this.faIconLibrary.addIcons(faHeart, faEnvelope, faStar);
  }
}
