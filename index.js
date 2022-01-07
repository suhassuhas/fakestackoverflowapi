const express = require('express');
const app = express()
const port = 8080
const bodyParser = require('body-parser');
app.use(bodyParser.json());

let qid = 101
let Users = [
    {
        "registration_name":"Suhas",
        "username":"suhas7theb2000@gmail.com",
        "password":"suhasravi07"
    }
]

let question = [
    {
        question_id:qid,
        title:"how to write nodejs program", 
        body:"I'm trying to build rest api with node and express js, I get error as express is missing"
    }
]

let answer = [
    {
        question_id:qid,
        username:"suhas7thfeb2000@gmail.com",
        body:`you need to check if the express is installed, check package.json file 
            under dependencies, if express exists, if not execute : npm install express, and make sure your cmd 
            line is where package.json`
    }
]

//util functions
function checkUserExist(body) {
    const usrname = Users.some((user)=>user.username == body.username);
    return usrname
}

function checkUserInfo(req){
    if(req.body.registration_name == undefined) {
        //res.status(400).json({"message":"Need to have registration name"});
        return [false,"Need to have registration name"]
    } else if (req.body.username == undefined || req.body.username.search("@") == -1) {
        //res.status(400).json({"message":"Need to have proper email"});
        return [false,"Need to have proper email"]
    } else if (req.body.password == undefined) {
        //res.status(400).json({"message":"please provide password"});
        return [false,"please provide password"]
    } else if(checkUserExist(req.body)==true) {
        //res.status(400).json({"message":"Username already exist,please login"})
        return [false,"Username already exist,please login"]
    }
    return [true,"User Registered Successfully"]
}

function checkUserCreditianls(req) {
    const username = req.username;
    const password = req.password;
    const user_in_db = Users.find((usr)=>usr.username == username)
    if(user_in_db == undefined) {
        //res.status(400).json({"message":"Username not found please register"})
        return [false,"Username not found please register"]
    } else if (user_in_db.password != password) {
        //res.status(400).json({"message":"Sorry invalid credentials"})
        return [false,"Sorry invalid credentials"]
    }
    return [true,"user logged in succesfully"]
}

function checkQuestionExist(question_id) {
    index = question.findIndex((q)=>{
        console.log(q.question_id,qid)
        return q.question_id == question_id
    })
    console.log(index)
    return index
}

function checkAnswerExist(question_id,user_name) {
    index = answer.findIndex((a)=> {
        return question_id == a.question_id && user_name == a.username
    })
    return index
}

app.get('/users',(req,res) => {
    res.status(200).json(Users);
});

app.post('/register',(req,res) => {
    const check = checkUserInfo(req)
    if(check[0] == true) {
        Users.push(req.body)
        res.status(200).json(
            {"message": check[1], 
            "registration_name":`${req.body.registration_name}`}
        );
    } else {
        res.status(200).json(
            {
                "message": check[1]
            }
        );
    }
});

app.post('/login',(req,res) => {
    const check = checkUserCreditianls(req)
    if(check[0] == true){
        res.status(200).json({
            "message":check[1]
        })
    } else {
        res.status(400).json({
            "message":check[1]
        })
    }
})

app.post('/question',(req,res) => {
    const check_cred = checkUserCreditianls(req.body.user_details)
    if(check_cred[0] == true){
        if(req.body.question.question_id == undefined) {
            qap = {...req.body.question,"question_id":++qid}
            question.push(qap);
            res.status(200).json(qap);
        }
    } else {
        res.status(400).json({
            "message":check_cred[1]
        })
    }
})


app.post('/question/:qid',(req,res) => {
    const check = checkUserCreditianls(req.body.user_details)

    if(check[0]==true){
        const index = checkQuestionExist(req.params.qid)
        if(index != -1) {
            const ans = answer.filter((a)=>a.question_id == req.params.qid)
            const que = question[index]
            res.status(200).json({que,ans})
        } else {
            res.status(400).json({"message":"Question doesn't exist"})
        }
    } else {
        res.status(400).json({"message":check[1]});
    }    
});



app.post('/question/:qid/answer',(req,res) => {
    const check = checkUserCreditianls(req.body.user_details)
    const question_id = req.params.qid
    if(check[0] == true){
        if(checkQuestionExist(question_id)!=-1){
            const answered = checkAnswerExist(question_id,req.body.user_details.username)
            if(answered != -1) {
                answer[answered].body = req.body.question.answer;
                res.status(200).json({"message":"Answer updated successfully","question_id":question_id});
            }  else {
                const body = {
                    "answer":req.body.question.answer,
                    "question_id":question_id,
                    "username":req.body.user_details.username
                }
                answer.push(body)
                res.status(200).json({"message":"Answer posted successfully","question_id":question_id});
            }
        } else {
            res.status(400).json({"message":"Question Doesn't exist","question_id":question_id})
        }
    } else {
        res.status(400).json({
            "message":check[1],
            "question_id":question_id
        })
    }
})


app.listen(port,()=>{
    console.log("Hello... express server running");
})