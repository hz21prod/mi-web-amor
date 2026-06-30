import { Component, inject, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faEnvelope, faStar, IconDefinition, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

interface StorySection {
  icon: IconDefinition;
  heading: string;
  text: string;
}

interface TimelineEvent {
  title: string;
  description: string;
  revealed: boolean;
}

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  emoji: string;
}

interface BucketListItem {
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FontAwesomeModule, FaIconComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements AfterViewInit {
  private readonly faIconLibrary: FaIconLibrary = inject(FaIconLibrary);

  daysTogether = signal<number>(0);
  isNight = signal<boolean>(false);
  isUnlocked = signal<boolean>(false);
  secretCode = signal<string>('');
  currentMessage = signal<string>('');
  isEnvelopeOpen = signal<boolean>(false);
  bucketListItems = signal<BucketListItem[]>([]);

  faLock = faLock;
  faUnlock = faUnlock;

  sections: StorySection[] = [
    { icon: faHeart,    heading: 'Capítulo 1', text: 'Texto del capítulo 1...' },
    { icon: faStar,     heading: 'Capítulo 2', text: 'Texto del capítulo 2...' },
    { icon: faEnvelope, heading: 'Capítulo 3', text: 'Texto del capítulo 3...' },
  ];

  timelineEvents: TimelineEvent[] = [
    { title: '💕 Primera cita', description: 'El día que nos conocimos...', revealed: false },
    { title: '🌍 Primer viaje', description: 'Nuestro primer viaje juntos...', revealed: false },
    { title: '🏠 Nuevo inicio', description: 'Un nuevo capítulo juntos...', revealed: false },
    { title: '✨ Momento especial', description: 'Aquel día que cambió todo...', revealed: false },
  ];

  randomMessages: string[] = [
    '💕 Te amo más cada día que pasa',
    '✨ Eres lo mejor que me pasó',
    '🌙 Duermo soñando contigo',
    '☀️ Despiertas toda mi felicidad',
    '🎵 Eres la canción de mi corazón',
    '🌹 Mi amor por ti no tiene fin',
    '💘 Cada momento contigo es especial',
    '🦋 Me transformaste en mejor persona',
    '🌟 Eres mi luz en la oscuridad',
    '💑 Quiero envejecer contigo',
  ];

  quizQuestions: QuizQuestion[] = [
    { question: '¿Quién tarda más en arreglarse?', correctAnswer: 'ella', emoji: '💄' },
    { question: '¿Quién cocina mejor?', correctAnswer: 'yo', emoji: '👨‍🍳' },
    { question: '¿Quién es más impuntual?', correctAnswer: 'ella', emoji: '⏰' },
  ];

  loveLetterText = `
    Mi amor,

    Cada día contigo es un regalo que nunca esperé tener.
    Tu sonrisa ilumina mis días más oscuros,
    y tu presencia hace que todo sea posible.

    No hay palabras suficientes para describir
    lo que sientes en mi corazón.
    Eres mi mejor amiga, mi confidente, mi todo.

    Te prometo amarte todos los días de mi vida,
    en las buenas y en las malas,
    ahora y siempre.

    Por siempre tuyo,
    ❤️
  `;

  constructor() {
    this.faIconLibrary.addIcons(faHeart, faEnvelope, faStar, faLock, faUnlock);
    this.calculateDaysTogether();
    this.checkTimeOfDay();
    this.loadBucketList();
  }

  private checkTimeOfDay() {
    const hour = new Date().getHours();
    this.isNight.set(hour > 18 || hour < 6);
  }

  private calculateDaysTogether() {
    const startDate = new Date('2026-02-08');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.daysTogether.set(diffDays);
  }

  checkSecretCode(event: KeyboardEvent) {
    if ((event.target as HTMLInputElement).value === '2208') {
      this.isUnlocked.set(true);
      setTimeout(() => {
        (event.target as HTMLInputElement).value = '';
        this.secretCode.set('');
      }, 500);
    }
  }

  revealMemory(event: TimelineEvent) {
    event.revealed = true;
  }

  showRandomMessage() {
    const randomIndex = Math.floor(Math.random() * this.randomMessages.length);
    const message = this.randomMessages[randomIndex];
    this.currentMessage.set(message);

    setTimeout(() => {
      gsap.from('.message-box', {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'back.out'
      });
    }, 0);

    setTimeout(() => {
      this.currentMessage.set('');
    }, 4000);
  }

  toggleEnvelope() {
    this.isEnvelopeOpen.set(!this.isEnvelopeOpen());
  }

  showSurprise() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffb7b2', '#ffdac1', '#e2f0cb']
    });
  }

  answerQuiz(question: QuizQuestion, answer: string) {
    if (answer.toLowerCase() === question.correctAnswer.toLowerCase()) {
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ['#FFD700', '#FFA500']
      });
      alert('¡Correcto! 🎉');
    } else {
      alert('¡Intenta de nuevo! 💭');
    }
  }

  toggleBucketItem(item: BucketListItem) {
    item.completed = !item.completed;
    this.saveBucketList();
  }

  private loadBucketList() {
    const saved = localStorage.getItem('bucketList');
    if (saved) {
      this.bucketListItems.set(JSON.parse(saved));
    } else {
      this.bucketListItems.set([
        { text: 'Viajar juntos a París', completed: false },
        { text: 'Cumplir nuestros sueños juntos', completed: false },
        { text: 'Crear recuerdos inolvidables', completed: false },
        { text: 'Apoyarnos siempre', completed: false },
        { text: 'Reír hasta no poder más', completed: false },
      ]);
    }
  }

  private saveBucketList() {
    localStorage.setItem('bucketList', JSON.stringify(this.bucketListItems()));
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
