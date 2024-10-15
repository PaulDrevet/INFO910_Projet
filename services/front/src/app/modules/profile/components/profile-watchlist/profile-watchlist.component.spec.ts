import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileWatchlistComponent } from './profile-watchlist.component';

describe('ProfileWatchlistComponent', () => {
    let component: ProfileWatchlistComponent;
    let fixture: ComponentFixture<ProfileWatchlistComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileWatchlistComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileWatchlistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
