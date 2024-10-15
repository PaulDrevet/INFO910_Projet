import { Component, Input, OnInit } from '@angular/core';
import { IMovie } from '../../models/movie.model';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-page-backdrop',
    standalone: true,
    imports: [BackdropComponent, NgIf],
    templateUrl: './page-backdrop.component.html'
})
export class PageBackdropComponent {

    @Input() public movieBackdrop?: string;
    @Input() public class?: string;


}
