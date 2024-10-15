import { Component, Input, OnInit } from '@angular/core';
import { StarsComponent } from '../../../../shared/components/stars/stars.component';
import { StarsHoverableComponent } from '../../../../shared/components/stars-hoverable/stars-hoverable.component';
import { UserService } from '../../../../core/services/user.service';
import { TmdbService } from '../../../../core/services/tmdb.service';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { SharedReviewService } from '../../../../core/services/shared-review.service';
import { Notyf } from 'notyf';
import { MovieDetailsRatingAnswersComponent } from '../movie-details-rating-answers/movie-details-rating-answers.component';
import { AnswerService } from '../../../../core/services/answer.service';
import { UsersService } from '../../../../core/services/users.service';
import { NgIf } from '@angular/common';
import { User } from '../../../../shared/models/user.model';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-movie-details-rating',
    standalone: true,
    imports: [StarsComponent, StarsHoverableComponent, FormsModule, TablerIconsModule, MovieDetailsRatingAnswersComponent, NgIf, RouterLink],
    templateUrl: './movie-details-rating.component.html',
    styleUrls: ['./movie-details-rating.sass']
})
export class MovieDetailsRatingComponent implements OnInit {
    @Input() id: number = 0;
    @Input() reviews: any[] = [];
    private notyf = new Notyf();
    protected reviewed: boolean = false;
    protected userReview: any = {};
    protected comment: string = '';
    protected spoiler: boolean = false;
    protected selectedReviewId: number | null = null;
    protected answers: any[] = [];
    protected answerComment: string = '';
    protected note: number = 0.1;
    protected userName: string | null = this.user.getUsername();
    constructor(
        protected user: UserService,
        protected tmdbService: TmdbService,
        protected reviewService: SharedReviewService,
        protected usersService: UsersService,
        protected answerService: AnswerService
    ) {}
    ngOnInit(): void {
        if (!this.user.isLoggedIn()) return;
        this.getReviews();
        this.reviewService.selectedRating.subscribe((rating) => {
            this.note = rating;
        });
    }
    protected changeRating(rating: number): void {
        this.reviewService.selectedRating.next(rating);
    }
    protected getReviews(): void {
        this.tmdbService.getReviews(this.id).then((r) => {
            this.reviews = r.data.map((review: any) => {
                return {
                    ...review,
                    showSpoiler: false,
                    isLiked: review.likes.includes(this.user.getUsername()),
                    showAnswers: false,
                    profilePicture: this.usersService.getProfilePicture(review.user),
                    timeElapsed: this.getTimeElapsed(review.createdAt)
                };
            });
            this.getCurrentUserReview();
        });
    }
    protected postReview(): void {
        if (this.reviewService.selectedRating.getValue() == 0) {
            this.notyf.error('Veuillez sélectionner une note');
            return;
        }
        this.reviewService.comment = this.comment;
        this.reviewService.spoiler = this.spoiler;
        this.reviewService.postReview(this.id).then((r) => {
            this.reviews.push(r.data);
            this.reviewService.reviewId = r.data.id;
            this.reviewed = true;
            this.notyf.success('Avis posté');
        });
    }
    protected updateReview(): void {
        this.reviewService.comment = this.comment;
        this.reviewService.spoiler = this.spoiler;
        this.reviewService.updateReview().then((r) => {
            const index = this.reviews.findIndex((review) => review.id === this.reviewService.reviewId);
            this.reviews[index].comment = r.data.comment;
            this.reviews[index].rating = r.data.rating;
            this.reviews[index].spoiler = r.data.spoiler;
            this.notyf.success('Avis mis à jour');
        });
    }
    protected deleteReview(): void {
        this.reviewService.deleteReview(this.reviewService.reviewId).then(() => {
            const index = this.reviews.findIndex((review) => review.id === this.reviewService.reviewId);
            this.reviews.splice(index, 1);
            this.reviewService.reviewId = 0;
            this.reviewed = false;
            this.notyf.success('Avis supprimé');
        });
    }
    protected getCurrentUserReview(): void {
        const username = this.user.getUsername();
        const userReviewFound = this.reviews.find((review) => review.user.username === username);
        if (userReviewFound) {
            // si trouvé on update les variables lié a l'input
            this.reviewed = true;
            this.userReview = userReviewFound;
            this.spoiler = this.userReview.spoiler;
            this.reviewService.reviewId = userReviewFound.id;
            this.reviewService.selectedRating.next(userReviewFound.rating);
        } else {
            this.reviewed = false;
            this.userReview.comment = '';
            this.reviewService.selectedRating.next(0.1);
        }
    }
    protected addLikeToReview(reviewId: number): void {
        const username = this.user.getUsername();
        this.reviewService
            .addLikeToReview(reviewId, username)
            .then((r) => {
                const review = this.reviews.find((review) => review.id === reviewId);
                if (r.message === 'Review successfully liked !') {
                    this.notyf.success('Like ajouté');
                    review.isLiked = true;
                    review.likes.push(this.user.getUsername());
                }
                if (r.message === 'Review successfully unliked !') {
                    this.notyf.success('Like retiré');
                    review.isLiked = false;
                    const index = review.likes.indexOf(this.user.getUsername());
                    review.likes.splice(index, 1);
                }
            })
            .catch(() => {
                this.notyf.error("Erreur lors de l'ajout du like");
            });
    }
    protected postAnswer(review: any): void {
        this.answerService.comment = this.answerComment;
        this.answerService.spoiler = this.spoiler;

        this.answerService
            .postAnswer(review.id)
            .then((r) => {
                const newAnswer = r.data;
                review.answers.push(newAnswer);
                this.answerComment = '';
                this.selectedReviewId = null;
                this.getReviews();
            })
            .then(() => {
                this.notyf.success('Réponse postée');
            });
    }
    protected toggleAnswer(reviewId: number): void {
        this.selectedReviewId = this.selectedReviewId === reviewId ? null : reviewId;
        if (this.selectedReviewId !== null) {
            const selectedReview = this.reviews.find((review) => review.id === reviewId);
            this.answerComment = `@${selectedReview.user.username}`;
        }
    }

    protected viewAnswers(review: any): void {
        review.showAnswers = !review.showAnswers;
    }
    protected toggleSpoiler(): void {
        this.spoiler = !this.spoiler;
    }
    protected toggleShowSpoiler(review: any): void {
        review.showSpoiler = !review.showSpoiler;
    }
    private getTimeElapsed(dateString: string): string {
        const previousDate = new Date(dateString);
        const currentDate = new Date();
        const elapsed = currentDate.getTime() - previousDate.getTime();
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
        if (seconds < 60) {
            return `il y a ${seconds} seconde${seconds > 1 ? 's' : ''}`;
        } else if (minutes < 60) {
            return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (hours < 24) {
            return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
        } else if (days < 7) {
            return `il y a ${days} jour${days > 1 ? 's' : ''}`;
        } else if (weeks < 4) {
            return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
        } else if (months < 12) {
            return `il y a ${months} mois`;
        } else {
            return `il y a ${years} an${years > 1 ? 's' : ''}`;
        }
    }
    protected readonly event = event;
    protected readonly User = User;
}
