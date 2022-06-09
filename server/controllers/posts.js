import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

// Get Posts
export const getPosts = async (req, res) => {
    const { page } = req.query;


    try {

        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // Get starting Index of Every Page
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    }
    catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message });
    }
};

//Get Single Post
export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


//Get Posts By Search
export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, 'i');
        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


//Create Post
export const createPost = async (req, res) => {
    const post = req.body;

    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

    try {
        await newPost.save();
        res.status(200).json(newPost);
    }
    catch(error) {
        res.status(409).json({ message: error.message });

    }
}


//Update Post

export const updatePost = async (req,res) => {
    try {
        const { id: _id } = req.params;
        const post = req.body;

        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Post With That Id');

        const updatedPost = await PostMessage.findByIdAndUpdate(_id, {_id, ...post }, { new: true });
        res.json(updatedPost);

    } catch (error) {
        res.status(400).send(error);
    }
}

// Delete Post

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Post With That Id');

        await PostMessage.findByIdAndRemove(id);
        res.json({ message: 'Post deleted Successfully.' });

    } catch (error) {
        console.log(error)
    }
    
}

// Like Post

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.userId) return res.json({ message: 'Unauthenticated' });
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Post With That Id');
        const post = await PostMessage.findById(id);
        const index = post.likes.findIndex(id => id === String(req.userId));
        if (index === -1) {
            post.likes.push(req.userId);
        } else {
            post.likes = post.likes.filter(id => id !== String(req.userId));
        }
        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true }
    );
    res.json(updatedPost);
    } catch (error) {
        console.log(error)
    }
}

//comment Post

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        const post = await PostMessage.findById(id);
        post.comments.push(value);

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

        res.json(updatedPost);
        
    } catch (error) {
        res.json({ message: error.message });
    }

}
