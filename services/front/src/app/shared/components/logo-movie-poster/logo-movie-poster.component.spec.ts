import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoMoviePosterComponent } from './logo-movie-poster.component';

describe('LogoMoviePosterComponent', () => {
    let component: LogoMoviePosterComponent;
    let fixture: ComponentFixture<LogoMoviePosterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LogoMoviePosterComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(LogoMoviePosterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
