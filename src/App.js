// React Imports
import React, { useRef, useState } from 'react';
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

  // useAuthState will tell info about user, if logged in
  // user will be null if logged out
  const [user] = useAuthState(auth);
  
  return (
    <div className="App">
      <header>
        <h1>Realtime React / Firebase Chat</h1>
        <SignOut />
      </header>

      <section>
        {
          // Show chatroom if user object exists (signed in)
          // if not, sign in (null is falsy)
        }
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    // Instantiate Google auth provider, trigger sign in pop up
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    // listen for click event, then run sign in code
    <button onClick={signInWithGoogle}>Sign In with Google</button>
  );
}

function SignOut() {
  // check if current user, if true return button to trigger sign out method
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  // used to automatically scroll on new message
  const bottom = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  // make query and listen in real-time with hook
  // any changes will cause react to re-render
  const [messages] = useCollectionData(query, { idField: 'id' });

  // Instantiate useState hook, destructuring state & update function 
  const [formValue, setFormValue] = useState('');

  // Listen to onSubmit event of <form/> below
  // Take event as argument, send value of event to Firebase
  const sendMessage = async(e) => {
    // prevent page refresh on form submit
    e.preventDefault();

    const { uid, photoURL, displayName } = auth.currentUser;

    // create new document in Firebase
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL
    });

    // Reset input to be blank
    setFormValue('');

    // Now scroll back to bottom of chat (newest messages)
    bottom.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <div>
        {/*
            Check if messages array exists
            iterate over messages array with map() 
            display each message in a ChatMessage component with props
        */}
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
          
          {
            // Used to scroll chat to bottom on new message
          }
          <div ref={bottom}></div>
      </div>
      <form onSubmit={sendMessage}>
      {
        // bind input value to formValue state
        // typing into the form will trigger the onChange() event
        // by listening to onChange event, set value  of change to 
        //    formValue's state
      }
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="What's up?" />
        <button type="submit">send</button>
      </form>
    </div>
  );
}

function ChatMessage(props) {
  // Destructure message into text & uid
  const { text, uid, photoURL, displayName } = props.message;

  // use uid to determine if message was sent or received
  // apply conditional CSS class for styling
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt={`user ${displayName}`}  />
        <p>{text}</p>
      </div>
    </div>
  );
}

export default App;
