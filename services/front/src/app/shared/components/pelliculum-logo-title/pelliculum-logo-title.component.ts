import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-pelliculum-logo-title',
    standalone: true,
    imports: [NgOptimizedImage, RouterLink],
    templateUrl: './pelliculum-logo-title.component.html'
})
export class PelliculumLogoTitleComponent {}
