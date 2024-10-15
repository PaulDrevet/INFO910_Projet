import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchListMoviesComponent } from './search-list-movies.component';

describe('SearchListMoviesComponent', () => {
    let component: SearchListMoviesComponent;
    let fixture: ComponentFixture<SearchListMoviesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchListMoviesComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SearchListMoviesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
