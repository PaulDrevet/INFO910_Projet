import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupPreferencesComponent } from './signup-preferences.component';

describe('SignupPreferencesComponent', () => {
    let component: SignupPreferencesComponent;
    let fixture: ComponentFixture<SignupPreferencesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SignupPreferencesComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SignupPreferencesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
