import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-profile-tabs',
    templateUrl: './profile-tabs.component.html',
    standalone: true,
    imports: [NgClass],
    styleUrls: ['./profile-tabs.component.scss']
})
export class ProfileTabsComponent implements OnInit {
    @Output() tabSelected = new EventEmitter<string>();
    activeTab: string = 'classic';
    borderClass = 'border-b-gray-50'; // Classe de bordure par défaut

    marker: HTMLDivElement | undefined;

    constructor() {}

    ngOnInit(): void {
        this.marker = document.getElementById('marker') as HTMLDivElement;
        const privateTab: HTMLDialogElement | null = document.getElementById('classic') as HTMLDialogElement;
        privateTab.click();
    }

    selectTab(tabName: string) {
        this.activeTab = tabName;
        this.tabSelected.emit(this.activeTab);
        this.borderClass = this.activeTab === 'customization' ? 'border-b-primary' : 'border-b-gray-50';
    }

    indicator(e: any): void {
        if (!this.marker || !e) return;
        this.marker.style.left = e.target.offsetLeft + 'px';
        this.marker.style.width = e.target.offsetWidth + 'px';
    }
}
