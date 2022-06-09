import React, { useEffect, useState } from 'react';
import dotenv from 'dotenv';

//Google Login
import { GoogleLogin } from 'react-google-login';
//Google API
import { gapi } from 'gapi-script';

//Material UI
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
//Icon
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined';

//Styles
import useStyles from './styles';

//Component
import Input from './Input';
import Icon from './Icon';
import { useDispatch } from 'react-redux';

import { AUTH } from '../../constants/actionTypes';
import { useHistory } from 'react-router-dom';

import { signin, signup } from '../../actions/auth';

dotenv.config();


export default function Auth() {

  const CLIENTID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const [showPassword, setShowPassword] = useState();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });


  const dispatch = useDispatch();
  const history = useHistory();

  const classes = useStyles();

  useEffect(() => {
    function start() {
      gapi.auth2.init({
        clientId: CLIENTID,
        scope: ''
      })
    }
    gapi.load('client:auth2', start);
  },[CLIENTID]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      dispatch(signup(formData, history));
      
    } else {
      dispatch(signin(formData, history));
      
    }
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const handleShowPassword = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  }
  const switchMode = () => {
    setIsSignUp(prevIsSignUp => !prevIsSignUp);
    setShowPassword(false);
  }
  const googleSucces = async (res) => {
    
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      
      dispatch({ type: AUTH, payload: { result, token } });
      history.push('/');
      
    } catch (error) {
      console.log(error)
    }

  }
  const googleFailure = (error) => {
    console.log('Google Sign In was Unsuccessful, Try Again Later');
    console.log(error);
  }

  return (
    <Container component='main' maxWidth='xs' >
      <Paper className={classes.paper} elevation={3} >
        <Avatar className={classes.avatar} >
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant='h5'>{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit} >
          <Grid container spacing={2} >
            {
              isSignUp && (
                <>
                  <Input name='firstName' label='First Name' handleChange={handleChange} autoFocus half />
                  <Input name='lastName' label='Last Name' handleChange={handleChange} half />
                </>
              )
            }
            <Input name='email' label='Email Address' handleChange={handleChange} type='email' />
            <Input name='password' label='Password' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            {isSignUp && <Input name='confirmPassword'  label='Repeat Password' handleChange={handleChange} type='password' />}
          </Grid>
          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit} >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <GoogleLogin
            clientId={CLIENTID}
            onSuccess={ googleSucces }
            onFailure={googleFailure}
            cookiePolicy='single_host_origin'
            render={(renderProps) => (
              <Button 
                className={classes.googleButton}
                variant='contained'
                color='primary'
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
              >
                Google Sign In
              </Button>
            )}
          />
          <Grid container justifyContent='flex-end'  >
            <Grid item >
              <Button onClick={switchMode}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an Account Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}
