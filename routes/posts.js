const express = require("express");
const dayjs = require("dayjs");
const router = express.Router();

//게시글 목록 조회
router.get("/posts", async (req, res) => {

    const posts = await Posts.find();

    res.json({

        posts,
    });

});
//comment 상세 조회 api
router.get("/posts/:postNum", (req,res)=>{
    const {postNum} = req.params;
    const [detail] = comments.filter((comments) => comments.postNum === Number(postNum));
    res.json({detail});
});
//게시물 
const Posts = require("../schemas/post.js");
router.post("/posts/", async (req, res) => {
    const {postNum, title, name, text, password} = req.body;
    const posts = await Posts.find({ postNum });

    let now = dayjs();
    let date = now.format('YYYY-MM-DD');

    if (posts.length) {
      return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
    }
  
    const createdPosts = await Posts.create({ postNum, title, name, text, password, date });
  
    res.json({ posts: createdPosts });
    
  
  
});
// 타이틀로 목록 조회
router.get("/posts/:title", (req, res)=>{

    const {title} = req.params;


    res.json({


        detail: posts.filter((item)=>{

            return item.title === title;

        })[0],

    });

});


// 작성자명으로 조회 

router.get("/posts/:name", (req, res)=>{

    const {name} = req.params;


    res.json({


        detail: Posts.filter((item)=>{

            return item.name === name;

        })[0],

    });

});

// 작성 날짜로 조회

router.get("/posts/:date", (req, res)=>{

    const {date} = req.params;


    res.json({


        detail: Posts.filter((item)=>{

            return item.date === date;

        })[0],

    });

});

// 게시글 수정 API
// - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기

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