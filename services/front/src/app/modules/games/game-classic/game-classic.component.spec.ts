import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameClassicComponent } from './game-classic.component';

describe('GameClassicComponent', () => {
    let component: GameClassicComponent;
    let fixture: ComponentFixture<GameClassicComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameClassicComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(GameClassicComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
