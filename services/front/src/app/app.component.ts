import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './modules/header/header.component';
import { FooterComponent } from './modules/footer/footer.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent, NgIf],
    templateUrl: './app.component.html',
    styles: ``
})
export class AppComponent {
    title = 'Pelliculum';

    isInLoginOrRegisterPage() {
        return window.location.pathname === '/login' || window.location.pathname === '/register';
    }
}
