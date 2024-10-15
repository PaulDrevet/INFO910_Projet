import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SearchListMoviesComponent } from '../../shared/components/search-list-movies/search-list-movies.component';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../core/services/tmdb.service';

@Component({
    selector: 'app-actor-page',
    standalone: true,
    imports: [NgOptimizedImage, SearchListMoviesComponent],
    templateUrl: './actor-page.component.html'
})
export class ActorPageComponent implements OnInit {
    protected actor: any;
    protected actorMovies: any[] = [];

    constructor(
        private route: ActivatedRoute,
        private tmdbService: TmdbService
    ) {}

    async ngOnInit(): Promise<void> {
        const actorId = Number(this.route.snapshot.paramMap.get('id'));
        this.actor = await this.tmdbService.getActorById(actorId);
        this.actorMovies = await this.tmdbService.getActorMovies(actorId);
    }
}
