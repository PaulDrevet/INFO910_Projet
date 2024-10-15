import { Injectable, Input } from '@angular/core';

@Injectable()
export abstract class ResponsiveElement {

    @Input() public xs?: string;
    @Input() public sm?: string;
    @Input() public md?: string;
    @Input() public lg?: string;
    @Input() public xl?: string;
    @Input() public xxl?: string;

}