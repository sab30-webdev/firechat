/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useRef } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./App.css";

firebase.initializeApp({
  apiKey: "AIzaSyADnaicnfp2DGC__UDomos3zhx5A0rh2sQ",
  authDomain: "firechat-beef5.firebaseapp.com",
  databaseURL: "https://firechat-beef5.firebaseio.com",
  projectId: "firechat-beef5",
  storageBucket: "firechat-beef5.appspot.com",
  messagingSenderId: "757282899029",
  appId: "1:757282899029:web:a641b98d358ef9be1f40dc",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>🔥</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button className="sign-in" onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  );
};

const SignOut = () => {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
};

const ChatRoom = () => {
  const scroll = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limitToLast(10);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState(" ");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      uid,
      photoURL,
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setFormValue("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={scroll}></span>
      </main>

      <form onSubmit={(e) => sendMessage(e)}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="messsage here ..."
        />
        <button type="submit" disabled={!formValue}>
          Send
        </button>
      </form>
    </>
  );
};

const ChatMessage = ({ message }) => {
  const { uid, photoURL, text } = message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="profilePhoto" />
      <p>{text}</p>
    </div>
  );
};

export default App;
