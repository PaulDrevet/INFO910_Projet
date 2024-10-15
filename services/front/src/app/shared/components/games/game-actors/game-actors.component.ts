import { Component, Input, OnInit } from '@angular/core';
import { TmdbService } from '../../../../core/services/tmdb.service';

@Component({
    selector: 'app-game-actors',
    standalone: true,
    imports: [],
    templateUrl: './game-actors.component.html'
})
export class GameActorsComponent implements OnInit {
    actorsDetail: any[] = [];
    @Input() guessActors: any[] = [];

    constructor(private tmdbService: TmdbService) {}

    ngOnInit() {}

    ngOnChanges(changes: any) {
        if (changes.guessActors) {
            this.actorsDetail.forEach((actorDetail) => {
                if (this.guessActors.some((guessActor) => guessActor.id === actorDetail.id)) {
                    actorDetail.found = true;
                }
            });
        }
    }
}
