import { Component, OnInit } from '@angular/core';
import { MovieListCardComponent } from '../../../../shared/components/movie-list-card/movie-list-card.component';
import { NgIf } from '@angular/common';
import { ListsService } from '../../../../core/services/lists.service';
import { IList } from '../../../../shared/models/list.model';

@Component({
    selector: 'app-home-lists',
    standalone: true,
    imports: [MovieListCardComponent, NgIf],
    templateUrl: './home-lists.component.html'
})
export class HomeListsComponent implements OnInit {
    protected lists: IList[] = [];

    constructor(private listsService: ListsService) {}

    public async ngOnInit(): Promise<void> {
        this.lists = (await this.listsService.getAll(false)).data.slice(0, 4);
    }
}
