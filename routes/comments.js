const express = require("express");

const router = express.Router();

// const comments=[
//     {
//         postNum: 1,
//         name: "jj",
//         comments: "ss",
//         pssowrd: 1234,
//     }
// ]
//comment 목록 조회 api
const Comments = require("../schemas/comment.js");
router.get("/posts/:postNum/comments", async (req,res) => {
    const {number} = req.params;
    const [commentList] = await Comments.find({number});
    res.json({commentList});
});


//comment 생성
router.post("/posts/:postNum/comments/",async (req,res) =>{
    const {postNum} = req.params;
    const {name,text,password} = req.body;
    let number = postNum[0];

    const createdComments = await Comments.create({number, name, text, password});
    res.json({comments: createdComments});
});
router.put("/posts/:postNum", async (req, res) => {
    const {postNum} = req.params;
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

router.delete("/posts/:postNum", async (req, res) => {

    const { postNum } = req.params;
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