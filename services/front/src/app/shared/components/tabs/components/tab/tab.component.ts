import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-tab',
    standalone: true,
    imports: [NgIf],
    templateUrl: './tab.component.html'
})
export class TabComponent {
    @Input() name!: string;
    active: boolean = false;
}
