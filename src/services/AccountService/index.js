import * as firebase from 'firebase';

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
    }

    login() {
        var githubProvider = new firebase.auth.GithubAuthProvider();

        firebase.auth().signInWithRedirect(githubProvider).then(result => {
            console.log(result);
        }).catch(error => {
            console.error(error);
        });
    }
}