import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-pelliculum-logo',
    standalone: true,
    imports: [NgOptimizedImage],
    templateUrl: './pelliculum-logo.component.html'
})
export class PelliculumLogoComponent {}
