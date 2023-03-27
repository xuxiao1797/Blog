const express = require("express");
const router = express.Router();
const {v4:uuidv4} = require("uuid")
const { db, genid } = require("../db/DbUtils")

router.post("/login",async (req,res) => {

  let {account,password} = req.body
  let {err,rows}  = await db.async.all("SELECT * from 'admin' where account = ? and password = ?",[account,password])

  if(err == null && rows.length > 0){

    let login_token = uuidv4();
    let update_token_sql = "UPDATE 'admin' set token = ? where id = ?"

    await db.async.run(update_token_sql,[login_token,rows[0].id])

    let adminInfo = rows[0]
    adminInfo.token = login_token
    adminInfo.password = ""

    res.send({
      code:200,
      msg:"登录成功",
      data:adminInfo
    })
  }else{
    res.send({
      code:500,
      msg:"登录失败",
      data: err
    })
  }


})


module.exports = router
