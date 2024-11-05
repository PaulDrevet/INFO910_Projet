import {Component, HostListener} from '@angular/core';
import {SharedService} from "../shared.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {


  constructor(private sharedService: SharedService,
              private _snackBar: MatSnackBar) {
  }

  openSnackBar() {
    this._snackBar.open('Copied to clipboard!', 'Ok', {
      duration: 1000,
      panelClass : ['custom-snackbar']
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
      console.log(this.sharedService.getSharedPassword());
      navigator.clipboard.writeText(this.sharedService.getSharedPassword()).then(r => this.openSnackBar());
    }
  }

  copy(): void {
    console.log(this.sharedService.getSharedPassword());
    navigator.clipboard.writeText(this.sharedService.getSharedPassword()).then(r => this.openSnackBar());
  }
}
