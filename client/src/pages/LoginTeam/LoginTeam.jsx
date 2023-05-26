import React, { useReducer, useEffect, useMemo } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';
import {BiShow} from 'react-icons/bi';
import { useHistory } from 'react-router-dom';

// Initial state for the reducer
const initialState = {
  showPassword:false,
  team: {
    email: "",
    password: "",
  },
  error: null,
};

// Reducer function with the actions for updating the state
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SHOW_PASSWORD':
      return { ...state, showPassword: action.payload };
    case 'SET_TEAM':
      return { ...state, team:{...state.team, ...action.payload} };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      throw new Error('Invalid action type');
  }
};
// Principal component for the login page
const LoginTeam = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();

//  Change the state to show or hide the password
  const handleShowPassword = () => {
    dispatch({ type: 'SET_SHOW_PASSWORD', payload: !state.showPassword });
  };

  //Update the state with the team data when the team types
  const handleChange = (e) => {
    dispatch({ type: 'SET_TEAM', payload: { [e.target.name]: e.target.value } });
  };

  //Process the errors after the call http
  const handleErrorResponse = (error) => {
    if (error && error.response && error.response.status === 401) {
      return 'Email o contraseña incorrectos. Por favor, inténtelo de nuevo.';
    }
    return 'Ha ocurrido un error. Por favor, inténtelo de nuevo más tarde.';
  };

  //Login if the data its correct
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/loginTeam', state.team);
      console.log(response.data.team)
      dispatch({ type: 'RESET' });
      history.push('/team');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: handleErrorResponse(error) });
    }
  };

  //Disable the button if the team or password are empty
  const disabled = useMemo(() => {
    return !state.team.email.trim() || !state.team.password.trim();
  }, [state.team.email, state.team.password]);

  useEffect(() => {
    if (state.error) {
      console.log(state.error);
    }
  }, [state.error]);


  // render the login form with the state and the actions
  return (
    <>
      <Navbar  currentPage="" />
      <div className='container'>
        <form className='form-login' onSubmit={handleLogin}>
          {state.error && <div className='error'>{state.error}</div>}
          <h2 className='title-login'>Welcome </h2>

          <label>Email</label>
          <div className='email-container'>
            <input
              type='email'
              id='email'
              name='email'
              value={state.team.email}
              onChange={handleChange}
              required
            />
          </div>
          <label>Password</label>
          <div className='password-container'>
            <input
              type={state.showPassword ? 'text' : 'password'}
              id='password'
              name='password'
              value={state.team.password}
              onChange={handleChange}
              required
            />
            <BiShow className='show-password' onClick={handleShowPassword} />
          </div>
          <button  type="submit" className="btn" disabled={disabled}>
            Login
          </button>
        </form>
      </div>
    </>
  );
};
export default LoginTeam;
