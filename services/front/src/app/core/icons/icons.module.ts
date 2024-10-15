import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { icons } from '../../configs/icons.config';

@NgModule({
    declarations: [],
    imports: [CommonModule, TablerIconsModule.pick(icons)]
})
export class IconsModule {}
