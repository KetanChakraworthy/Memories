import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

//Redux
import { useDispatch } from 'react-redux';

//Material UI
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core';
import ChipInput from 'material-ui-chip-input';

//Components
import Posts from '../Posts/Posts';
import Form from '../Form/Form'; 
import Pagination from '../Pagination/Pagination'

//Actions
import { getPostsBySearch } from '../../actions/posts';

//Style
import useStyles from './styles';

function useQuery(){
  return new URLSearchParams(useLocation().search);
}


export default function Home() {

  const [currentId, setCurrentId] = useState();
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);


  const classes = useStyles();
  const dispatch = useDispatch();
  const query = useQuery();
  const history = useHistory();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');


  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  }
  const handleAdd = (tag) => {
    setTags([...tags, tag]);
  }
  const handleDelete = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));

  }
  const searchPost = () => {
    if (search.trim() || tags) {
    
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);

    } else {
      history.push('/');
    }
  }

  return (
    <Grow in>
        <Container maxWidth='xl' >
          <Grid className={classes.gridContainer} container justifyContent='space-between' alignItems='stretch' spacing={3} >
            <Grid item xs={12} sm={6} md={9} >
              <Posts setCurrentId={setCurrentId} />
            </Grid>
          <Grid item xs={12} sm={6} md={3} >
            <AppBar className={classes.appBarSearch} position='static' color='inherit' >
              <TextField
                name='search'
                label='Search Memories'
                variant='outlined'
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <ChipInput
                style={{ margi: '10px 0' }}
                value={tags} 
                onAdd={handleAdd}
                onDelete={handleDelete}
                label='Search Tags'
                variant='outlined'
              />
              <Button className={classes.searchButton} disabled={search === '' && tags === []} variant='contained' color='primary' onClick={searchPost} >Search</Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {(!searchQuery && !tags.length) && (
              <Paper elevation={6} className={classes.pagination} >
                <Pagination page={page} />
              </Paper>
            ) }
            </Grid>
          </Grid>
        </Container>
      </Grow>
  )
}
