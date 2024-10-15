import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-signup-progression',
    standalone: true,
    imports: [NgClass],
    templateUrl: './signup-progression.component.html',
    styleUrls: ['./signup-progression.component.sass']
})
export class SignupProgressionComponent {
    @Input() step: number = 1;
}
