// @flow
import * as firebase from "firebase";
import "firebase/firestore";

var config = {
    apiKey: "AIzaSyBhuG9aWqOPeli7gKjMLi4Hw-9H12ILfFo",
    authDomain: "fantasydownfinal.firebaseapp.com",
    databaseURL: "https://fantasydownfinal.firebaseio.com",
    projectId: "fantasydownfinal",
    storageBucket: "fantasydownfinal.appspot.com",
    messagingSenderId: "381147026500"
};
//firebase.initializeApp(config);

export default class Firebase {
    static firestore: firebase.firestore.Firestore;
    static auth: firebase.auth.Auth;
    static storage: firebase.storage.Storage;

    static init() {
        firebase.initializeApp(config);
        Firebase.auth = firebase.auth();
        Firebase.firestore = firebase.firestore();
        Firebase.storage = firebase.storage();
    }
}
