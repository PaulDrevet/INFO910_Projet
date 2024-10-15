import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { HeaderSearchComponent } from './components/header-search/header-search.component';
import { HeaderSignComponent } from './components/header-sign/header-sign.component';
import { RouterLink } from '@angular/router';
import { PelliculumLogoTitleComponent } from '../../shared/components/pelliculum-logo-title/pelliculum-logo-title.component';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [HeaderSignComponent, RouterLink, NgOptimizedImage, FormsModule, NgForOf, NgIf, HeaderSearchComponent, PelliculumLogoTitleComponent],
    templateUrl: './header.component.html'
})
export class HeaderComponent {}
