const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils")

router.get("/test", async (req, res) => {
    // db.all("select * from 'admin'",[],(error,rows)=>{
    //     console.log(rows)
    // })


    // db.async.all("select f* from 'admin'",[]).then((res) => {
    //     console.log(res)
    // })

    let out = await db.async.all("select * from 'admin'", []);

    res.send({
        id: genid.NextId(),
        out
    })
})

module.exports = router


