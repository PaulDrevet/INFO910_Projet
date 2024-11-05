import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {SharedService} from "../shared.service";

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent implements OnInit {

  constructor(private sharedService: SharedService) { }
  placeholder = "";

  special : string = "!@#$%^&*()_+{}|:<>?~";
  numbers : string = "0123456789";
  uppercase : string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  lowercase : string = "abcdefghijklmnopqrstuvwxyz";

  ngOnInit() {
    // S'abonner aux changements
    this.sharedService.length$.subscribe(() => this.randomize());
    this.sharedService.special$.subscribe(() => this.randomize());
    this.sharedService.numbers$.subscribe(() => this.randomize());
    this.sharedService.uppercase$.subscribe(() => this.randomize());
    this.sharedService.lowercase$.subscribe(() => this.randomize());

    // Initialiser avec la valeur actuelle
    this.randomize();
  }

  randomize(): void{
    let length : number = this.sharedService.getSharedLength();
    let s : boolean = this.sharedService.getSharedSpecial();
    let n : boolean = this.sharedService.getSharedNumbers();
    let u : boolean = this.sharedService.getSharedUppercase();
    let l : boolean = this.sharedService.getSharedLowercase();

    let possible : string = "";
    if(s) possible += this.special;
    if(n) possible += this.numbers;
    if(u) possible += this.uppercase;
    if(l) possible += this.lowercase;

    let newPass : string = "";

    console.log(length);

    for (let i = 0; i < length; i++) {
      newPass += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    this.placeholder = newPass;
    this.sharedService.setSharedPassword(this.placeholder);
  }
}
