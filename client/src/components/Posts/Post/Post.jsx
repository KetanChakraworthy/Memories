import React, { useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux';

//Maetrial UI
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
//Icons
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from'@material-ui/icons/Delete'
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"

//Styles
import useStyles from './styles';

//Reducers
import { deletePost, likePost } from '../../../actions/posts';
import { useHistory } from 'react-router-dom';


export default function Post({ post, setCurrentId }) {
  
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem('profile'));
  const [likes, setLikes] = useState(post?.likes);

  const userId = (user?.result?.googleId || user?.result?._id);
  const hasLikedPost = post.likes.find((like) => like === userId );

  const openPost = (e) => {
    history.push(`/posts/${post._id}`);
  }
  const handleUpdate = (e) => {
    e.stopPropagation(); 
    setCurrentId(post._id)
  }
  const handleLike = async () => {
    dispatch(likePost(post._id));

    if (hasLikedPost) {
      setLikes(post.likes.filter((id) => id !== userId));
      
    }else {
      setLikes([...post.likes, userId]);
    }
    
  }
  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === userId ) ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };
  
  return (
    <Card className={classes.card} raised elevation={6} >
      <div className={classes.cardAction} onClick={openPost}>
      <CardMedia className={classes.media} image={post.selectedFile} title={post.title} component='div' />
      <div className={classes.overlay}>
        <Typography variant='h6' >{post.name}</Typography>
        <Typography variant='body2' >{moment(post.createdAt).fromNow()}</Typography>
      </div>
      {
        (user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
          <div className={classes.overlay2}>
              <Button style={{ color: 'white' }} size='small' onClick={handleUpdate} >
              <MoreHorizIcon fontSize='medium' />
            </Button>
          </div>
        )}
      <div className={classes.details} >
        <Typography variant='body2' color='textSecondary'>{post.tags.map(tag => `#${tag} `)}</Typography>
      </div>
      <Typography className={classes.title} variant='h5' gutterBottom >{post.title}</Typography>
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='p' gutterBottom >{post.message}</Typography>
        </CardContent>
      </div>
      <CardActions className={classes.cardActions} >
        <Button size='small' color='primary' disabled={!user?.result} onClick={handleLike} >
          <Likes />
        </Button>
        {
          (user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (

          <Button size='small' color='secondary' onClick={() => dispatch(deletePost(post._id))}>
          <DeleteIcon fontSize='small' />
            Delete
          </Button>

          )}
      </CardActions>
    </Card>
  )
}
