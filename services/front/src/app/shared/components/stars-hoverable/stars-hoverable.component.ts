import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';

@Component({
    selector: 'app-stars-hoverable',
    templateUrl: './stars-hoverable.component.html',
    styleUrls: ['./stars-hoverable.component.sass'],
    standalone: true,
    imports: [FormsModule, NgForOf, NgStyle, NgClass, NgIf] // Assurez-vous que FormsModule et NgForOf sont importés si nécessaire
})
export class StarsHoverableComponent implements OnInit {
    @Input() starSize = 1;
    @Input() rating: number | null = 0;
    @Output() ratingChange = new EventEmitter<number>();
    uniqueId = Math.random().toString(36).substring(2, 9);
    ratingBreakpoints = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];
    starWidth?: number;
    hoveredRating: number | null = null;

    ngOnInit(): void {
        this.starWidth = 1.39306640625 * this.starSize;
    }

    // Méthodes pour gérer les événements de survol
    onMouseEnter(rating: number): void {
        this.hoveredRating = rating;
    }

    onMouseLeave(): void {
        this.hoveredRating = null;
    }

    getStarHref(ratingBreakpoint: number): string {
        // Détermine si on utilise une étoile entière ou une demi-étoile
        return ratingBreakpoint % 1 !== 0 ? '#icon-star-half' : '#icon-star';
    }

    onRatingChange(ratingValue: number): void {
        this.rating = ratingValue;
        this.ratingChange.emit(ratingValue);
    }
}
