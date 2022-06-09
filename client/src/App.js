import React from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'
//Material UI
import { Container } from '@material-ui/core';

import './index.css';

//component
import NavBar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth'
import PostDetails from './components/PostDetails/PostDetails';


function App() {

  const user = JSON.parse(localStorage.getItem('profile'));
  

  return (
    <BrowserRouter>
      <Container maxWidth='xl'>
        <NavBar />
        <Switch>
        <Route path='/' exact component={()=><Redirect to='/posts' />} />
          <Route path='/posts' exact component={Home} />
          <Route path='/posts/search' exact component={Home} />
          <Route path='/posts/:id' component={PostDetails} />
          <Route path='/auth' exact component={()=>(!user ? <Auth /> : <Redirect to='/posts' />) } />
        </Switch>
      </Container>
    </BrowserRouter>
  );
}

export default App;
