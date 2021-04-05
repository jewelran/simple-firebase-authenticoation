import React, { useState } from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase-config";
firebase.initializeApp(firebaseConfig);
const App = () => {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignInUser: false,
    name: "",
    photo: "",
    password: "",
    email: "",
    error: "",
    success: false,
  });
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const isSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then((res) => {
        const { displayName, email, photoURL } = res.user;
        const isSignInUser = {
          isSignInUser: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(isSignInUser);
      });
  };

  const isSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        const isSignInUser = {
          isSignInUser: false,
          name: "",
          email: "",
          photo: "",
        };
        setUser(isSignInUser);
      });
  };
  const handleFbSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;
        console.log(user);

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
  };
  const handleChange = (event) => {
    let isFieldValid = true;
    if (event.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === "password") {
      const validatePassword = event.target.value.length > 6;
      const validateHasPassword = /\d{1}/.test(event.target.value);
      isFieldValid = validatePassword && validateHasPassword;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  };
  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const userInfo = { ...user };
          userInfo.error = "";
          userInfo.success = true;
          setUser(userInfo);
          upDateName(user.name);
        })
        .catch((error) => {
          const userInfo = { ...user };
          userInfo.error = error.message;
          userInfo.success = false;
          setUser(userInfo);
        });
    }
    if (!newUser && user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const userInfo = { ...user };
          userInfo.error = "";
          userInfo.success = true;
          setUser(userInfo);
          // console.log("sing in user info", res.user);
        })
        .catch((error) => {
          const userInfo = { ...user };
          userInfo.error = error.message;
          userInfo.success = false;
          setUser(userInfo);
        });
    }
    e.preventDefault();
  };
  // Update user information...............
  const upDateName = (name) => {
    const user = firebase.auth().currentUser;

    user
      .updateProfile({
        displayName: name,
      })
      .then(function () {
        console.log("user name update successfully");
        // Update successful.
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div className="App">
      {user.isSignInUser ? (
        <button onClick={isSignOut}>signOut</button>
      ) : (
        <button onClick={isSignIn}>signIn</button>
      )}
      <button onClick= {handleFbSignIn}>sign in facebook</button>
      {user.isSignInUser && (
        <div>
          <h1>Welcome {user.name}</h1>
          <p>YOur email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      )}
      <h1>our own Authentication</h1>
      <form onSubmit={handleSubmit}>
        {
          <input
            type="checkbox"
            onChange={() => setNewUser(!newUser)}
            name="newUser"
            id=""
          />
        }
        <label htmlFor="newUser">New user sign up</label>
        <br />
        <br />
        {newUser && (
          <input
            onBlur={handleChange}
            type="text"
            name="name"
            id=""
            placeholder="Your name"
          />
        )}
        <br />
        <br />
        <input
          onBlur={handleChange}
          type="text"
          name="email"
          id=""
          placeholder="your Email"
          required
        />
        <br />
        <br />
        <input
          onBlur={handleChange}
          type="password"
          name="password"
          id=""
          placeholder="your password"
          required
        />
        <br />
        <br />

        <input
          style={{ cursor: "pointer" }}
          type="submit"
          value={newUser ? "Sing Up" : "SignIn"}
        />
      </form>
      <p style={{ color: "red", fontWeight: "bold" }}>{user.error}</p>
      {user.success && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          User {newUser ? "Create" : "logged in"} successfully.
        </p>
      )}
    </div>
  );
};

export default App;
