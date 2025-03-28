import React, { useState } from "react";
import "./styles/signUpPage.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {backendUrl} from "./constant.js";

const firebaseConfig = {
  apiKey: "AIzaSyDh1UQ92aWOpYJsCTaYEn66J7V9Pdqvfd4",
  authDomain: "sumbook-ali.firebaseapp.com",
  projectId: "sumbook-ali",
  storageBucket: "sumbook-ali.firebasestorage.app",
  messagingSenderId: "255469526663",
  appId: "1:255469526663:web:60650ecfe8a63c592b2222",
  measurementId: "G-5PDNMHYS02",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
auth.useDeviceLanguage();
const provider = new GoogleAuthProvider();





axios.defaults.withCredentials = true;


const SignUpPage = () => {
  console.log(JSON.parse(localStorage.getItem("user")))
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  console.log(user)
  const backendUrl = useSelector((state) => state.url.url);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedUp, setSignedUp] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/sign-up-email`,
        { email, password, type: 'email' },  
        { withCredentials: true }          
      );
      console.log(response)

      if (response.status === 200) {
        setSignedUp(true);
        const user = {
          uid:response.data.user.uid,
          type:"email"
        }
        localStorage.setItem("user", JSON.stringify(user));
        setError(null);
      } else {
        setSignedUp(false);
        setError("Failed to sign up");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred. Please try again.");
      setSignedUp(false);
    } finally {
      setLoading(false);
    }

    const checkAuth = async () =>{

      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user)
      const res = await axios.post(
        `${backendUrl}/auth/status`,
        {
          uid: user.uid,
          type: "email"
        },
        {
          withCredentials: true
        }
      );

      console.log(res)
      if(res.data.loggedIn){
        dispatch(login({uid:res.data.userId , type:res.data.type}))

        navigate('/')
      }
    }
    checkAuth()
   
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken; // token for API access if needed
      const user = result.user;

      // Ensure backendUrl is available before making the request
      if (!backendUrl) {
        setError("Backend URL is not defined.");
        return;
      }

      const response = await axios.post(`${backendUrl}/sign-up-google`, {
        displayName : user.displayName,
        email : user.email,
        uid: user.uid,
        type:'google',
      });

      console.log(response); // Logs the response from your backend

      // Store user data in localStorage like in email sign-up
      const userData = {
        uid: user.uid,
        type: 'google'
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // Use the same auth check logic as email sign-up
      const checkAuth = async () =>{
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user)
        const res = await axios.post(
          `${backendUrl}/auth/status`,
          {
            uid: user.uid,
            type: user.type
          },
          {
            withCredentials: true
          }
        );

        console.log(res)
        if(res.data.loggedIn){
          dispatch(login({uid:res.data.userId , type:res.data.type}))
          navigate('/')
        }
      }
      checkAuth()

    } catch (error) {
      // Handle errors from the sign-in process
      console.log("Error during Google Sign In:", error.message);
      setError("Google sign-in failed. Please try again.");
    }
  };

  
  


  return (
    <div className="signupPage">
    <div className="signup-container">
      <h2 className="signup-title">Create an Account</h2>

      <form className="signup-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {loading ? (
          <button type="button" className="signup-btn" disabled>
            Loading...
          </button>
        ) : (
          <button type="button" className="signup-btn" onClick={handleSignUp}>
            Sign Up
          </button>
        )}

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </button>
       

        <div className="signin-link">
  <p>
    Already have an account?{" "}
    <a
      href="/login"
      onClick={(e) => {
        e.preventDefault();
        navigate('/login');
      }}
      style={{ cursor: 'pointer' }}
    >
      Log in
    </a>
  </p>
</div>
      </form>
     

      {signedUp && <p className="success-message">Successfully signed up!</p>}
      {error && <p className="error-message">{error}</p>}
      
    </div>
    </div>
    
  );
};

export default SignUpPage;
