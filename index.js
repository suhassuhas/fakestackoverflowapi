const express = require('express');
const app = express()
const port = 8080
const bodyParser = require('body-parser');
const utils = require('./utils');
const fileHandler = require('./fileHandler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const e = require('dotenv').config()

app.use(bodyParser.json());

app.get('/users',(req,res) => {
   utils.getUsers().then((data)=>{
        res.status(200).json(data)
   }).catch((err)=>{
        res.status(400).json(err)
   })
});

app.post('/register',utils.checkUserInfo,async (req,res) => {
    try {
        const {registration_name,username,password} = req.body
        const salt = await bcrypt.genSalt()
        const hashedpwd = await bcrypt.hash(password,salt)
        const data ={
            registration_name,username,hashedpwd
        }
        utils.addUser(data).then((d) => {
            res.status(200).json({"message":"User Registered Succesfully"})
        }).catch((err)=>{
            res.status(500).json({"message":"Failed to Register"})
        })
    } catch(e) {
        console.log(e)
        res.status(500).send({"message":"Failed to Register !! Serv Fail"})
    }
});

app.post('/login',utils.checkUserCreditianls,async (req,res) => {
    const user = req.body
    console.log(user,process.env.ACCESS_TOKEN_SECRET)
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
    res.status(200).json({"message":"Succesfully logged in ","access_token":accessToken})

})

app.post('/question',utils.checkUserCreditianls,async (req,res) => {
    try{
        const {title,body} = req.body.question
        let qid = await fileHandler.readqid()
        fileHandler.updateqid().then((msg)=>{
            console.log(msg)
        }).catch((err)=>{
            console.log(err)
        })

        fileHandler.addQvote(qid).then((msg)=>{
            console.log(msg)
        }).catch((err)=>{
            console.log(err)
        })

        const data = {
            title,
            body,
            question_id : qid.qid,
            username : req.body.user_details.username
        }
        utils.addQuestion(data).then((d) => {
            res.status(200).json({"message":"Question posted Succesful","qid":qid.qid})
        }).catch((err)=>{
            console.log(err)
            res.status(500).json({"message":"Failed to Post question"})
        })
    } catch(e) {
        console.log(e)
        res.status(500).send({"message":"Failed to Post !! Serv Fail"})   
    }
})


app.post('/question/:qid/answer',utils.checkUserCreditianls,async (req,res) => {

    let getqid = 0
    let qid = req.params.qid
    let {question_id,answer} = req.body.question

    let qqid = await fileHandler.readqid()
    //console.log("aid : ",qqid.aid)
    await fileHandler.updateaid().then((msg)=>{
        console.log(msg)
    }).catch((err)=>{
        console.log(err)
    })
    
    await fileHandler.addAvote(qqid).then((msg)=>{
        console.log(msg)
    }).catch((err)=>{
        console.log(err)
    })


    let answer_obj= {
        question_id,
        username : req.body.user_details.username,
        answer : answer,
        answer_id: qqid.aid
    }
    utils.getQuestions().then((data)=>{
        //console.log("qid : ",qid)
        let index = data.Questions.some((d) => {
            return d.question_id == qid
        })
        let status=""
        let ansdel=null
        if(index){
            utils.getAnswers().then((ans) => {
                if(ans.Answers.some((a)=> {
                        return a.question_id == qid && a.username == answer_obj.username
                    }))
                { 
                    ansdel = ans.Answers.find((a)=> {
                        return a.question_id == qid && a.username == answer_obj.username
                    })
                    status = "Answer updated"
                } else {
                    status  = "Answer posted"
                }
                //console.log(ansdel)
                return ansdel
            }).then((del)=>{
                if(del != null) {
                    console.log('delete')
                    utils.deleteAnswers(del).then((d)=>{
                        console.log('delete success')
                    }).catch((e)=>{
                        console.log('deletefailute',e)
                    })
                }
            }).catch((e)=>{
                console.log(e)
            })

            setTimeout(function() {
                try{
                    utils.addAnswers(answer_obj).then((msg)=>{
                        console.log(msg)
                        res.status(200).json({"message":status})
                    }).catch((err) => {
                        console.log(err)
                    })
                } catch (e) {
                    console.log(e)
                    res.status(200).json({"message":"Server Fail !!! "})
                }
              }, 200);
            

        } else {
            console.log(index)
            res.status(400).json({"message":"Question Doesn't exist"})
        }
    }).catch((err)=>{
        console.log(err)
        res.status(500).json({"message":"Serv Fail !! ga"})
    })
  
});

app.get('/question/:qid/',utils.authenticateToken,async (req,res)=>{
    const qid = req.params.qid
    try {
        const quesA = await utils.getQuestions()
        const ansA = await utils.getAnswers()
        const que = quesA.Questions.find((q) => q.question_id == qid)
        const ans = ansA.Answers.filter((a) => a.question_id == qid)
        if(que == undefined) {
            res.status(401).json({"message":"Question doesnt exist with this question id"})
        }else if(ans == undefined ) {
            res.status(201).json({"question":que,"message":"No Answers yet"})
        } else {
            res.status(201).json({"question":que,"answers":ans})
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({"message":"Server Error !!!"})
    }
})

app.post('/posts/:qid/comment',utils.authenticateToken,async (req,res)=>{
    try{
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const getusername = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const comment = {
            "question_id": parseInt(req.params.qid)*1,
            "comment": req.body.comment,
            "username":getusername.username
        }
        utils.addComment(comment).then((d) => {
            res.status(200).json({"message":"Comment posted Succesful","question_id":req.params.qid})
        }).catch((err)=>{
            console.log(err)
            res.status(500).json({"message":"Failed to Post comment"})
        })
    } catch (er) {
        res.status(500).json({"message":"Server Fail !! comment"})
    }

})

app.get('/posts/:qid',utils.authenticateToken,async (req,res)=>{
    try{
        const qid = req.params.qid
        const aobj = []
        const quesA = await utils.getQuestions()
        const ansA = await utils.getAnswers()
        const ans = ansA.Answers.filter((a) => a.question_id == qid)
        const aid_arr = ans.map((u)=>u.answer_id)
        const commA = await utils.getComments()
        const qvotes = await fileHandler.readQvotes()
        const avotes = await fileHandler.readAvotes()
        const que = quesA.Questions.find((q) => q.question_id == qid)
        
        const comments = commA.Comments.filter((c) => c.question_id == qid)

        const qvote = qvotes.Question_Votes.find((q)=>q.question_id == qid)

        const avote_arr = avotes.Answer_Votes.filter(element => {
            return aid_arr.includes(element.answer_id)
        });


        let ansobj = []
        if(!que) {
            res.status(400).json({"message":`No questions with this ${qid}`})
        }        
        if(!ans) {
            ansobj = ["No answers yet"]
        } else {
            ans.forEach((element,index) => {
                ansobj.push({
                    "answer":element.answer,
                    "answer_id":element.answer_id,
                    "username":element.username,
                    "votes": avote_arr[index].votes
                })
            });
        }

        res.status(200).json({
            "Question":{
                "Title":que.title,
                "Body":que.body,
                "question_id":que.id,
                "votes":qvote.votes},
            "Answer":ansobj,
            "comments":comments
        })

    } catch (e){
        console.log(e)
        res.status(500).json({"message":"Serv fail !! get post"})
    }
})

app.post('/posts/:qid/upvote/question',utils.authenticateToken,async (req,res)=>{
    try {
        const qid = req.params.qid
        let uprdown = "upvote"
        const st = await utils.updateQvote(qid,uprdown)
        if(st == 0) {
            res.status(200).json({"message":`Upvoted question id ${qid} Succesfully`})
        } else if(st == 1) {
            res.status(400).json({"message":`Question id ${qid} does not exist`})
        } else {
            throw "Server Fail Error"
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({"message":"Server Fail !! Question upvote"})
    }
}) 

app.post('/posts/:qid/downvote/question',utils.authenticateToken,async (req,res)=>{
    try {
        const qid = req.params.qid
        let uprdown = "downvote"
        const st = await utils.updateQvote(qid,uprdown)
        if(st == 0) {
            res.status(200).json({"message":`Downvoted question id ${qid} Succesfully`})
        } else if(st == 1) {
            res.status(200).json({"message":`Question id ${qid} does not exist`})
        } else {
            throw "Server Fail Error"
        }
    } catch (e) {
        res.status(500).json({"message":"Server Fail !! Question downvote"})
    }
})

app.post('/posts/:aid/upvote/answer',utils.authenticateToken,async (req,res)=>{
    try {
        const aid = req.params.aid
        let uprdown = "upvote"
        const st = await utils.updateAvote(aid,uprdown)
        if(st == 0) {
            res.status(200).json({"message":`Upvoted Answer id ${aid} Succesfully`})
        } else if(st == 1) {
            res.status(200).json({"message":`Answer id ${aid} does not exist`})
        } else {
            throw "Server Fail Error"
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({"message":"Server Fail !! Answer upvote"})
    }
})

app.post('/posts/:aid/downvote/answer',utils.authenticateToken,async (req,res)=>{
    try {
        const aid = req.params.aid
        let uprdown = "downvote"
        const st = await utils.updateAvote(aid,uprdown)
        if(st == 0) {
            res.status(200).json({"message":`Downvoted Answer id ${aid} Succesfully`})
        } else if(st == 1) {
            res.status(200).json({"message":`Answer id ${aid} does not exist`})
        } else {
            throw "Server Fail Error"
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({"message":"Server Fail !! Answer downvote"})
    }
})



app.listen(port,()=>{
    console.log("Hello... express server running");
})