const express = require("express");
const dayjs = require("dayjs");
const Posts = require("../schemas/post.js");
const Comments = require("../schemas/comment.js");
const router = express.Router();

//comment 목록 조회 api
router.get("/comments/:_postId", async (req,res) => {
    const {_postId} = req.params;
    const [commentList] = await Comments.find({_postId});
    res.json({commentList});
});


//comment 생성
router.post("/comments/:_postId" ,async (req,res) =>{
    const {_postId} = req.params;
    const {user,content,password} = req.body;

    let now = dayjs();
    let date = now.format("YYYY-MM-DD");

    const createdComments = await Comments.create({_postId, user, content, password, date});
    res.status(200).json({message: "댓글을 생성하였습니다."});
});
router.put("/comments/:_id", async (req, res) => {
    const {_id} = req.params;
    const {text} = req.body;
    const {password} = req.body;

    // 없을 때

    const [existPosts] = await Posts.find({postNum});
    
    if (!existPosts){
        return res.status(400).json({ success: false, errorMessage: "해당 게시물이 없습니다."});
    }
    
    // 있을 때

    if (Number(password) !== Number(existPosts.password)){

        return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀립니다."});

    }
    
    await Posts.updateOne({postNum}, {$set: {text}});


    res.status(200).json({ success: true});
});
// 게시글 삭제 API
// API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기

router.delete("/comments/:_id", async (req, res) => {

    const { _id } = req.params;
    const { password } = req.body;

    const existPosts = await Posts.find({postNum});

    if (existPosts.length){

        await Posts.deleteOne({postNum});
        // if (Number(password) === Number(existPosts.password)){
        //     await Posts.deleteOne({data});
        // }else{
        //     return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀립니다."});
            
        // }
    }
    res.status(200).json({ success: true});
});


module.exports = router;