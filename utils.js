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


module.exports ={
    checkUserInfo,checkUserCreditianls,checkQuestionExist,checkAnswerExist,Users,qid,question,answer
}