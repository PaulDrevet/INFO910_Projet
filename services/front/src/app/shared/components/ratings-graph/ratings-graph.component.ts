import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { StarsComponent } from '../stars/stars.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { IMovie } from '../../models/movie.model';

@Component({
    selector: 'app-ratings-graph',
    standalone: true,
    imports: [NgForOf, StarsComponent, TablerIconsModule, NgIf],
    templateUrl: './ratings-graph.component.html'
})
export class RatingsGraphComponent implements OnChanges {
    @Input() reviews: any[] = [];
    @Input() movie?: IMovie;

    protected ratings: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    protected highestRating: number = 0;
    protected height = 50;
    protected sumRating: number = 0;
    protected averageRating: string = '';

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['reviews']) {
            for (let rating of this.reviews) {
                let index = rating.rating * 2;
                if (index == 0.2) {
                    index = 0;
                }

                this.ratings[index] = this.ratings[index] ? this.ratings[index] + 1 : 1;
            }
            this.highestRating = Math.max(...this.ratings);
            this.sumRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
            this.averageRating = (this.sumRating / this.reviews.length).toFixed(2);
            if (this.averageRating === 'NaN') {
                this.averageRating = '0.0';
            }
        }
    }

    getHeight(nombre: number): string {
        const hauteur = (nombre / this.highestRating) * this.height;
        return `${hauteur}px`;
    }

    getPercentage(nombre: number): string {
        const res = '(' + ((this.ratings[nombre] / this.reviews.length) * 100).toFixed(1) + '%)';
        if (res === '(NaN%)') {
            return '(0.0%)';
        }
        return res;
    }

    protected readonly Number = Number;
}
