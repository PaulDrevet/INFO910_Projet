import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Genre, IGenre } from '../../../../shared/models/genre.model';
import { TablerIconsModule } from 'angular-tabler-icons';
import { genres } from '../../../../configs/genres.config';

@Component({
    selector: 'app-home-discover',
    standalone: true,
    imports: [RouterLink, TablerIconsModule],
    templateUrl: './home-discover.component.html'
})
export class HomeDiscoverComponent {
    protected readonly genres: IGenre[] = genres;

    protected getGenreUrl(genre: IGenre): string {
        return `/films/${Genre.slug(genre)}`;
    }
}
