const GITHUB_TOKEN_KEY = 'GITHUB_TOKEN';

export class GithubTokenService {
    constructor(storage = window.sessionStorage) {
        this.storage = storage;
    }

    saveToken(token) {
        this.storage.setItem(GITHUB_TOKEN_KEY, token);
    }

    getToken() {
        return this.storage.getItem(GITHUB_TOKEN_KEY);
    }
}