import {Component, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {InputComponent} from "./input/input.component";
import {ButtonComponent} from "./button/button.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {OptionsComponent} from "./options/options.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, InputComponent, ButtonComponent, MatSlideToggleModule, OptionsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Password generator 🔒';
}
