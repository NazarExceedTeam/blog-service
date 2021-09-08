const commentModel = require('../connectionComments').comment
const postModel = require('../connectionPosts').post
const statusOK = {code: 200, description: 'OK'}
const statusErr = {code: 400, description: 'Bad Request'}

module.exports.createComment = async (req, res) => {
    try {
        const {author, post, text} = req.body
        if (existPost(post)){
            return res.status(statusErr.code).json({message: 'This post not exists!'})
        }
        commentModel.create({
            author: author,
            post: post,
            text: text,
            date_time: Date.now()
        })
        return res.status(statusOK.code).json({message: 'Comment posted!'})
    } catch (e) {
        return res.status(statusErr.code).json({message: e.message})
    }
}

module.exports.findCommentsByPost = async (req, res) => {
    try {
        const {post} = req.body
        if (existPost(post)){
            return res.status(statusErr.code).json({message: 'This post not exist!'})
        }
        const findedComments = await commentModel.findAll({
            attributes: ['id', 'author', 'text', 'date_time'],
            where: {
                post: post
            }
        })
        console.log(findedComments[0])
        if (findedComments[0] === undefined){
            return res.status(statusErr.code).json({message: 'This post haven\'t comments!'})
        }
        return res.status(statusOK.code).json(findedComments)
    } catch (e){
        console.log(e.message)
        return res.status(statusErr.code).json({message: e.message})
    }
}

module.exports.deleteComment = async (req, res) => {
    try {
        const {id, author} = req.body
        const findedComment = await commentModel.findOne({
            attributes: ['id', 'author'],
            where: {
                id: id,
            }
        })
        if (findedComment === null){
            return res.status(statusErr.code).json({message: 'This comment not exists!'})
        }
        if (findedComment.author != author){
            return res.status(statusErr.code).json({message: 'You haven\'t access to this comment!'})
        }
        findedComment.destroy()
        return res.status(statusOK.code).json({message: 'Comment deleted!'})
    } catch (e){
        console.log(e.message)
        return res.status(statusErr.code).json({message: e.message})
    }
}

function existPost(id) {
    const findedPost = postModel.findOne({
            attributes: ['id'],
            where: {
                id: id
            }
        })
        return findedPost === null
}