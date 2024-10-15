import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupProgressionComponent } from './signup-progression.component';

describe('SignupProgressionComponent', () => {
    let component: SignupProgressionComponent;
    let fixture: ComponentFixture<SignupProgressionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SignupProgressionComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SignupProgressionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
