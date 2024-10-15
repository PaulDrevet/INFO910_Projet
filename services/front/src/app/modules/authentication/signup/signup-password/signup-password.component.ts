import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-signup-password',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './signup-password.component.html'
})
export class SignupPasswordComponent {
    @Output() increment: EventEmitter<any> = new EventEmitter();

    @Input() details: FormGroup | any;

    incrementStep() {
        this.increment.emit();
    }
}
