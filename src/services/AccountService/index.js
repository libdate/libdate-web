import * as firebase from 'firebase';
import 'firebase/firestore';
import { GithubTokenService } from '../GithubTokenService/index';

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDCK_YCAZLXMnP6InQUGFXAfuaqDVPyXXU",
    authDomain: "libdate-a54ca.firebaseapp.com",
    databaseURL: "https://libdate-a54ca.firebaseio.com",
    projectId: "libdate-a54ca",
    storageBucket: "libdate-a54ca.appspot.com",
    messagingSenderId: "53983860863"
};

export default class AccountService {
    constructor(onLogin, _window = window) {
        this.window = _window;
        this.tokenService = new GithubTokenService();
    }

    init(onFinish) {
        firebase.initializeApp(FIREBASE_CONFIG);
        this.db = firebase.firestore();
        window.firebase = firebase;

        firebase.auth().onAuthStateChanged(() => this.checkLogin(onFinish));
    }

    checkLogin(onFinish) {
        let user = firebase.auth().currentUser;

        firebase.auth().getRedirectResult()
            .then(result => {
                if (result.user) {
                    this.createUser(result).then(onFinish);
                } else if (!user) {
                    this.login();
                } else {
                    this.getUserToken(user).then(token => this.tokenService.saveToken(token));
                    onFinish();
                }
            });
    }

    login() {
        var githubProvider = new firebase.auth.GithubAuthProvider();

        githubProvider.addScope('repo');
        githubProvider.addScope('public_repo');

        return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => firebase.auth().signInWithRedirect(githubProvider))
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
                Promise.reject('User does not exist');
            }
        });
    }

    createUser(result) {
        let user = result.additionalUserInfo.username;
        let githubToken = result.credential.accessToken;
        let uid = result.user.uid;

        return this.db.collection('users').doc(uid).set({
            uid,
            user,
            githubToken,
        }).then(() => {
            this.tokenService.saveToken(githubToken);
        }).catch(error => console.error(error));
    }
}