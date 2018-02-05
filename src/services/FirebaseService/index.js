import * as firebase from 'firebase';
import { FIREBASE_CONFIG } from '../../constants/firebase.config';

export default class FirebaseService {
    static getInstance() {
        if (!FirebaseService.__instance) {
            FirebaseService.__instance = new FirebaseService();
        }

        return FirebaseService.__instance;
    }

    static getFirebase() {
        FirebaseService.getInstance().init();
        return firebase;
    }

    init() {
        if (!this.hasInitialized) {
            firebase.initializeApp(FIREBASE_CONFIG);
            this.hasInitialized = true;
        }
    }
}

FirebaseService.__instance = null;