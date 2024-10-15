import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SignupProgressionComponent } from '../signup-progression/signup-progression.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-signup-information',
    standalone: true,
    imports: [NgOptimizedImage, RouterLink, SignupProgressionComponent, ReactiveFormsModule],
    templateUrl: './signup-information.component.html'
})
export class SignupInformationComponent {
    @Output() increment: EventEmitter<any> = new EventEmitter();

    @Input() details: FormGroup | any;

    constructor() {}

    incrementStep() {
        this.increment.emit();
    }
}
