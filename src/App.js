// React Imports
import React from 'react';
import './App.css';

// Firebase SDK Imports
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Import Hooks to simplify dealing with Firebase from React
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// config to setup/idnetify this Firebase App
firebase.initializeApp({
  apiKey: "AIzaSyA3gcSmHkWV-q-s6H2Rid23-T6Hp84h2KA",
  authDomain: "realtime-chat-8c0c4.firebaseapp.com",
  databaseURL: "https://realtime-chat-8c0c4.firebaseio.com",
  projectId: "realtime-chat-8c0c4",
  storageBucket: "realtime-chat-8c0c4.appspot.com",
  messagingSenderId: "1080600183316",
  appId: "1:1080600183316:web:c3b3adf279564575c35d01",
  measurementId: "G-SYKMTR0N2"
})

// References to SDKs as global variables
const auth = firebase.auth();
const firestore = firebase.firestore();

// Main App Component
function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

export default App;
