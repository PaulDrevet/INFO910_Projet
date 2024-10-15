import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileClassicComponent } from './profile-classic.component';

describe('ProfileClassicComponent', () => {
    let component: ProfileClassicComponent;
    let fixture: ComponentFixture<ProfileClassicComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileClassicComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileClassicComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
