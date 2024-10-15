export class Response<T> {
    public message: string;
    public data: T;
    public status: number;

    constructor(message: string, data: T, status: number) {
        this.message = message;
        this.data = data;
        this.status = status;
    }

    public isSuccess(): boolean {
        return this.status >= 200 && this.status < 300;
    }

    public isUnauthorized(): boolean {
        return this.status === 401;
    }

    public isForbidden(): boolean {
        return this.status === 403;
    }

    public isNotFound(): boolean {
        return this.status === 404;
    }

    public isServerError(): boolean {
        return this.status >= 500;
    }

    public isClientError(): boolean {
        return this.status >= 400 && this.status < 500;
    }

    public isInformational(): boolean {
        return this.status >= 100 && this.status < 200;
    }

    public isRedirection(): boolean {
        return this.status >= 300 && this.status < 400;
    }

    public isOk(): boolean {
        return this.status === 200;
    }

    public isCreated(): boolean {
        return this.status === 201;
    }

    public isAccepted(): boolean {
        return this.status === 202;
    }

    public isNoContent(): boolean {
        return this.status === 204;
    }

    public isBadRequest(): boolean {
        return this.status === 400;
    }
}
