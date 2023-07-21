const firebaseConfig = {
    apiKey: "AIzaSyCMZHKLeMaNV5FX8USnq8ramPeq6Bx1YEc",
    authDomain: "salesanalyser-9a0b3.firebaseapp.com",
    projectId: "salesanalyser-9a0b3",
    storageBucket: "salesanalyser-9a0b3.appspot.com",
    messagingSenderId: "203125898322",
    appId: "1:203125898322:web:51ce6d9e4a7de4fe20338b"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();