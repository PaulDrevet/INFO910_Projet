import { Component, Input } from '@angular/core';
import { NgIf, NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-backdrop',
    standalone: true,
    imports: [NgOptimizedImage, NgIf],
    templateUrl: './backdrop.component.html',
    styles: ``
})
export class BackdropComponent {

    @Input() public backdropPath?: string;
    protected imageLoaded: boolean = false;

    protected onImageLoad(): void {
        this.imageLoaded = true;
    }

    protected getBackdropUrl(): string {
        setTimeout(() => {
            this.imageLoaded = true;
        }, 5000);
        return `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${this.backdropPath}`;
    }
}
