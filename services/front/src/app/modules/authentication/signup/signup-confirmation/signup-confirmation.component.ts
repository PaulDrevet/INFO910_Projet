import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-signup-confirmation',
    standalone: true,
    imports: [NgClass, ReactiveFormsModule],
    templateUrl: './signup-confirmation.component.html'
})
export class SignupConfirmationComponent {
    @Input() details: FormGroup | any;
    @Input() discoverPossibilities: FormGroup | undefined;
    @Output() increment: EventEmitter<any> = new EventEmitter();

    discoverPossibilites: string[] = ['Réseaux sociaux', 'Proches', 'Publicité en ligne', 'Autre'];
    selectedPossibility: number = -1;

    incrementStep() {
        this.increment.emit();
    }
}
