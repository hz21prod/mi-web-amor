import { Component, inject, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faLock,
  faWandMagicSparkles,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Character {
  svg: SafeHtml;
  name: string;
  description: string;
}

interface Quote {
  text: string;
  source: string;
}

interface Scene {
  svg: SafeHtml;
  title: string;
  caption: string;
}

interface StarPoint {
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

interface DustPoint {
  left: number;
  delay: number;
  duration: number;
}

// Ilustraciones propias en SVG inspiradas en la historia (no son fotogramas de las películas).
const ICONS = {
  hat: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M18 78 Q18 42 50 32 Q82 42 82 78 Q50 90 18 78 Z"/><path d="M33 46 Q46 18 53 10 Q60 16 49 28 Q42 38 33 46 Z"/><path d="M53 22 Q74 8 90 17 Q79 22 70 29 Q60 32 53 22 Z"/><circle cx="49" cy="30" r="4.5"/></svg>`,
  quill: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M88 8 C62 12 30 38 16 76 L8 92 L24 83 C56 68 80 40 92 12 Z"/><path d="M18 74 L46 47" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  fairy: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M42 34 Q14 18 8 44 Q30 46 43 41 Z" opacity="0.9"/><path d="M58 34 Q86 18 92 44 Q70 46 57 41 Z" opacity="0.9"/><circle cx="50" cy="26" r="8.5"/><ellipse cx="50" cy="48" rx="8" ry="15"/><path d="M45 60 L38 78" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M55 60 L62 78" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="28" cy="66" r="1.6"/><circle cx="22" cy="74" r="1.1"/><circle cx="33" cy="82" r="1.3"/></svg>`,
  ship: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M8 64 L92 64 L78 84 L22 84 Z"/><rect x="48.5" y="14" width="3" height="52"/><path d="M51 19 L82 34 L51 46 Z"/><path d="M64 24 L70 33 M70 24 L64 33" stroke="var(--np-night-1,#0b132b)" stroke-width="2" stroke-linecap="round"/><circle cx="67" cy="28.5" r="3.4" fill="var(--np-night-1,#0b132b)"/></svg>`,
  hook: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><rect x="52" y="10" width="16" height="16" fill="currentColor" stroke="none"/><path d="M60 26 L60 58 Q60 80 38 80 Q20 80 20 62"/></svg>`,
  crocodile: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M4 56 Q18 40 44 46 L92 39 L86 50 L96 56 L86 61 L92 71 L44 64 Q18 70 4 56 Z"/><circle cx="60" cy="52" r="11" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M60 52 L60 45 M60 52 L66 54" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  island: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M8 68 Q30 48 50 60 Q70 48 92 68 Q70 86 50 80 Q30 86 8 68 Z"/><rect x="33.5" y="30" width="3" height="30"/><path d="M35 30 Q18 24 12 35 M35 30 Q52 24 58 35 M35 30 Q34 14 23 18 M35 30 Q36 14 47 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
  needle: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><line x1="18" y1="82" x2="80" y2="20"/><circle cx="83" cy="17" r="6"/><path d="M18 82 Q6 70 12 53 Q24 58 18 82" fill="none"/></svg>`,
  lostboys: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M14 62 Q14 34 31 34 Q48 34 48 62 Z" opacity="0.85"/><path d="M36 68 Q36 28 54 28 Q72 28 72 68 Z"/><path d="M58 62 Q58 38 76 38 Q94 38 94 62 Z" opacity="0.85"/></svg>`,
  mermaid: `<svg viewBox="0 0 100 100" fill="currentColor"><ellipse cx="46" cy="30" rx="9" ry="11"/><path d="M37 40 Q48 56 37 72 Q58 78 63 58 Q68 42 52 42 Z"/><path d="M58 58 Q84 52 90 68 Q73 74 62 68 Q53 65 58 58 Z"/><path d="M30 24 Q38 16 46 22" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
  star: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 4 L58 40 L96 50 L58 60 L50 96 L42 60 L4 50 L42 40 Z"/></svg>`,
  darlingWindow: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M20 92 L20 34 L50 10 L80 34 L80 92 Z" fill="none" stroke="currentColor" stroke-width="3"/><line x1="50" y1="20" x2="50" y2="92" stroke="currentColor" stroke-width="2.5"/><line x1="20" y1="55" x2="80" y2="55" stroke="currentColor" stroke-width="2.5"/></svg>`,
};

const HERO_SKYLINE = `<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice">
    <circle cx="332" cy="38" r="3.4" fill="var(--np-gold)"/>
    <path d="M332 38 L332 24 M332 38 L346 38 M322 28 L332 38 M332 38 L344 28" stroke="var(--np-gold)" stroke-width="1.4"/>
    <g fill="var(--np-night-2)">
      <rect x="0" y="150" width="42" height="50"/>
      <rect x="12" y="128" width="7" height="24"/>
      <rect x="46" y="132" width="32" height="68"/>
      <polygon points="46,132 62,108 78,132"/>
      <rect x="84" y="158" width="52" height="42"/>
      <rect x="140" y="140" width="26" height="60"/>
      <rect x="170" y="165" width="30" height="35"/>
    </g>
    <path d="M40 172 Q160 70 328 40" stroke="var(--np-mint)" stroke-width="1.2" stroke-dasharray="3 6" fill="none" opacity="0.65"/>
    <g fill="var(--np-gold)">
      <circle cx="150" cy="118" r="2.6"/>
      <circle cx="168" cy="108" r="2.2"/>
      <circle cx="186" cy="112" r="2.4"/>
      <circle cx="205" cy="98" r="2"/>
    </g>
  </svg>`;

const SCENES = {
  flight: `<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="200" fill="var(--np-night-1)"/>
    <circle cx="332" cy="38" r="3.4" fill="var(--np-gold)"/>
    <path d="M332 38 L332 24 M332 38 L346 38 M322 28 L332 38 M332 38 L344 28" stroke="var(--np-gold)" stroke-width="1.4"/>
    <g fill="var(--np-night-2)">
      <rect x="0" y="150" width="42" height="50"/>
      <rect x="12" y="128" width="7" height="24"/>
      <rect x="46" y="132" width="32" height="68"/>
      <polygon points="46,132 62,108 78,132"/>
      <rect x="84" y="158" width="52" height="42"/>
      <rect x="140" y="140" width="26" height="60"/>
      <rect x="170" y="165" width="30" height="35"/>
    </g>
    <path d="M40 172 Q160 70 328 40" stroke="var(--np-mint)" stroke-width="1.2" stroke-dasharray="3 6" fill="none" opacity="0.65"/>
    <g fill="var(--np-gold)">
      <circle cx="150" cy="118" r="2.6"/>
      <circle cx="168" cy="108" r="2.2"/>
      <circle cx="186" cy="112" r="2.4"/>
      <circle cx="205" cy="98" r="2"/>
    </g>
  </svg>`,
  lagoon: `<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="200" fill="var(--np-forest-1)"/>
    <circle cx="62" cy="38" r="15" fill="var(--np-gold)" opacity="0.9"/>
    <g fill="var(--np-forest-2)">
      <polygon points="250,130 296,64 340,130"/>
      <polygon points="300,145 328,96 358,145"/>
    </g>
    <path d="M0 152 Q50 142 100 152 T200 152 T300 150 T400 154 V200 H0 Z" fill="var(--np-night-1)" opacity="0.85"/>
    <path d="M118 150 Q129 166 117 182 Q140 187 146 165 Q151 149 134 149 Z" fill="var(--np-mint)" opacity="0.85"/>
    <ellipse cx="106" cy="146" rx="7" ry="8" fill="var(--np-mint)" opacity="0.85"/>
  </svg>`,
  skullRock: `<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="200" fill="var(--np-night-2)"/>
    <circle cx="342" cy="36" r="13" fill="var(--np-gold)"/>
    <path d="M30 132 Q42 84 78 92 Q80 68 60 64 Q78 44 100 62 Q118 54 112 84 Q142 92 132 128 Z" fill="var(--np-night-1)"/>
    <circle cx="66" cy="86" r="7" fill="var(--np-night-2)"/>
    <circle cx="98" cy="82" r="7" fill="var(--np-night-2)"/>
    <g fill="var(--np-forest-2)">
      <polygon points="190,158 350,158 332,180 208,180"/>
      <rect x="258" y="92" width="3" height="68"/>
      <polygon points="261,97 306,116 261,132"/>
    </g>
  </svg>`,
};

const QUOTES: Quote[] = [
  { text: '“Todos los niños, excepto uno, crecen.”', source: 'J. M. Barrie — Peter Pan (novela, 1911)' },
  { text: '“Segunda estrella a la derecha, y todo recto hasta el amanecer.”', source: 'Peter Pan (Disney, 1953)' },
  { text: '“Volar no es más que pensar en cosas alegres y dejar que ellas te levanten en el aire.”', source: 'Peter Pan (Disney, 1953)' },
  { text: '“Morir será una aventura tremendamente divertida.”', source: 'J. M. Barrie — Peter Pan' },
  { text: '“Cada vez que un niño dice «no creo en las hadas», en algún lugar una hada cae muerta.”', source: 'J. M. Barrie — Peter Pan' },
  { text: '“Nunca digas adiós, porque decir adiós significa morir un poquito.”', source: 'J. M. Barrie' },
  { text: '“Solo hace falta fe, confianza... y un poquito de polvo de hada.”', source: 'Peter Pan (Disney, 1953)' },
  { text: '“Nunca Jamás es un lugar minúsculo, del tamaño exacto de una isla, con las aventuras muy juntas entre sí.”', source: 'J. M. Barrie — Peter Pan' },
];

@Component({
  selector: 'app-peter-pan',
  imports: [FaIconComponent, RouterLink],
  standalone: true,
  templateUrl: './peter-pan.html',
  styleUrl: './peter-pan.css'
})
export class PeterPanComponent implements AfterViewInit {
  private readonly sanitizer = inject(DomSanitizer);

  faLock: IconDefinition = faLock;
  faWandMagicSparkles: IconDefinition = faWandMagicSparkles;

  photos = {
    volando: 'assets/peter-pan-volando.jpg',
    silueta: 'assets/peter-pan-silueta.jpg',
    wendy: 'assets/peter-pan-wendy.jpg',
    neverGrowUp: 'assets/peter-pan-never-grow-up.webp',
  };

  private trust(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  heroHat = this.trust(ICONS.hat);
  starIcon = this.trust(ICONS.star);
  heroSkyline = this.trust(HERO_SKYLINE);

  quotes: Quote[] = QUOTES;

  scenes: Scene[] = [
    { svg: this.trust(SCENES.flight), title: 'Vuelo sobre Londres', caption: 'Rumbo a la segunda estrella a la derecha' },
    { svg: this.trust(SCENES.lagoon), title: 'La Laguna de las Sirenas', caption: 'Donde las sirenas cantan bajo la luna' },
    { svg: this.trust(SCENES.skullRock), title: 'Roca Calavera', caption: 'El escondite del Jolly Roger' },
  ];

  characters: Character[] = [
    { svg: this.trust(ICONS.hat), name: 'Peter Pan', description: 'El niño que nunca quiso crecer' },
    { svg: this.trust(ICONS.fairy), name: 'Campanilla', description: 'Un poco de polvo de hadas para volar' },
    { svg: this.trust(ICONS.darlingWindow), name: 'Wendy Darling', description: 'La niña que le cosió la sombra a Peter' },
    { svg: this.trust(ICONS.needle), name: 'Los niños Darling', description: 'Wendy, John y Michael, de Londres a Nunca Jamás' },
    { svg: this.trust(ICONS.lostboys), name: 'Los Niños Perdidos', description: 'Viven en el árbol hueco y nunca crecen' },
    { svg: this.trust(ICONS.ship), name: 'El Jolly Roger', description: 'El barco pirata del Capitán Garfio' },
    { svg: this.trust(ICONS.hook), name: 'Capitán Garfio', description: 'El villano que teme al tic-tac' },
    { svg: this.trust(ICONS.crocodile), name: 'El cocodrilo', description: 'Tic, tac, tic, tac... siempre lo sigue' },
    { svg: this.trust(ICONS.mermaid), name: 'Las Sirenas', description: 'Habitan la laguna y cantan al atardecer' },
    { svg: this.trust(ICONS.island), name: 'El País de Nunca Jamás', description: 'Donde la magia nunca termina' },
  ];

  stars: StarPoint[] = Array.from({ length: 40 }, () => ({
    top: Math.random() * 60,
    left: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 4,
    duration: 2 + Math.random() * 3
  }));

  dust: DustPoint[] = Array.from({ length: 18 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6
  }));

  ngAfterViewInit() {
    gsap.utils.toArray<HTMLElement>('.pp-reveal').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        opacity: 0,
        y: 60,
        duration: 0.9,
        ease: 'power2.out',
      });
    });

    gsap.utils.toArray<HTMLElement>('.pp-reveal-media').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        opacity: 0,
        scale: 0.92,
        duration: 1,
        ease: 'power2.out',
      });
    });

    gsap.utils.toArray<HTMLElement>('.pp-reveal-stagger').forEach((el) => {
      gsap.from(el.children, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
      });
    });

    gsap.to('.np-hero-photo', {
      scrollTrigger: { trigger: '.np-hero', start: 'top top', end: 'bottom top', scrub: true },
      y: 120,
      ease: 'none',
    });
  }
}
