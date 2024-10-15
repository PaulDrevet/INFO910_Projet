import { Component, OnInit } from '@angular/core';
import { MovieListCardComponent } from '../../../../shared/components/movie-list-card/movie-list-card.component';
import { ListsService } from '../../../../core/services/lists.service';
import { IList } from '../../../../shared/models/list.model';
import { UserService } from '../../../../core/services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { notyf } from '../../../../core/utils/notyf.utils';

@Component({
    selector: 'app-profile-lists',
    standalone: true,
    imports: [MovieListCardComponent, ReactiveFormsModule],
    templateUrl: './profile-lists.component.html'
})
export class ProfileListsComponent implements OnInit {
    protected userLists: IList[] = [];

    protected listForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(4)]),
        description: new FormControl('', [Validators.required, Validators.minLength(20)])
    });

    constructor(
        private listService: ListsService,
        private user: UserService
    ) {}

    public async ngOnInit(): Promise<void> {
        this.userLists = (await this.listService.getUserLists(this.user.getUsername()!)).data;
    }

    public async createList(): Promise<void> {
        if (this.listForm.valid) {
            await this.listService
                .create({
                    name: this.listForm.value.name!,
                    description: this.listForm.value.description!,
                    username: this.user.getUsername()!,
                    isPublic: false
                })
                .then(async (response) => {
                    this.userLists.push(response.data);
                    this.listForm.reset();
                    notyf.success('La liste a été créée avec succès !');
                })
                .catch(async () => {
                    notyf.error("Une erreur s'est produite lors de la création de la liste.");
                });
        }
    }
}
