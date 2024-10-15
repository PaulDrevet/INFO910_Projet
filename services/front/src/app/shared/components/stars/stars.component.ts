import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-stars',
    standalone: true,
    imports: [],
    templateUrl: './stars.component.html',
    styles: ``
})
export class StarsComponent implements OnInit {
    @Input() value: number = 0;
    @Input() stars: number = 0;
    @Input() size: string = 'w-6';

    percentage: number = 0;
    starsArray: number[] = [];

    constructor() {}

    ngOnInit(): void {
        this.percentage = (this.value / this.stars) * 100;
        this.starsArray = Array(this.stars)
            .fill(0)
            .map((x, i) => i);
    }
}
