const express = require("express");
const dayjs = require("dayjs");
const router = express.Router();
const Posts = require("../schemas/post.js");
const authMiddelware = require("../middlewares/auth-middelware.js");

//게시글 목록 조회
router.get("/posts", async (req, res) => {
  const [data] = await Posts.find();

  res.json({
    data,
  });
});
//게시글 상세 조회 api
router.get("/posts/:_id", async (req, res) => {
  const { _id } = req.params;
  const [data] = await Posts.find({ _id });
  res.json({ data });
});

//게시물 생성
router.post("/posts/", authMiddelware, async (req, res) => {
  const {userId} = res.locals.user;
  const { title, content } = req.body;
  const posts = await Posts.find({ title, userId });

  let now = dayjs();
  let date = now.format("YYYY-MM-DD");

  if(title,content === null){
    res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다."})
  }

  const createdPosts = await Posts.create({
    userId,
    title,
    content,
    date,
  });

  res.status(200).json({ message: "게시글을 작성에 성공하였습니다." });
});

// 타이틀로 목록 조회
router.get("/posts/:title", (req, res) => {
  const { title } = req.params;

  res.json({
    detail: Posts.filter((item) => {
      return item.title === title;
    })[0],
  });
});

// 작성자명으로 조회

router.get("/posts/:user", (req, res) => {
  const { user } = req.params;

  res.json({
    detail: Posts.filter((item) => {
      return item.user === user;
    })[0],
  });
});

// 작성 날짜로 조회

router.get("/posts/:date", (req, res) => {
  const { date } = req.params;

  res.json({
    detail: Posts.filter((item) => {
      return item.date === date;
    })[0],
  });
});

// 게시글 수정 API
// - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기

router.put("/posts/:_id", authMiddelware, async (req, res) => {
  const {userId} = res.locals.user;
  const { _id } = req.params;
  const { title, content } = req.body;

  // 없을 때

  const [existPosts] = await Posts.find({ _id, userId});

  if (!existPosts) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "해당 게시물이 없습니다." });
  }

  await Posts.updateOne({ userId,_id }, { $set: { title, content } });

  res.status(200).json({ message: "게시글을 수정하였습니다." });
});
// 게시글 삭제 API
// API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기

router.delete("/posts/:_id", authMiddelware, async (req, res) => {
  const {userId} = res.locals.user;
  const { _id } = req.params;

  const [existPosts] = await Posts.find({ userId, _id });

  if (!existPosts) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "게시물 조회에 실패하였습니다." });
  } else {
    if (existPosts.length) {
      await Posts.deleteOne({ userId, _id });
    }
  }
  res.status(200).json({ message: "게시글을 삭제하였습니다." });
});

module.exports = router;
