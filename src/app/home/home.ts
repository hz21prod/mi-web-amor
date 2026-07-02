import { Component, inject, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

type TimelineBlock =
  | { type: 'text'; content: string }
  | { type: 'heading'; content: string }
  | { type: 'image'; src: string; caption?: string }
  | { type: 'gallery'; images: string[] }
  | { type: 'rich'; content: string };

interface TimelineEvent {
  title: string;
  revealed: boolean;
  date?: string;
  blocks: TimelineBlock[];
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
  selector: 'app-home',
  imports: [FontAwesomeModule, FaIconComponent, CommonModule, RouterLink],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements AfterViewInit {
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
    {
      title: '💕 08/02/2026',
      revealed: false,
      blocks: [
        { type: 'heading', content: 'Cuando todo comenzó' },
        { type: 'text', content: 'Estaba nervioso, no porque fueras a decirme que no, si no porque, cuando algo te importa, te sientes así innevitablemente.' },
        { type: 'text', content: 'Quería que fuera un lugar especial y tener un regalo para acordarnos de ese día. Por eso escogí un Lego, algo sencillo y para hacer juntos. Creo que no pude escoger mejor.' },
        { type: 'image', src: 'assets/flores-salir.jpeg', caption: 'El primer Lego de muchos' },
        { type: 'text', content: 'Así comenzó nuestra historia, desde la playa de San Lorenzo hasta todo el mundo.' }
      ]
    },
    {
      title: 'San Valentín',
      date: '14/02/2026',
      revealed: false,
      blocks: [
        { type: 'heading', content: 'El primero de muchos' },
        { type: 'text', content: 'Una semana después estábamos celebrando San Valentín, el primero para mí junto a alguien.' },
        { type: 'text', content: 'Fue perfecto, el fin de semana que pasamos juntos, los regalos, pero, sobre todo, tu compañía. Me haces sentir especial Jess, y siento que contigo estoy en mi lugar ideal.' },
        { type: 'image', src: 'assets/san-valentin.jpeg' }
      ]
    },
    {
      title: '🌍 El primer viaje',
      date: '02/04/2026',
      revealed: false,
      blocks: [
        { type: 'heading', content: 'De viaje a Cantabria' },
        { type: 'text', content: '¡Y dos meses después ya estábamos viajando! El señor con la cámara, el hotel con el jacucci, El Capricho de Gaudí...' },
        { type: 'text', content: 'Fue un viaje pequeño, íntimo, sin prisas, y me encantó. Quiero seguir haciendo viajes contigo, recorrer el mundo con la persona a la que se lo daría.' },
        { type: 'gallery', images: [
          'assets/san-vicente.jpeg',
          'assets/comillas.jpeg',
          'assets/paisano-santillana.jpeg'
        ] }
      ]
    },
    {
      title: '✨ El día que te dije todo',
      date: '10/06/2026',
      revealed: false,
      blocks: [
        { type: 'heading', content: 'Cuando las palabras no alcanzaban' },
        { type: 'text', content: 'Había un momento que llevaría guardado en mi pecho durante un tiempo. Necesitaba que supieras exactamente lo que significas para mí.' },
        { type: 'text', content: 'Te llevé a nuestro lugar especial, bajo las estrellas, y dejé que mi corazón hablara por mí. Te conté cómo cambió todo desde el momento en que te conocí.' },
        { type: 'gallery', images: [
          'assets/sushi.jpeg',
          'assets/san-juan.jpeg',
          'assets/fiestas-brana-cara.jpeg'
        ] },
        { type: 'text', content: 'Viste las lágrimas en mis ojos porque no son de tristeza, sino de la abrumadora felicidad de tenerte. De saber que compartimos algo verdadero y profundo.' },
        { type: 'text', content: 'Cuando dijiste que sentías lo mismo, el mundo se detuvo. Era el momento más puro, más honesto, más NUESTRO que jamás haya vivido. 💘' }
      ]
    },
    {
      title: '🎉 Celebrando cada día',
      revealed: false,
      blocks: [
        { type: 'heading', content: 'Pequeños detalles, grandes significados' },
        { type: 'text', content: 'No necesitamos fechas especiales para celebrarte. Cada día contigo es un regalo que no doy por sentado.' },
        { type: 'gallery', images: [
          'assets/sushi.jpeg',
          'assets/san-juan.jpeg',
          'assets/fiestas-brana-cara.jpeg'
        ] },
        { type: 'text', content: 'Desayunar contigo, escuchar tus historias, bromear sin parar, caminar sin destino... Todo es especial cuando estás tú.' },
        { type: 'text', content: 'La vida no son solo los grandes momentos. Son estos, los pequeños, los que compartimos en la intimidad de nuestro amor.' },
        { type: 'text', content: 'Eres mi favorito. Siempre serás mi favorito. 🌹' }
      ]
    }
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
    '💑 Quiero envejcer contigo',
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
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.daysTogether.set(diffDays);
  }

  checkSecretCode(event: KeyboardEvent) {
    if ((event.target as HTMLInputElement).value === '23') {
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
