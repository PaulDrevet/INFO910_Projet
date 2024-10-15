import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPictureComponent } from './header-picture.component';

describe('HeaderPictureComponent', () => {
    let component: HeaderPictureComponent;
    let fixture: ComponentFixture<HeaderPictureComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderPictureComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderPictureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
