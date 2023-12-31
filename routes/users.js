const express = require("express");
const router = express.Router();
const userSchema = require("../schemas/user.js");
const authMiddelware = require("../middlewares/auth-middelware.js");

//내정보 조회
router.get("/users/me", authMiddelware, async(req,res)=> {
    const {nickname} = res.locals.user;
    res.status(200).json({
        user:{
            nickname: nickname,
        }
    });
});


router.post('/signup', async(req,res)=>{
    const { nickname, password, confirm} = req.body;
    //패스워드와 패스워드 확인 성공
    if( password != confirm){
        res.status(400).json({
            errorMessage: "패스워드와 전달된 패스워드 확인값이 일치하지 않습니다.",
        });
        return;
    }
    //nickname 실제로 DB존재하는지 확인
    const isExistUser = await userSchema.findOne({nickname});
    if(isExistUser){
        res.status(400).json({
            errorMessage: "이메일 또는 닉네임이 이미 사용중입니다."
        });
        return;
    };
    const user = new userSchema({nickname, password});
    await user.save();

    return res.status(201).json({message: '회원 가입에 성공하였습니다.'});
});



module.exports = router;