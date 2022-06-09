import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.REACT_APP_API_URL;

const API = axios.create({ baseURL: url });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
})

//Post
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);

export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);

export const fetchPost = (id) => API.get(`/posts/${id}`);

export const createPost = (newPost) => API.post('/posts', newPost);

export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);

export const deletePost = (id) => API.delete(`posts/${id}`);

export const likePost = (id) => API.patch(`posts/${id}/likePost`);

export const comment = (value, id) => API.post(`posts/${id}/commentPost`, { value });

//User

export const signin = (formData) => API.post('/users/signin', formData);

export const signup = (formData) => API.post('/users/signup', formData); 


