import React from 'react'
import { useSelector } from 'react-redux';

//Material UI
import { Grid, CircularProgress, Typography } from '@material-ui/core';

//Component
import Post from './Post/Post'

//Styles
import useStyles from './styles';

export default function Posts({ setCurrentId }) {

    const classes = useStyles();
    const { posts, isLoading } = useSelector((state) => state.posts);
    
    if (!posts.length && !isLoading) return (
        <Typography variant='h2' alignItem='center' justifyContent='center' >No Posts</Typography>
    );
    
    return (
        isLoading ? <CircularProgress /> : (
            <Grid className={classes.container} container alignitem='stretch' spacing={3}>
                {posts.map(post => (
                    <Grid key={post._id} item xs={12} sm={12} md={6} lg={3} >
                        <Post setCurrentId={setCurrentId} post={post} />
                    </Grid>
                ))}
                
            </Grid>
        )
  )
}
