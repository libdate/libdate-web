import * as firebase from 'firebase';
import 'firebase/firestore';

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDCK_YCAZLXMnP6InQUGFXAfuaqDVPyXXU",
    authDomain: "libdate-a54ca.firebaseapp.com",
    databaseURL: "https://libdate-a54ca.firebaseio.com",
    projectId: "libdate-a54ca",
    storageBucket: "libdate-a54ca.appspot.com",
    messagingSenderId: "53983860863"
};

export default class AccountService {
    init() {
        firebase.initializeApp(FIREBASE_CONFIG);
        this.db = firebase.firestore();
        window.firebase = firebase;

        firebase.auth().onAuthStateChanged(this.checkLogin.bind(this));
    }

    checkLogin() {
        let user = firebase.auth().currentUser;

        firebase.auth().getRedirectResult()
            .then(result => {
                if (result.user) {
                    this.createUser(result);
                } else if (!user) {
                    this.login();
                }
            });
    }

    login() {
        var githubProvider = new firebase.auth.GithubAuthProvider();

        return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => firebase.auth().signInWithRedirect(githubProvider))
            .catch(error => {
                console.error(error);
            });
    }

    createUser(result) {
        let user = result.additionalUserInfo.username;
        let githubToken = result.credential.accessToken;
        let uid = result.user.uid;

        this.db.collection('users').doc(user).set({
            user,
            githubToken,
            uid,
        }).then(() => {
            console.log('success');
        }).catch(error => console.error(error));
    }
}