import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { ProfileClassicComponent } from '../../../modules/profile/components/profile-classic/profile-classic.component';
import { ProfileFriendsComponent } from '../../../modules/profile/components/profile-friends/profile-friends.component';
import { ProfileTabsComponent } from '../../../modules/profile/components/profile-tabs/profile-tabs.component';
import { TabComponent } from './components/tab/tab.component';

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [NgIf, ProfileClassicComponent, ProfileFriendsComponent, ProfileTabsComponent, NgClass, NgTemplateOutlet],
    templateUrl: './tabs.component.html'
})
export class TabsComponent implements AfterContentInit {
    @Input() public tabsStyle?: string;
    @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

    protected marker: HTMLDivElement | undefined;

    constructor() {}

    public ngOnInit(): void {
        this.marker = document.getElementById('marker') as HTMLDivElement;
    }

    public ngAfterContentInit(): void {
        if (!this.tabs.first) return;
        this.selectTab(this.tabs.first, null);
        setTimeout(() => {
            const firstTabElement: HTMLElement | null = document.getElementById(`tab-${this.tabs.first.name}`);
            if (this.marker && firstTabElement) {
                this.marker.style.left = firstTabElement.offsetLeft + 'px';
                this.marker.style.width = firstTabElement.offsetWidth + 'px';
            }
        }, 0); // Un délai de 0 ms décale l'exécution jusqu'après le rendu du DOM
    }

    protected selectTab(tabName: TabComponent, e: any): void {
        this.tabs.toArray().forEach((tab) => (tab.active = false));
        tabName.active = true;
        if (!this.marker || !e) return;
        this.marker.style.left = e.target.offsetLeft + 'px';
        this.marker.style.width = e.target.offsetWidth + 'px';
    }
}
