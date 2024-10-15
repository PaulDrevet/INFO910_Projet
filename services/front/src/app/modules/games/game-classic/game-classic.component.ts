import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../../../core/services/tmdb.service';
import { GameGenresComponent } from '../../../shared/components/games/game-genres/game-genres.component';
import { GameDateComponent } from '../../../shared/components/games/game-date/game-date.component';
import { GameActorsComponent } from '../../../shared/components/games/game-actors/game-actors.component';

@Component({
    selector: 'app-game-classic',
    standalone: true,
    imports: [GameGenresComponent, GameDateComponent, GameActorsComponent],
    templateUrl: './game-classic.component.html'
})
export class GameClassicComponent implements OnInit {
    filmGenres: number[] = [];
    guessGenres: number[] = [];
    guessActors: any[] = [];

    constructor(private tmdbService: TmdbService) {}

    ngOnInit() {}

    test() {}
}
