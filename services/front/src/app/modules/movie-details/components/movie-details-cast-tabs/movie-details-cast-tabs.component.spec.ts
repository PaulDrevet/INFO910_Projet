import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailsCastTabsComponent } from './movie-details-cast-tabs.component';

describe('MovieDetailsCastTabsComponent', () => {
    let component: MovieDetailsCastTabsComponent;
    let fixture: ComponentFixture<MovieDetailsCastTabsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MovieDetailsCastTabsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(MovieDetailsCastTabsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
