import { Component, Input, OnInit } from '@angular/core';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { RouterLink } from '@angular/router';
import { IList } from '../../models/list.model';
import { NgIf } from '@angular/common';
import { TmdbService } from '../../../core/services/tmdb.service';
import { UsersService } from '../../../core/services/users.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-movie-list-card',
    standalone: true,
    imports: [BackdropComponent, RouterLink, NgIf],
    templateUrl: './movie-list-card.component.html'
})
export class MovieListCardComponent implements OnInit {
    @Input() list?: IList;
    protected randomBackdropURL?: string;

    constructor(
        protected tmdbService: TmdbService,
        protected usersService: UsersService
    ) {}

    public async ngOnInit(): Promise<void> {
        await this.randomMovieBackdropURL();
    }

    /**
     * Return the name of the list with no accents and space replaced by hyphens
     */
    protected getListUrl(): string {
        return (this.list?.name ?? '')
            .toLowerCase()
            .replace(/ /g, '-')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    protected getListID(): string {
        return this.list?.id.toString() ?? '1';
    }

    protected async randomMovieBackdropURL(): Promise<void> {
        if (this.list?.movies?.length === 0) {
            this.randomBackdropURL = '';
            return;
        }
        this.randomBackdropURL = 'https://image.tmdb.org/t/p/w1920_and_h800_multi_faces' + (await this.tmdbService.getMovieDetails(this.list?.movies[Math.floor(Math.random() * (this.list?.movies?.length ?? 0))]!)).data.backdrop_path;
    }

    protected readonly User = User;
}
