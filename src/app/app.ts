import { Component, inject, AfterViewInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { FaIconComponent, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faEnvelope, faStar, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StorySection {
  icon: IconDefinition;
  heading: string;
  text: string;
}

@Component({
  selector: 'app-root',
  imports: [FontAwesomeModule, FaIconComponent, NgFor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  private readonly faIconLibrary: FaIconLibrary = inject(FaIconLibrary);

  sections: StorySection[] = [
    { icon: faHeart,    heading: 'Capítulo 1', text: 'Texto del capítulo 1...' },
    { icon: faStar,     heading: 'Capítulo 2', text: 'Texto del capítulo 2...' },
    { icon: faEnvelope, heading: 'Capítulo 3', text: 'Texto del capítulo 3...' },
  ];

  constructor() {
    this.faIconLibrary.addIcons(faHeart, faEnvelope, faStar);
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
