import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderPictureComponent } from '../header-picture/header-picture.component';
import { HeaderNotificationComponent } from '../header-notification/header-notification.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { IconsModule } from '../../../../core/icons/icons.module';
import { UserService } from '../../../../core/services/user.service';

@Component({
    selector: 'app-header-sign',
    standalone: true,
    imports: [NgIf, RouterLink, NgForOf, HeaderPictureComponent, HeaderNotificationComponent, TablerIconsModule, IconsModule],
    templateUrl: './header-sign.component.html',
    styles: []
})
export class HeaderSignComponent {
    notif: string = '3';
    items: any[] = []; // Replace `any` with your item type
    dropdownVisible: boolean = false;

    constructor(protected user: UserService) {
        this.items = [
            { label: 'Item 1', value: 1 },
            { label: 'Item 2', value: 2 }
            // Add more items as needed
        ];
    }

    toggleDropdown(event: Event) {
        this.dropdownVisible = !this.dropdownVisible;
        event.stopPropagation(); // Prevent event from closing the dropdown immediately
    }

    onItemSelect(item: any) {
        this.dropdownVisible = false; // Close the dropdown
    }

    closeDropdown() {
        this.dropdownVisible = false; // Method to close dropdown, can be called from elsewhere
    }
}
