const fs = require('fs-extra')

function promiseHandle(promise) {
    return promise
            .then(data => [null, data])
            .catch(err => [err]);
}

async function ReadUsers () {
    const [err,data]= await promiseHandle(fs.readJson('./DB/Users.json'))
    if(err || !data) {
        if (err) return Promise.reject(`Error reading file, file not exist`);
        return Promise.reject(`Error!! No data..`);
    }
    return Promise.resolve(data);
}

async function WriteUser (data) {
    let UsersDB = await ReadUsers()
    UsersDB.Users.push(data)
    try {
        JSON.stringify(UsersDB, null, ' ');
        await fs.writeJson('./DB/Users.json',UsersDB)
        return Promise.resolve("Succes Writing to file");
    } catch{
        return Promise.reject(`Error reading file, file not exist`);
    } 
}



async function ReadQuestions () {
    const [err,data]= await promiseHandle(fs.readJson('./DB/Questions.json'))
    if(err || !data) {
        if (err) return Promise.reject(`Error reading file, file not exist`);
        return Promise.reject(`Error!! No data..`);
    }
    return Promise.resolve(data);
}

async function WriteQuestions (data) {
    let UsersDB = await ReadQuestions()
    //console.log(UsersDB)
    UsersDB.Questions.push(data)
    try {
        JSON.stringify(UsersDB, null, ' ');
        await fs.writeJson('./DB/Questions.json',UsersDB)
        return Promise.resolve("Succes Writing to file");
    } catch{
        return Promise.reject(`Error reading file, file not exist`);
    } 
}


async function ReadAnswers () {
    const [err,data]= await promiseHandle(fs.readJson('./DB/Answers.json'))
    if(err || !data) {
        if (err) return Promise.reject(`Error reading file, file not exist read`);
        return Promise.reject(`Error!! No data..`);
    }
    return Promise.resolve(data);
}

async function WriteAnswers (data) {
    let UsersDB = await ReadAnswers()
    UsersDB.Answers.push(data)
    try {
        JSON.stringify(UsersDB, null, ' ');
        await fs.writeJson('./DB/Answers.json',UsersDB)
        return Promise.resolve("Succes Writing to file");
    } catch{
        return Promise.reject(`Error reading file, file not exist write`);
    } 
}

async function DeleteAnswers (data) {

    let UsersDB = await ReadAnswers()
    //console.log(UsersDB,"kfhskdfnkl")
    UsersDB.Answers = UsersDB.Answers.filter((u)=>{
        //console.log(u.question_id,data.question_id,u.username,data.username,"kjhfk")
        return !(u.question_id == data.question_id && u.username == data.username)
    })
    //console.log(UsersDB,"afteel")
    try {
        JSON.stringify(UsersDB, null, ' ');
        await fs.writeJson('./DB/Answers.json',UsersDB)
        return Promise.resolve("Succes Writing to file");
    } catch(e){
        return Promise.reject(`Error reading file, file not exist delete ${e}`);
    } 
}


async function readqid() {
    const [err,data]= await promiseHandle(fs.readJson('./DB/properties.json'))
    if(err || !data) {
        if (err) return Promise.reject(`Error reading file, file not exist qid`);
        return Promise.reject(`Error!! No data..`);
    }
    return Promise.resolve(data);
}

async function updateqid() {
    let obj = await readqid()
    obj.qid = (obj.qid*1)+1
    try {
        JSON.stringify(obj, null, ' ');
        await fs.writeJson('./DB/properties.json',obj)
        return Promise.resolve("Succes Writing to file");
    } catch{
        return Promise.reject(`Error reading file, file not exist`);
    } 
}


async function updateaid() {
    let obj = await readqid()
    obj.aid = (obj.aid*1)+1
    try {
        JSON.stringify(obj, null, ' ');
        await fs.writeJson('./DB/properties.json',obj)
        return Promise.resolve("Succes Writing to file");
    } catch{
        return Promise.reject(`Error reading file, file not exist`);
    } 
}

async function readQvotes() {
    const [err,data]= await promiseHandle(fs.readJson('./DB/Qupvote.json'))
    if(err || !data) {
        if (err) return Promise.reject(`Error reading file, file not exist qid`);
        return Promise.reject(`Error!! No data..`);
    }
    return Promise.resolve(data);
}

async function readAvotes() {
    const [err,data]= await promiseHandle(fs.readJson('./DB/Aupvote.json'))
    if(err || !data) {
        if (err) return Promise.reject(`Error reading file, file not exist qid`);
        return Promise.reject(`Error!! No data..`);
    }
    return Promise.resolve(data);
}


async function addQvote(qid) {
    let UsersDB = await readQvotes()
    let data = {
        "question_id":qid.qid,
        "votes":0
    }
    UsersDB.Question_Votes.push(data)
    try {
        JSON.stringify(UsersDB, null, ' ');
        await fs.writeJson('./DB/Qupvote.json',UsersDB)
        return Promise.resolve("Succes Writing to file");
    } catch{
        return Promise.reject(`Error reading file, file not exist write`);
    } 
}

async function addAvote(qid) {
    let UsersDB = await readAvotes()
    let data = {
        "answer_id":qid.aid,
        "votes":0
    }
    UsersDB.Answer_Votes.push(data)
    try {
        JSON.stringify(UsersDB, null, ' ');
        await fs.writeJson('./DB/Aupvote.json',UsersDB)
        return Promise.resolve("Succes Writing to file");
    } catch{
        return Promise.reject(`Error reading file, file not exist write`);
    } 
}

async function ReadComments() {
    const [err,data]= await promiseHandle(fs.readJson('./DB/Comments.json'))
    if(err || !data) {
        if (err) return Promise.reject(`Error reading file, file not exist qid`);
        return Promise.reject(`Error!! No data..`);
    }
    return Promise.resolve(data);
}

async function WriteComments(comment) {

    let UsersDB = await ReadComments()
    //console.log(UsersDB)
    UsersDB.Comments.push(comment)
    try {
        JSON.stringify(UsersDB, null, ' ');
        await fs.writeJson('./DB/Comments.json',UsersDB)
        return Promise.resolve("Succes Writing to file");
    } catch{
        return Promise.reject(`Error reading file, file not exist`);
    } 

}

module.exports = {
    ReadUsers,WriteUser,ReadQuestions,WriteQuestions,ReadAnswers,
    WriteAnswers,DeleteAnswers,readqid,updateqid,updateaid,
    addQvote,addAvote,readQvotes,
    readAvotes,ReadComments,WriteComments,
}