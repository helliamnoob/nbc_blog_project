const express = require("express");
const dayjs = require("dayjs");
const router = express.Router();
const Posts = require("../schemas/post.js");

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
router.post("/posts/", async (req, res) => {
  const { title, user, content, password } = req.body;
  const posts = await Posts.find({ title });

  let now = dayjs();
  let date = now.format("YYYY-MM-DD");

  if (posts.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "이미 있는 데이터입니다." });
  }

  const createdPosts = await Posts.create({
    title,
    user,
    content,
    password,
    date,
  });

  res.status(200).json({ message: "게시글을 생성하였습니다." });
});
// 타이틀로 목록 조회
router.get("/posts/:title", (req, res) => {
  const { title } = req.params;

  res.json({
    detail: posts.filter((item) => {
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

router.put("/posts/:_id", async (req, res) => {
  const { _id } = req.params;
  const { user, title, content, password } = req.body;

  // 없을 때

  const [existPosts] = await Posts.find({ _id });

  if (!existPosts) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "해당 게시물이 없습니다." });
  }

  // 있을 때

  if (Number(password) !== Number(existPosts.password)) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "비밀번호가 틀립니다." });
  }

  await Posts.updateOne({ _id }, { $set: { user, title, content } });

  res.status(200).json({ success: true });
});
// 게시글 삭제 API
// API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기

router.delete("/posts/:_id", async (req, res) => {
  const { _id } = req.params;
  const password = req.body.password;

  const [existPosts] = await Posts.find({ _id });

  if (!existPosts) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "게시물 조회에 실패하였습니다." });
  } else {
    if (password === existPosts.password) {
      await Posts.deleteOne({ _id });
    } else {
      return res
        .status(400)
        .json({ success: false, errorMessage: "비밀번호가 틀립니다." });
    }
  }
  res.status(200).json({ message: "게시글을 삭제하였습니다." });
});

module.exports = router;
