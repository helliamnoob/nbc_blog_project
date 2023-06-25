const express = require("express");
const dayjs = require("dayjs");
const Comments = require("../schemas/comment.js");
const authMiddelware = require("../middlewares/auth-middelware.js");
const router = express.Router();

//comment 목록 조회 api
router.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const commentList = await Comments.find({ postId });
  res.json({ commentList });
});

//comment 생성
router.post("/posts/:postId/comments", authMiddelware, async (req, res) => {
  const {userId} = res.locals.user;
  const { postId } = req.params;
  const { content } = req.body;

  let now = dayjs();
  let date = now.format("YYYY-MM-DD");
  if(content === null)
  {
    res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."})
  }
  else {
    const createdComments = await Comments.create({
      postId,
      userId,
      content,
      date,
    });
  }
  res.status(201).json({ message: "댓글을 작성하였습니다." });
});

//comment 수정
router.put("/posts/:postId/comments/:commentId", authMiddelware, async (req, res) => {
  const {userId} = res.locals.user;
  const { postId, commentId } = req.params;
  const { content } = req.body;

  const [existComments] = await Comments.find({ postId, userId });

  if (!existComments) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "해당 게시물이 없습니다." });
  }
  await Comments.updateOne({userId, commentId }, { $set: { content } });
  res.status(200).json({ message: "댓글을 수정하였습니다." });
});

// 게시글 삭제 API
// API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기
router.delete("/posts/:postId/comments/:commentId", authMiddelware, async (req, res) => {
  const {userId} = res.locals.user;
  const { postId, commentId} = req.params;

  const [existComments] = await Comments.find({ postId, userId});

  if (!existComments) {
    return res
      .status(404)
      .json({ success: false, errorMessage: "댓글이 존재하지 않습니다." });
  } else {
      await Comments.deleteOne({ commentId, userId});
  }
  res.status(200).json({ message: "댓글을 삭제하였습니다." });
});

module.exports = router;
