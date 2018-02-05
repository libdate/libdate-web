import FirebaseService from '../FirebaseService';

export default class NotificationsSerivce {
    getMessaging() {
        if (!this.messaging) {
            this.messaging = FirebaseService.getFirebase().messaging();
        }
        return this.messaging;
    }

    getPushToken() {
        const messaging = this.getMessaging();

        return messaging.getToken()
            .then((currentToken) => {
            if (currentToken) {
                this.onMessageReceived();
                return Promise.resolve(currentToken);
            } else {
                // Show permission request.
                return this.requestPermission();
            }
        })
    }

    requestPermission() {
        return this.getMessaging().requestPermission()
            .then(() => this.getPushToken())
            .catch(function (err) {
                console.log('Unable to get permission to notify.', err);
                return Promise.reject(null);
            });
    }

    onTokenRefresh(onRefresh) {
        const messaging = this.getMessaging();

        messaging.onTokenRefresh(() => {
            this.getPushToken().then(token => onRefresh(token))
        });
    }

    onMessageReceived() {
        this.getMessaging().onMessage(function(payload) {
            console.log("Message received. ", payload);
            // ...
          });
    }
}