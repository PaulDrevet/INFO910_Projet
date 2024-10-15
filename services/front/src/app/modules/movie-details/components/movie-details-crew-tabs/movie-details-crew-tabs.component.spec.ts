import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailsCrewTabsComponent } from './movie-details-crew-tabs.component';

describe('MovieDetailsCrewTabsComponent', () => {
    let component: MovieDetailsCrewTabsComponent;
    let fixture: ComponentFixture<MovieDetailsCrewTabsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MovieDetailsCrewTabsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(MovieDetailsCrewTabsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
