import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesFilmsComponent } from './profiles-films.component';

describe('ProfilesFilmsComponent', () => {
    let component: ProfilesFilmsComponent;
    let fixture: ComponentFixture<ProfilesFilmsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfilesFilmsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfilesFilmsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
