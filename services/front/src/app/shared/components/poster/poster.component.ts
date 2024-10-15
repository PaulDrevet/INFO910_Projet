import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-poster',
    standalone: true,
    imports: [],
    templateUrl: './poster.component.html',
    styles: ``
})
export class PosterComponent {
    @Input() posterPath: string | undefined;
    @Input() style: string | undefined;

    constructor() {}

    getPosterUrl(): string {
        return `https://image.tmdb.org/t/p/w220_and_h330_face${this.posterPath}`;
    }
}
