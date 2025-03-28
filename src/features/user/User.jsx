import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './userSlice';

export default function User() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);  // This gets the full state object for 'user'

  // Debugging output to check the structure of 'user'
  console.log(user);  // Check the state structure in the console

  return (
    <>
      <h1>User</h1>
      {/* Ensure user.loggedIn is accessed correctly */}
      <p>{user.loggedIn ? 'Logged In' : 'Logged Out'}</p>
      <p>end</p>

      {/* Buttons for login and logout */}
      <button onClick={() => dispatch(login())}>Log In</button>
      <button onClick={() => dispatch(logout())}>Log Out</button>
    </>
  );
}
