import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { IconsModule } from '../../../../core/icons/icons.module';
import { UserService } from '../../../../core/services/user.service';

@Component({
    selector: 'app-header-picture',
    standalone: true,
    imports: [RouterLink, TablerIconsModule, IconsModule],
    templateUrl: './header-picture.component.html'
})
export class HeaderPictureComponent {
    constructor(protected user: UserService) {}
}
