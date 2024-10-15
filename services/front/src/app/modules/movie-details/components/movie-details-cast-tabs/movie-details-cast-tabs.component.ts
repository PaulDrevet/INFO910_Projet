import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TmdbService } from '../../../../core/services/tmdb.service';
import { StarsHoverableComponent } from '../../../../shared/components/stars-hoverable/stars-hoverable.component';

@Component({
    selector: 'app-movie-details-cast-tabs',
    standalone: true,
    imports: [StarsHoverableComponent],
    templateUrl: './movie-details-cast-tabs.component.html'
})
export class MovieDetailsCastTabsComponent implements OnInit, OnChanges {
    @Input() cast: any[] = [];
    limit: number = 12;
    showAll: boolean = false;

    constructor(private tmdbService: TmdbService) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['id'] && !changes['id'].firstChange) {
        }
    }

    showAllActors() {
        this.showAll = true;
        this.limit = 48;
    }

    showLessActors() {
        this.showAll = false;
        this.limit = 12;
    }
}
