import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCustomizationTabComponent } from './profile-customization-tab.component';

describe('ProfileCustomizationTabComponent', () => {
    let component: ProfileCustomizationTabComponent;
    let fixture: ComponentFixture<ProfileCustomizationTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileCustomizationTabComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileCustomizationTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
