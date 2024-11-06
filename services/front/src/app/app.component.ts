import {Component, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {InputComponent} from "./input/input.component";
import {ButtonComponent} from "./button/button.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {OptionsComponent} from "./options/options.component";
import { AxiosService } from './axios.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, InputComponent, ButtonComponent, MatSlideToggleModule, OptionsComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Password generator 🔒';

  protected loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  protected registerForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  })

  protected loginType: 'login' | 'register' = 'login';

  constructor(protected axiosService: AxiosService) {}

  protected switchLoginType(){
    this.loginType = this.loginType === 'login' ? 'register' : 'login';
  }

  protected async login(){
    const values: { email: string, password: string } = <any>this.loginForm.value;
    await this.axiosService.login(values);
  }

  protected async register(){
    const values: { firstname: string, lastname: string, email: string, password: string } = <any>this.registerForm.value;
    await this.axiosService.register(values);
  }
}
