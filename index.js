const express = require('express');
const app = express()
const port = 8080
const bodyParser = require('body-parser');
const utils = require('./utils');
const fileHandler = require('./fileHandler')
const bcrypt = require('bcrypt');
const { updateqid } = require('./fileHandler');

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
    res.status(200).json({"message":"Succesfully logged in "})
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
            res.status(200).json({"message":"Question posted Succesful"})
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
            console.log("qid : ",qid,d.question_id)
            return d.question_id == qid
        })
        let status
        if(index){
            utils.getAnswers().then((ans) => {
                if(ans.Answers.some((a)=>a.question_id == qid)){
                    status = "Answer updated"
                } else {
                    status  = "Answer posted"
                }
            }).catch((err) => {
                console.log(err)
            })
            utils.addAnswers(answer_obj).then((msg)=>{
                res.status(200).json({"message":status})
            }).catch((err) => {
                console.log(err)
            })
        } else {
            console.log(index)
            res.status(400).json({"message":"Question Doesn't exist"})
        }
    }).catch((err)=>{
        console.log(err)
        res.status(500).json({"message":"Serv Fail !! ga"})
    })

   
});


//app.get('/question/:qid',utils.checkUserCreditianls,async (req,res) => {

// app.post('/question/:qid/answer',(req,res) => {
//     const check = utils.checkUserCreditianls(req.body.user_details)
//     const question_id = req.params.qid
//     if(check[0] == true){
//         if(utils.checkQuestionExist(question_id)!=-1){
//             const answered = utils.checkAnswerExist(question_id,req.body.user_details.username)
//             if(answered != -1) {
//                 utils.answer[answered].body = req.body.question.answer;
//                 res.status(200).json({"message":"Answer updated successfully","question_id":question_id});
//             }  else {
//                 const body = {
//                     "answer":req.body.question.answer,
//                     "question_id":question_id,
//                     "username":req.body.user_details.username
//                 }
//                 utils.answer.push(body)
//                 res.status(200).json({"message":"Answer posted successfully","question_id":question_id});
//             }
//         } else {
//             res.status(400).json({"message":"Question Doesn't exist","question_id":question_id})
//         }
//     } else {
//         res.status(400).json({
//             "message":check[1],
//             "question_id":question_id
//         })
//     }
// })

     // if(check[0]==true){
    //     const index = utils.checkQuestionExist(req.params.qid)
    //     if(index != -1) {
    //         const ans = utils.answer.filter((a)=>a.question_id == req.params.qid)
    //         const que = utils.question[index]
    //         res.status(200).json({que,ans})
    //     } else {
    //         res.status(400).json({"message":"Question doesn't exist"})
    //     }
    // } else {
    //     res.status(400).json({"message":check[1]});
    // } 

app.listen(port,()=>{
    console.log("Hello... express server running");
})