import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-logo-movie-poster',
    standalone: true,
    imports: [NgOptimizedImage],
    templateUrl: './logo-movie-poster.component.html'
})
export class LogoMoviePosterComponent {}
