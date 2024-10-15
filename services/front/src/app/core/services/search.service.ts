import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TmdbService } from './tmdb.service';

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    private searchQuerySubject = new BehaviorSubject<string>('');
    public searchQuery$ = this.searchQuerySubject.asObservable();
    public searchResults$ = this.searchQuery$.pipe(switchMap((query) => this.tmdbService.searchMovies(query)));

    constructor(private tmdbService: TmdbService) {
    }

    setSearchQuery(query: string): void {
        this.searchQuerySubject.next(query);
    }
}
