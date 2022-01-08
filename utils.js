//let qid = 101
// let Users = [
//     {
//         "registration_name":"Suhas",
//         "username":"suhas7theb2000@gmail.com",
//         "password":"suhasravi07"
//     }
// ]

// let question = [
//     {
//         "question_id":101,
//         "title":"how to write nodejs program", 
//         "body":"I'm trying to build rest api with node and express js, I get error as express is missing"
//     }
// ]

// let answer = [
//     {
//         "question_id":101,
//         "username":"suhas7thfeb2000@gmail.com",
//         "body":`you need to check if the express is installed, check package.json file 
//             under dependencies, if express exists, if not execute : npm install express, and make sure your cmd 
//             line is where package.json`
//     }
// ]
const fileHandler = require('./fileHandler')
const validator = require('validator')
const bcrypt = require('bcrypt');


const strStr = function (haystack, needle) {
    if (needle.length === 0) return 0;
  
    if (needle === haystack) return 0;
  
    for (let i = 0; i <= haystack.length - needle.length; i++) {
      if (needle === haystack.substring(i, i + needle.length)) {
        return i;
      }
    }
  
    return -1;
}

//util functions
async function getUsers(){
    return await fileHandler.ReadUsers()
}

async function getQuestions() {
    return await fileHandler.ReadQuestions()
}

async function getAnswers() {
    return await fileHandler.ReadAnswers()
}

async function addAnswers(data) {
    return await fileHandler.WriteAnswers(data)
}

async function addUser(data) {
    return await fileHandler.WriteUser(data)
}

async function addQuestion(data) {
    return await fileHandler.WriteQuestions(data)
}

async function checkUserInfo(req,res,next){
    if(req.body.registration_name == undefined) {
        return res.status(400).json({"message":"Need to have registration name"});
    } else if (req.body.username == undefined || !validator.isEmail(req.body.username)) {
        return res.status(400).json({"message":"Need to have proper email"});
    } else if (req.body.password == undefined) {
        return res.status(400).json({"message":"please provide password"});
    } 
    await getUsers().then((data)=>{
        if(data.Users.some((d)=>d.username == req.body.username)){
            return res.status(400).json({"message":"User Already exist please login"});
        } else {
            next()
        }
    })    
}

async function checkUserCreditianls(req,res,next) {
    let userobj;
    let pwd = ""
    let usr = ""
    let path = req.route.path
    if(strStr(path,"login") != -1){
        pwd = req.body.password
        usr = req.body.username
    } else if(strStr(path,"question") != -1) {
        console.log(req.body)
        pwd = req.body.user_details.password
        usr = req.body.user_details.username
    }

    await getUsers().then((data)=>{
        const user = data.Users.find((d)=>d.username == usr)
        userobj = user
        if(user == null){
            return res.status(400).json({"message":"User not found"})
        }
        //console.log(user)
    })

    try {
        if(userobj) {
            if(await bcrypt.compare(pwd,userobj.hashedpwd)) {
                //res.status(200).json({"message":"Succesfully logged in "})
                next()
            } else {
                return res.status(400).json({"message":"Invalid Credintials"})
            }
        }
    } catch(e) {
        console.log(e)
        return res.status(500).json({"message":"Serv fail !!!!"})
    }
}



// function checkUserCreditianls(req) {
//     const username = req.username;
//     const password = req.password;
//     const user_in_db = Users.find((usr)=>usr.username == username)
//     if(user_in_db == undefined) {
//         //res.status(400).json({"message":"Username not found please register"})
//         return [false,"Username not found please register"]
//     } else if (user_in_db.password != password) {
//         //res.status(400).json({"message":"Sorry invalid credentials"})
//         return [false,"Sorry invalid credentials"]
//     }
//     return [true,"user logged in succesfully"]
// }

// function checkQuestionExist(question_id) {
//     index = question.findIndex((q)=>{
//         console.log(q.question_id,qid)
//         return q.question_id == question_id
//     })
//     console.log(index)
//     return index
// }

// function checkAnswerExist(question_id,user_name) {
//     index = answer.findIndex((a)=> {
//         return question_id == a.question_id && user_name == a.username
//     })
//     return index
// }


module.exports ={
    // checkUserInfo,checkUserCreditianls,checkQuestionExist,checkAnswerExist,getUsers
    getUsers,checkUserInfo,addUser,checkUserCreditianls,addQuestion,getQuestions,getAnswers,addAnswers
}