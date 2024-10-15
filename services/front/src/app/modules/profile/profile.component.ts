import { Component, OnInit } from '@angular/core';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';
import { ProfileCustomizationTabComponent } from './components/profile-customization-tab/profile-customization-tab.component';
import { NgIf } from '@angular/common';
import { BackdropComponent } from '../../shared/components/backdrop/backdrop.component';
import { UserService } from '../../core/services/user.service';
import { ProfileClassicComponent } from './components/profile-classic/profile-classic.component';
import { ProfileFriendsComponent } from './components/profile-friends/profile-friends.component';
import { TabsComponent } from '../../shared/components/tabs/tabs.component';
import { TabComponent } from '../../shared/components/tabs/components/tab/tab.component';
import { ProfileWatchlistComponent } from './components/profile-watchlist/profile-watchlist.component';
import { ProfileListsComponent } from './components/profile-lists/profile-lists.component';
import { ProfilesFilmsComponent } from './components/profiles-films/profiles-films.component';

@Component({
    selector: 'app-profile',
    standalone: true,

    imports: [ProfileTabsComponent, ProfileCustomizationTabComponent, NgIf, BackdropComponent, ProfileClassicComponent, ProfileFriendsComponent, TabsComponent, TabComponent, ProfileWatchlistComponent, ProfileListsComponent, ProfilesFilmsComponent],

    templateUrl: './profile.component.html',
    styles: ``
})
export class ProfileComponent implements OnInit {

    protected userDetails: any;

    constructor(
        protected user: UserService,
    ) {}

    public async ngOnInit(): Promise<void> {
        console.log("UserDetails:" , this.userDetails)
    }

}
