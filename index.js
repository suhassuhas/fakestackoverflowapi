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
    let answer_obj= {
        question_id,
        username : req.body.user_details.username,
        answer : answer
    }
    utils.getQuestions().then((data)=>{
        console.log("qid : ",qid)
        let index = data.Questions.some((d) => {
            //console.log("qid : ",qid,d.question_id)
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
                    //console.log(ansdel)
                    status = "Answer updated"
                } else {
                    status  = "Answer posted"
                }
                console.log(ansdel)
                return ansdel
            }).then((del)=>{
                //console.log(del)
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
                utils.addAnswers(answer_obj).then((msg)=>{
                    res.status(200).json({"message":status})
                }).catch((err) => {
                    console.log(err)
                })
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

app.listen(port,()=>{
    console.log("Hello... express server running");
})