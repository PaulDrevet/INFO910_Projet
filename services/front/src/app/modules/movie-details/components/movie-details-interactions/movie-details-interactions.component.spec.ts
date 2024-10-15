import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailsInteractionsComponent } from './movie-details-interactions.component';

describe('MovieDetailsInteractionsComponent', () => {
    let component: MovieDetailsInteractionsComponent;
    let fixture: ComponentFixture<MovieDetailsInteractionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MovieDetailsInteractionsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(MovieDetailsInteractionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
