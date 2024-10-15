import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { IMovie } from '../../shared/models/movie.model';

export const notyf = new Notyf({
    position: {
        x: 'right',
        y: 'bottom'
    },
    dismissible: true,
    duration: 4000,
    types: [
        {
            type: 'success',
            icon: {
                className: 'notyf__icon--success',
                tagName: 'i'
            }
        },
        {
            type: 'warning',
            background: 'orange',
            icon: {
                className: 'material-symbols:warning-rounded',
                tagName: 'i',
                text: 'warning'
            }
        }
    ]
});

export const success_watchlist = (message: string, movie: IMovie) => {
    const messageWithIcon = `
    <div class="flex flex-row items-center space-x-4">
<svg  xmlns="http://www.w3.org/2000/svg"  width="56"  height="56"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12 18c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
      <span>${message}</span>
    </div>
  `;
    notyf.open({
        type: 'success',
        background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url("https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie?.backdrop_path}") no-repeat center center / contain`,
        icon: false,
        message: messageWithIcon
    });
};

export const warning = (message: string) =>
    notyf.open({
        type: 'warning',
        message
    });
