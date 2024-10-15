import { Component, Input } from '@angular/core';
import { PosterComponent } from '../../../../shared/components/poster/poster.component';
import { StarsComponent } from '../../../../shared/components/stars/stars.component';
import { NgIf } from '@angular/common';
import { Movie } from '../../../../shared/models/movie.model';
import { RouterLink } from '@angular/router';
import { SearchListReviewsComponent } from '../../../../shared/components/search-list-reviews/search-list-reviews.component';

@Component({
    selector: 'app-profiles-films',
    standalone: true,
    imports: [PosterComponent, StarsComponent, NgIf, RouterLink, SearchListReviewsComponent],
    templateUrl: './profiles-films.component.html'
})
export class ProfilesFilmsComponent {
    @Input() reviews: any[] = [];
    protected readonly Movie = Movie;
}
