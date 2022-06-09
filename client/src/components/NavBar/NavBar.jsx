import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import decode from 'jwt-decode';

//Material UI
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';

//Media
import memoriesLogo from '../../images/memories-Logo.png';
import memoriesText from '../../images/memories-Text.png';


//Styles
import useStyles from './styles';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../../constants/actionTypes';

export default function NavBar() {
    
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    

    useEffect(() => {
        const token = user?.token;
        
        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const logout = () => {
        dispatch({ type: LOGOUT });
        history.push('/');
        setUser(null);
    }

    return (
        <AppBar className={classes.appBar} position='static' color='inherit' >
            <Link to='/' className={classes.brandContainer} >
                <img src={memoriesText} alt="icon" height='45px' />
                <img className={classes.image} src={memoriesLogo} alt="icon" height='40px' />
            </Link>
            <Toolbar className={classes.toolbar}>
                {user ? (
                    <div className={classes.profile} >
                        <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl} >
                            {user.result.name.charAt(0)}
                        </Avatar>
                        <Typography className={classes.username} variant='h6' >{user.result.name}</Typography>
                        <Button variant='contained' className={classes.logout} color='secondary' onClick={logout} >LogOut</Button>
                    </div>
                ) : (
                    <Button component={Link} to='/auth' variant='contained' color='primary' >Sign IN</Button>
                )}
            </Toolbar>
        </AppBar>
  )
}
