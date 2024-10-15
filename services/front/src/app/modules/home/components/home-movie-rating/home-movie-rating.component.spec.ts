import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMovieRatingComponent } from './home-movie-rating.component';

describe('HomeMovieRatingComponent', () => {
    let component: HomeMovieRatingComponent;
    let fixture: ComponentFixture<HomeMovieRatingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeMovieRatingComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HomeMovieRatingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
