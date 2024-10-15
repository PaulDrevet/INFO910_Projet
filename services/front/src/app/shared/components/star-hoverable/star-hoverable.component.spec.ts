import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarHoverableComponent } from './star-hoverable.component';

describe('StarHoverableComponent', () => {
    let component: StarHoverableComponent;
    let fixture: ComponentFixture<StarHoverableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StarHoverableComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(StarHoverableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
