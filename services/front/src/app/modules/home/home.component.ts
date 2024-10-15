import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TmdbService } from '../../core/services/tmdb.service';
import { BackdropComponent } from '../../shared/components/backdrop/backdrop.component';
import { HomeCarouselBackdropComponent } from './components/home-carousel/home-carousel-backdrop/home-carousel-backdrop.component';
import { PosterComponent } from '../../shared/components/poster/poster.component';
import { HomeCarouselPostersComponent } from './components/home-carousel/home-carousel-posters/home-carousel-posters.component';
import { NgClass, NgIf } from '@angular/common';
import { StarsComponent } from '../../shared/components/stars/stars.component';
import { HomeMovieRatingComponent } from './components/home-movie-rating/home-movie-rating.component';
import { setTitle } from '../../core/utils/utilities.utils';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MovieListCardComponent } from '../../shared/components/movie-list-card/movie-list-card.component';
import { HomeCarouselComponent } from './components/home-carousel/home-carousel.component';
import { HomeDiscoverComponent } from './components/home-discover/home-discover.component';
import { Movie } from '../../shared/models/movie.model';
import { TabsComponent } from '../../shared/components/tabs/tabs.component';
import { TabComponent } from '../../shared/components/tabs/components/tab/tab.component';
import { StarHoverableComponent } from '../../shared/components/star-hoverable/star-hoverable.component';
import { HomeListsComponent } from './components/home-lists/home-lists.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        BackdropComponent,
        HomeCarouselBackdropComponent,
        PosterComponent,
        HomeCarouselPostersComponent,
        NgClass,
        NgIf,
        StarsComponent,
        HomeMovieRatingComponent,
        MovieListCardComponent,
        HomeCarouselComponent,
        HomeDiscoverComponent,
        TabsComponent,
        TabComponent,
        StarHoverableComponent,
        HomeListsComponent
    ],
    templateUrl: './home.component.html',
    styles: ``
})
export class HomeComponent implements OnInit {
    protected topMovies: Movie[] = [];

    upcomings: any[] = [];
    watchlist: any = null;

    ratings: any[] = [];

    constructor(
        private tmdbService: TmdbService,
        private responsive: BreakpointObserver
    ) {}

    async ngOnInit(): Promise<void> {
        setTitle('Accueil');
        this.topMovies = await this.tmdbService.getTopMovies();
        this.ratings = Array(8)
            .fill(0)
            .map((x, i) => ({
                movie: this.randomMovie(),
                user: this.randomFirstNameAndLastName(),
                date: this.randomDate(),
                rating: this.randomRating(),
                comment: this.randomComment(),
                likes: this.randomLikes(),
                comments: this.randomComments()
            }));
        this.watchlist = {
            name: this.randomWatchlistName(),
            comments: this.randomComments(),
            likes: this.randomLikes(),
            movies: Array(6)
                .fill(0)
                .map((x, i) => this.randomMovie())
        };
        this.tmdbService.getUpcomingMovies().subscribe((data: any) => {
            this.upcomings = data.results.slice(0, 20);
        });
        this.responsive.observe(Breakpoints.Small).subscribe((result) => {});
    }

    randomMovie() {
        const randomIndex = Math.floor(Math.random() * this.topMovies.length);
        return this.topMovies[randomIndex];
    }

    randomComments() {
        return Math.floor(Math.random() * 1000);
    }

    randomWatchlistName() {
        const watchlistNames = ['À voir', 'Classiques', 'Coups de cœur', 'En famille', 'Entre amis', 'Incontournables'];
        return watchlistNames[Math.floor(Math.random() * watchlistNames.length)];
    }

    randomFirstNameAndLastName() {
        const firstNames = [
            'John',
            'Jane',
            'Jack',
            'Jill',
            'James',
            'Jenny',
            'Jasper',
            'Jasmine',
            'Jude',
            'Julia',
            'Frank',
            'Fiona',
            'Felix',
            'Felicity',
            'Finn',
            'Fiona',
            'Freddie',
            'Faye',
            'Gus',
            'Greta',
            'George',
            'Gloria',
            'Gavin',
            'Gemma',
            'Hank',
            'Holly',
            'Harry',
            'Hannah',
            'Henry',
            'Hazel',
            'Hugo',
            'Heidi',
            'Ivan',
            'Ivy',
            'Isaac',
            'Isla',
            'Ian',
            'Irene',
            'Igor',
            'Iris',
            'Jake',
            'Jade',
            'Jasper',
            'Jasmine',
            'Jude',
            'Julia'
        ];
        const lastNames = [
            'Johnson',
            'Jackson',
            'Jenkins',
            'Jennings',
            'Jensen',
            'Johansson',
            'Abernathy',
            'Baker',
            'Carter',
            'Dawson',
            'Fletcher',
            'Gibson',
            'Henderson',
            'Kendrick',
            'Lawson',
            'Morrison',
            'Nicholson',
            'Patterson',
            'Richardson',
            'Simpson',
            'Thompson',
            'Watson',
            'Wilkinson',
            'Williamson'
        ];
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        return `${randomFirstName} ${randomLastName}`;
    }

