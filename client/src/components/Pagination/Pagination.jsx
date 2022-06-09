import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

//Material Ui
import { Pagination, PaginationItem } from '@material-ui/lab';
//Styles
import useStyles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../actions/posts';



export default function Paginate({ page }) {
    const { numberOfPages } = useSelector(state => state.posts);
    const classes = useStyles();
    const dispatch = useDispatch();


    useEffect(() => {
        if (page) dispatch(getPosts(page));

        
    },[page,dispatch])

  return (
      <Pagination
          classes={{ ul: classes.ul }}
          count={numberOfPages}
          page={Number(page) || 1 }
          variant='outlined'
          color='primary'
          renderItem={item => (
              <PaginationItem {...item} component={Link} to={`/posts?page=${item.page}`} />
          ) }
      />
  )
}

