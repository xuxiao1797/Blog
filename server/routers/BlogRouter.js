const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils")

//添加，修改，删除，查询

//添加
router.post("/_token/add", async (req, res) => {
   let {title,categoryId,content} = req.body
   let id = genid.NextId()
   let create_time = new Date().getTime()

   const insert_sql = "insert into 'blog'('id','title','category_id','content','create_time') VALUES (?,?,?,?,?)"

   let params = [id,title,categoryId,content,create_time]

   let {err,rows}  = await db.async.run(insert_sql,params)

   if(err == null){
    res.send({
      code:200,
      msg:"添加成功"
    })
   }else{
    res.send({
      code:500,
      msg:"添加失败",
      data:err
    })
   }
})


//修改
router.put("/_token/update", async (req, res) => {
  let {id,title,categoryId,content} = req.body

  const update_sql = "update 'blog' set title = ?, content = ?, category_id = ? where id = ? "

  let params = [title,content,categoryId,id]

  let {err,rows}  = await db.async.run(update_sql,params)

  if(err == null){
   res.send({
     code:200,
     msg:"修改成功"
   })
  }else{
   res.send({
     code:500,
     msg:"修改失败",
     data:err
   })
  }
})

//删除
router.delete("/_token/delete", async (req, res) => {
  let id = req.query.id
  const delete_sql = "DELETE from 'blog' where id = ?"

  let {err,rows} =  await db.async.run(delete_sql,[id])


  if(err == null){
   res.send({
     code:200,
     msg:"删除成功"
   })
  }else{
   res.send({
     code:500,
     msg:"删除失败"
   })
  }
})

//查询
router.get("/search", async (req, res) => {
  //keyword, categoryId, page, pagesize

  let {keyword,categoryId,page,pageSize} = req.query

  page = page == null ? 1 : page //没有传page参数，默认1
  pageSize = pageSize == null ? 10 : pageSize //没有传pageSize参数，默认10
  categoryId = categoryId == null ? 0 : categoryId //默认0
  keyword = keyword == null ? "" : keyword

  let params = []
  let whereSqls = []
  if(categoryId != 0){
    whereSqls.push(" category_id = ? ")
    params.push(categoryId)
  }

  if(keyword != ""){
    whereSqls.push(" (title like ? or content like ?) ")
    params.push("%" + keyword + "%")
    params.push("%" + keyword + "%")
  }

  let whereSqlStr = ""
  if(whereSqls.length > 0){
    whereSqlStr = " where " + whereSqls.join(" and ")
  }
  

  let searchSql = "select * from 'blog'" + whereSqlStr + "order by create_time DESC limit ?,?"

  let searchSqlParams = params.concat([(page-1)*pageSize,pageSize])

  let searchCountSql = "select count(*) from 'blog' " + whereSqlStr
  let searchCountParams = params

  let searchResult = await db.async.all(searchSql,searchSqlParams)

  let countResult = await db.async.all(searchCountSql,searchCountParams)

  console.log(searchSql,countResult)

  if(searchResult.err == null && countResult.err == null){
    res.send({
      code:200,
      msg:"查询成功",
      data :{
        keyword,
        categoryId,
        page,
        pageSize,
        rows:searchResult.rows,
        count:countResult.rows[0]['count(*)']
      }
    })
  }else{
    res.send({
      code:500,
      msg:"查询失败"
    })
  }



})


module.exports = router