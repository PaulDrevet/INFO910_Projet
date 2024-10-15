import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailsRatingAnswersComponent } from './movie-details-rating-answers.component';

describe('MovieDetailsRatingAnswersComponent', () => {
    let component: MovieDetailsRatingAnswersComponent;
    let fixture: ComponentFixture<MovieDetailsRatingAnswersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MovieDetailsRatingAnswersComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(MovieDetailsRatingAnswersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
