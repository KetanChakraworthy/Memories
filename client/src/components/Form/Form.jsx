import React, { useEffect, useState } from 'react'
import FileBase from 'react-file-base64'
import { useDispatch, useSelector } from 'react-redux';

//Material UI
import { Paper, Typography, Button, TextField } from '@material-ui/core';

//Styles
import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';
import { useHistory } from 'react-router-dom';


export default function Form({ currentId, setCurrentId }) {

  const user = JSON.parse(localStorage.getItem('profile'));

  const post = useSelector(state => currentId ? state.posts.posts.find(p => p._id === currentId) : null);

  useEffect(() => {
    if (post) {
      setPostData(post);
    }
  },[post])

  const [postData, setPostData] = useState({
    message: '',
    title: '',
    tags: '',
    selectedFile: ''
  });

  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentId) {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
      
    } else {
      dispatch(createPost({ ...postData, name: user?.result?.name },history));
    }
    clear(e);

  };
  const clear = (e) => {
    e.preventDefault();

    setCurrentId(null);
    setPostData({
      message: '',
      title: '',
      tags: '',
      selectedFile: ''
    })

  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} >
        <Typography variant='h6' alignitem='center'>
          Please Sign in to Create your Own Memories and Like others Memories
        </Typography>
      </Paper>
    )
  }
  
  return (
    <Paper className={classes.paper} elevation={6} >
      <form autoComplete='off' className={`${classes.root} ${classes.form}`} onSubmit={ handleSubmit } >
        <Typography variant='h6' > {currentId ? 'Editing':'Creating'} a Memory</Typography>

        <TextField
          name='title'
          variant='outlined'
          label='Title'
          fullWidth
          value={postData.title}
          onChange={(e) => { setPostData({ ...postData, title: e.target.value }) }}
        />

        <TextField
          name='message'
          variant='outlined'
          label='Message'
          fullWidth
          value={postData.message}
          onChange={(e) => { setPostData({ ...postData, message: e.target.value }) }}
        />

        <TextField
          name='tags'
          variant='outlined'
          label='Tags'
          fullWidth
          value={postData.tags}
          onChange={(e) => { setPostData({ ...postData, tags: e.target.value.split(",") }) }}
        />
        <div className={classes.fileInput} >
          <FileBase
            type='file'
            multiple={false}
            onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })}
          />
        </div>
        <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type='submit' fullWidth >
          Submit
        </Button>
        <Button variant='contained' color='secondary' size='small' fullWidth onClick={clear} >
          Clear
        </Button>
      </form>
    </Paper>
  )
}
