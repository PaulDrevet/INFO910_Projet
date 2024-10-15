import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeListsComponent } from './home-lists.component';

describe('HomeListsComponent', () => {
    let component: HomeListsComponent;
    let fixture: ComponentFixture<HomeListsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeListsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HomeListsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
