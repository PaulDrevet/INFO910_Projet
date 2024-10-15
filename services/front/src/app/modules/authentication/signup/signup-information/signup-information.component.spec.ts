import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupInformationComponent } from './signup-information.component';

describe('SignupInformationComponent', () => {
    let component: SignupInformationComponent;
    let fixture: ComponentFixture<SignupInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SignupInformationComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SignupInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
