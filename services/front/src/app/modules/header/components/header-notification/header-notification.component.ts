import { Component } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { IconsModule } from '../../../../core/icons/icons.module';

@Component({
    selector: 'app-header-notification',
    standalone: true,
    imports: [TablerIconsModule, IconsModule],
    templateUrl: './header-notification.component.html'
})
export class HeaderNotificationComponent {
    items = [
        { name: 'review', user: 'John Doe', film: 'The Dark Knight', icon: 'fa fa-star' },
        { name: 'comment', user: 'John Doe', film: 'The Dark Knight', icon: 'fa fa-comment' }
    ];

    item: any[] = [];
}
