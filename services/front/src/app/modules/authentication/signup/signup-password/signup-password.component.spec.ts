import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPasswordComponent } from './signup-password.component';

describe('SignupPasswordComponent', () => {
    let component: SignupPasswordComponent;
    let fixture: ComponentFixture<SignupPasswordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SignupPasswordComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SignupPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
