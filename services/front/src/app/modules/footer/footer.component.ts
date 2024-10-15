import { Component } from '@angular/core';
import { StarsHoverableComponent } from '../../shared/components/stars-hoverable/stars-hoverable.component';
import { PelliculumLogoComponent } from '../../shared/components/pelliculum-logo/pelliculum-logo.component';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [StarsHoverableComponent, PelliculumLogoComponent],
    templateUrl: './footer.component.html'
})
export class FooterComponent {}
