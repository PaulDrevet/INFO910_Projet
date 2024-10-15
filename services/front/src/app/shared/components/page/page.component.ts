import { Component, Input, OnInit } from '@angular/core';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { NgIf } from '@angular/common';
import { IMovie } from '../../models/movie.model';

@Component({
    selector: 'app-page',
    standalone: true,
    imports: [BackdropComponent, NgIf],
    templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {

    @Input() public title: string = '';
    @Input() public hasToBeLogged: boolean = false;
    @Input() public movieBackdrop?: string;

    public ngOnInit(): void {
        document.title = `Pelliculum - ${this.title}`;
    }
}
