import 'firebase/firestore';
import { GithubTokenService } from '../GithubTokenService/index';
import NotificationsSerivce from '../NotificationsService';
import FirebaseService from '../FirebaseService';
import _ from 'lodash';

export default class AccountService {
    constructor(onLogin, _window = window) {
        this.window = _window;
        this.tokenService = new GithubTokenService();
        this.notificationsService = new NotificationsSerivce();
    }

    init(onFinish) {
        if (!this.hasInitialized) {
            this.firebase = FirebaseService.getFirebase();
            this.db = this.firebase.firestore();
            this.firebase.auth().onAuthStateChanged(() => this.checkLogin(onFinish));
        }
    }

    checkLogin(onFinish) {
        let user = this.firebase.auth().currentUser;

        this.firebase.auth().getRedirectResult()
            .then(result => {
                if (result.user) {
                    this.createUser(result).then(onFinish);
                } else if (!user) {
                    this.login();
                } else {
                    this.getUserToken(user).then(token => this.finishInitilization(token, onFinish));
                }
            });
    }

    login() {
        var githubProvider = new this.firebase.auth.GithubAuthProvider();

        githubProvider.addScope('repo');
        githubProvider.addScope('public_repo');

        return this.firebase.auth().setPersistence(this.firebase.auth.Auth.Persistence.LOCAL)
            .then(() => this.firebase.auth().signInWithRedirect(githubProvider))
            .catch(error => {
                console.error(error);
            });
    }

    getUserToken(user) {
        let uid = user.uid;

        return this.db.collection('users').doc(uid).get().then(userRef => {
            if (userRef.exists) {
                let user = userRef.data();
                return Promise.resolve(user.githubToken);
            } else {
                Promise.reject('User does not exist', uid);
                this.login();
            }
        });
    }

    createUser(result) {
        let user = result.additionalUserInfo.username;
        let githubToken = result.credential.accessToken;
        let uid = result.user.uid;

        return this.notificationsService.getPushToken()
            .then(pushToken =>
                this.db.collection('users').doc(uid).set({
                    uid,
                    user,
                    pushToken,
                    githubToken,
                }))
            .then(() => {
                this.finishInitilization(githubToken);
            })
            .catch(error => console.error(error));
    }

    finishInitilization(githubToken, onFinish = _.noop) {
        this.tokenService.saveToken(githubToken);
        this.hasInitialized = true;
        this.notificationsService.onMessageReceived();
        this.registerPushTokenRefresh();

        onFinish();
    }

    registerPushTokenRefresh() {
        this.notificationsService.onTokenRefresh(token => {
            this.savePushToken(this.firebase.auth().user, token);
        });
    }

    savePushToken(user, pushToken) {
        console.log('saving new token');
        return this.db.collection('users').doc(user.uid).update({
            pushToken
        });
    }
}