import { Component, inject, AfterViewInit, signal } from '@angular/core';
import { FaIconComponent, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faEnvelope, faStar, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

interface StorySection {
  icon: IconDefinition;
  heading: string;
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FontAwesomeModule, FaIconComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements AfterViewInit {
  private readonly faIconLibrary: FaIconLibrary = inject(FaIconLibrary);

  daysTogether = signal<number>(0);

  sections: StorySection[] = [
    { icon: faHeart,    heading: 'Capítulo 1', text: 'Texto del capítulo 1...' },
    { icon: faStar,     heading: 'Capítulo 2', text: 'Texto del capítulo 2...' },
    { icon: faEnvelope, heading: 'Capítulo 3', text: 'Texto del capítulo 3...' },
  ];

  constructor() {
    this.faIconLibrary.addIcons(faHeart, faEnvelope, faStar);
    this.calculateDaysTogether();
  }

  private calculateDaysTogether() {
    const startDate = new Date('2024-01-01');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.daysTogether.set(diffDays);
  }

  showSurprise() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffb7b2', '#ffdac1', '#e2f0cb']
    });
  }

  ngAfterViewInit() {
    gsap.from('.hero-title', { opacity: 0, y: -40, duration: 1 });
    gsap.from('.hero-subtitle', { opacity: 0, y: -20, duration: 1, delay: 0.4 });
    gsap.from('.scroll-hint', { opacity: 0, duration: 1, delay: 0.9 });

    gsap.utils.toArray<HTMLElement>('.story-content').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 80%' },
        opacity: 0,
        y: 50,
        duration: 0.8,
      });
    });
  }
}
