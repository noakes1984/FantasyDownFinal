// @flow
import * as firebase from "firebase";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyD-LiSTZojaA1w3Wdciwf7HI8AP6GE7zLA",
  authDomain: "react-native-fiber.firebaseapp.com",
  databaseURL: "https://react-native-fiber.firebaseio.com",
  projectId: "react-native-fiber",
  storageBucket: "react-native-fiber.appspot.com",
  messagingSenderId: "387191574162"
};

const endpoint = {
    prod: "https://us-central1-react-native-fiber.cloudfunctions.net/api",
    dev: "http://localhost:5000/react-native-fiber/us-central1/api"
}

export default class Firebase {
  
    static firestore: firebase.firestore.Firestore;
    static auth: firebase.auth.Auth;
    static storage: firebase.storage.Storage;

    static endpoint = endpoint.prod

    static init() {
        firebase.initializeApp(config);
        Firebase.auth = firebase.auth();
        Firebase.firestore = firebase.firestore();
        Firebase.storage = firebase.storage();
    }
}
