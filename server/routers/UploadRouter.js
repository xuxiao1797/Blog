const express = require("express");
const router = express.Router();
const fs = require("fs")
const { db, genid } = require("../db/DbUtils")

router.post("/upload", async (req, res) => {
   if(!req.files){
    res.send({
      "errno":1,
      "message":"失败"
    })
    return
   }

   let files = req.files;
   let ret_files = [];

   for(let file of files){
    //文件名后缀
    let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".")+1)

    //随机文件名
    let file_name = genid.NextId() + "." + file_ext

    fs.renameSync(
      process.cwd() + "/public/upload/temp/" + file.filename,
      process.cwd()+ "/public/upload/" + file_name
    )
      ret_files.push("/upload/" + file_name)
   }

   res.send({
    "errno": 0,
    "data": {
      "url" : ret_files[0]
    }
   })
   
})

module.exports = router