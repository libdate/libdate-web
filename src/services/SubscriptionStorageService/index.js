export const STORAGE_KEY = 'semsub-subscriptions';

export default class SubscriptionStorageService {
    constructor(storage = window.localStorage) {
        this.storage = storage;
    }

    saveSubscriptions(subscriptions) {
        this.storage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    }

    getSubscriptions() {
        return JSON.parse(this.storage.getItem(STORAGE_KEY));
    }
}