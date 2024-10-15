import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsGraphComponent } from './ratings-graph.component';

describe('RatingsGraphComponent', () => {
    let component: RatingsGraphComponent;
    let fixture: ComponentFixture<RatingsGraphComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RatingsGraphComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(RatingsGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