    randomDate() {
        const randomYear = Math.floor(Math.random() * (2021 - 1900) + 1900);
        const randomMonth = Math.floor(Math.random() * 12 + 1);
        const randomDay = Math.floor(Math.random() * 28 + 1);
        return `${randomYear}-${randomMonth}-${randomDay}`;
    }

    randomRating() {
        return (Math.random() * 4 + 1).toFixed(1);
    }

    randomComment() {
        const comments = [
            "Un voyage cinématographique époustouflant qui redéfinit le genre de la science-fiction. Des effets spéciaux à couper le souffle et une intrigue qui vous tient en haleine jusqu'à la dernière seconde.",
            "Ce film est une perle rare qui nous rappelle la beauté de l'art cinématographique. L'histoire est à la fois profonde, touchante et merveilleusement interprétée par un casting étoilé.",
            "Un drame poignant qui explore les complexités des relations humaines avec une sensibilité à fleur de peau. Les performances sont d'une authenticité qui transcende l'écran.",
            "Une comédie rafraîchissante et hilarante qui ne manque pas de cœur. Elle réussit l'exploit de vous faire rire aux éclats tout en vous faisant réfléchir sur des sujets de société actuels.",
            'Un conte fantastique magnifiquement réalisé, avec un monde riche en détails et une histoire captivante. Un film qui plaira sans aucun doute aux spectateurs de tous âges.',
            "Une histoire d'amour classique avec une touche moderne. La chimie entre les deux protagonistes est palpable et donne vie à une romance des plus envoûtantes.",
            'Un thriller psychologique qui vous tient en suspense du début à la fin. Une réalisation maîtrisée qui joue avec vos nerfs et vous laisse dans un état de réflexion intense.',
            "Un biopic qui rend un hommage respectueux et émouvant à une figure historique d'importance. Les performances sont puissantes et la mise en scène est sublime.",
            "Un film d'animation qui est une véritable œuvre d'art. Les images sont splendides et l'histoire est riche d'enseignements et d'émotions.",
            "Un voyage initiatique qui touche à l'essence même de la condition humaine. Ce film laisse une marque indélébile et pousse à l'introspection.",
            "Une réinterprétation audacieuse d'un classique littéraire qui réussit à surprendre et captiver, même ceux familiers avec l'histoire originale.",
            'Une aventure épique qui vous emporte dans des contrées lointaines avec un sens du spectacle à grand déploiement. Un divertissement de haute volée!',
            'Un film qui aborde des thématiques difficiles avec délicatesse et force. La narration est habile et les personnages sont dessinés avec nuance et profondeur.',
            "Un polar noir haletant qui renouvelle le genre avec brio. L'atmosphère sombre et la tension constante en font une expérience mémorable.",
            'Une satire sociale acérée déguisée en comédie. Le film joue avec les codes du genre pour livrer un message percutant sur le monde contemporain.',
            "Un documentaire éclairant qui pose un regard sans concession sur un sujet d'actualité brûlant. Une œuvre qui pousse à la réflexion et à l'action.",
            'Le réalisateur livre ici une pièce cinématographique qui brille par son audace et son originalité. Un film qui ne ressemble à aucun autre et qui laisse une impression durable.',
            "Une fresque historique d'une richesse incroyable, tant dans sa reconstitution minutieuse que dans la complexité de ses personnages. Un voyage dans le temps captivant.",
            "Ce film d'horreur ne se contente pas de frissonner; il explore les peurs profondes de la psyché humaine avec une intelligence rare dans le genre.",
            "Un road movie émouvant et pittoresque qui capture l'essence de l'aventure et la liberté de l'esprit. Chaque scène est un tableau vivant et mémorable.",
            "L'exploration d'un futur dystopique n'a jamais été aussi pertinente. Le film pose des questions difficiles sur notre société tout en offrant une expérience visuelle époustouflante.",
            'Avec une bande sonore qui vous prend aux tripes et une esthétique visuelle à couper le souffle, ce film est une expérience sensorielle complète.',
            'Un film noir qui renoue avec les classiques du genre tout en injectant une dose de modernité. Un scénario bien ficelé et une réalisation léchée.',
            "Une comédie familiale qui prouve qu'il est possible de divertir tout en étant intelligent et bienveillant. Les rires fusent mais l'émotion est bien présente.",
            "Ce n'est pas juste un film d'action. C'est une réflexion sur le courage, le sacrifice et les dilemmes moraux auxquels sont confrontés ceux qui choisissent de défendre leurs idéaux.",
            "Un portrait intime et déchirant d'une figure emblématique, servi par une performance d'acteur d'une puissance rare. Le film vous hante longtemps après la fin du générique.",
            "Un conte poétique qui joue avec la narration et la structure cinématographique pour vous emmener dans un univers onirique où chaque image est une œuvre d'art."
        ];
        return comments[Math.floor(Math.random() * comments.length)];
    }

    randomLikes() {
        return Math.floor(Math.random() * 1000);
    }

    randomId() {
        // Random between 1054774000 and 1054774547
        const id = Math.floor(1054774547 + Math.random() * 100);

        return id;
    }

    protected readonly Date = Date;
    protected readonly Movie = Movie;
}
