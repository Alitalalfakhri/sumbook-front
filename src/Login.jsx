import "./styles/loginPage.css";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { backendUrl } from "./constant.js";
import { useDispatch, useSelector } from "react-redux";
import { login } from './features/user/userSlice';
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";


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

axios.withCredentials = true;

export default function Login() {
   const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [loading , setLoading] = useState(false);
  
  useEffect(() =>{
    if (user.loggedIn === true) {
      navigate("/");
    } 
  } , [])

  
 

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

        const response = await axios.post(`${backendUrl}/login-google`, {
          uid: user.uid,
          type: 'google',
        });

        // Handle the response if needed
        if (response.status === 200) {
          const checkAuth = async () =>{

            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(user)
            const res = await axios.post(
              `${backendUrl}/auth/status`,
              {
                uid: user.uid,
                type: 'google'
              },
              {
                withCredentials: true
              }
            );

            console.log(res)
            if(res.data.loggedIn){
              dispatch(login({uid:res.data.userId , type:res.data.type}))
              navigate("/");

            }
          }
          checkAuth()
        }
      
    } catch (error) {
      // Handle errors from the sign-in process
      console.log("Error during Google Sign In:", error.message);
      setError("Google sign-in failed. Please try again.");
    }
  };

  const handelEmailLogin = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors

      const response = await axios.post(`${backendUrl}/login-email`, {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify({
          uid: response.data.user.uid,
          type: 'email'
        }));

        // Verify auth status
        const authResponse = await axios.post(
          `${backendUrl}/auth/status`,
          {
            uid: response.data.user.uid,
            type: 'email'
          },
          { withCredentials: true }
        );

        if (authResponse.data.loggedIn) {
          dispatch(login({
            uid: authResponse.data.userId,
            type: authResponse.data.type
          }));
          navigate("/");
        } else {
          setError("Authentication verification failed");
        }
      }
    } catch (error) {
      console.error("Email login error:", error);

      // Improved error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.data.errors) {
          // Validation errors from express-validator
          setError(error.response.data.errors.map(err => err.msg).join(', '));
        } else if (error.response.data.message) {
          // Custom error messages from backend
          setError(error.response.data.message);
        } else {
          setError("Login failed - server error");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server - please try again");
      } else {
        // Something happened in setting up the request
        setError("Login failed - please check your connection");
      }
    } finally {
      setLoading(false); // This will always run
    }
  }
  
  return (
    <>
      <div className="loginPage">
        <div className="father">
          <div className="login-container-text">
            <p className="login">login</p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
            className="login-container-inputs"
          >
            <input placeholder="email"  onChange={(e) => {
              setEmail(e.target.value)
            }}/>
            <input placeholder="password" onChange={(e) => {
            setPassword(e.target.value)
            }} />

            {loading ? (
              <button type="button" className="register" disabled>
                Loading...
              </button>
            ) : (
              <button type="button" className="register" onClick={handelEmailLogin}>
                Sign Up
              </button>
            )}
            
           
            <button className="google" onClick={() => handleGoogleSignIn()}>with google</button>
          </form>
        </div>
      </div>
    </>
  );
}