const express = require('express');
const app = express()
const port = 8080
const bodyParser = require('body-parser');
const utils = require('./utils');

app.use(bodyParser.json());

app.get('/users',async (req,res) => {
   utils.getUsers().then((data)=>{
        res.status(200).json(data)
   }).catch((err)=>{
        res.status(400).json(err)
   })
});

// app.post('/register',(req,res) => {
//     const check = utils.checkUserInfo(req)
//     if(check[0] == true) {
//         utils.Users.push(req.body)
//         res.status(200).json(
//             {"message": check[1], 
//             "registration_name":`${req.body.registration_name}`}
//         );
//     } else {
//         res.status(200).json(
//             {
//                 "message": check[1]
//             }
//         );
//     }
// });

// app.post('/login',(req,res) => {
//     const check = utils.checkUserCreditianls(req)
//     if(check[0] == true){
//         res.status(201).json({
//             "message":check[1]
//         })
//     } else {
//         res.status(401).json({
//             "message":check[1]
//         })
//     }
// })

// app.post('/question',(req,res) => {
//     const check_cred = utils.checkUserCreditianls(req.body.user_details)
//     if(check_cred[0] == true){
//         if(req.body.question.question_id == undefined) {
//             qap = {...req.body.question,"question_id":++utils.qid}
//             utils.question.push(qap);
//             res.status(201).json(qap);
//         }
//     } else {
//         res.status(401).json({
//             "message":check_cred[1]
//         })
//     }
// })


// app.post('/question/:qid',(req,res) => {
//     const check = utils.checkUserCreditianls(req.body.user_details)

//     if(check[0]==true){
//         const index = utils.checkQuestionExist(req.params.qid)
//         if(index != -1) {
//             const ans = utils.answer.filter((a)=>a.question_id == req.params.qid)
//             const que = utils.question[index]
//             res.status(200).json({que,ans})
//         } else {
//             res.status(400).json({"message":"Question doesn't exist"})
//         }
//     } else {
//         res.status(400).json({"message":check[1]});
//     }    
// });


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

app.listen(port,()=>{
    console.log("Hello... express server running");
})