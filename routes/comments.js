const express = require("express");
const dayjs = require("dayjs");
const Posts = require("../schemas/post.js");
const Comments = require("../schemas/comment.js");
const router = express.Router();

//comment 목록 조회 api
router.get("/comments/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const commentList = await Comments.find({ _postId });
  res.json({ commentList });
});

//comment 생성
router.post("/comments/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { user, content, password } = req.body;

  let now = dayjs();
  let date = now.format("YYYY-MM-DD");

  const createdComments = await Comments.create({
    _postId,
    user,
    content,
    password,
    date,
  });
  res.status(200).json({ message: "댓글을 생성하였습니다." });
});

//comment 수정
router.put("/comments/:_id", async (req, res) => {
  const { _id } = req.params;
  const { content, password } = req.body;

  const [existComments] = await Comments.find({ _id });

  if (!existComments) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "해당 게시물이 없습니다." });
  }

  if (Number(password) === Number(existComments.password)) {
    await Comments.updateOne({ _id }, { $set: { content } });
  } else {
    return res
      .status(400)
      .json({ success: false, errorMessage: "비밀번호가 틀립니다." });
  }

  res.status(200).json({ message: "댓글을 수정하였습니다." });
});
// 게시글 삭제 API
// API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기

router.delete("/comments/:_id", async (req, res) => {
  const { _id } = req.params;
  const { password } = req.body;

  const [existComments] = await Comments.find({ _id });

  if (!existComments) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "댓글 조회에 실패하였습니다." });
  } else {
    if (Number(password) === Number(existComments.password)) {
      await Comments.deleteOne({ _id });
    } else {
      return res
        .status(400)
        .json({ success: false, errorMessage: "비밀번호가 틀립니다." });
    }
  }
  res.status(200).json({ message: "댓글을 삭제하였습니다." });
});

module.exports = router;
