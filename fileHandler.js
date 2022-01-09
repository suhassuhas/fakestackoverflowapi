const fs = require('fs-extra')

function promiseHandle(promise) {
    return promise
            .then(data => [null, data])
            .catch(err => [err]);
}

async function ReadUsers () {
    const [err,data]= await promiseHandle(fs.readJson('./Users.json'))
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
        await fs.writeJson('./Users.json',UsersDB)
        return Promise.resolve("Succes Writing to file");
    } catch{
        return Promise.reject(`Error reading file, file not exist`);
    } 
}



async function ReadQuestions () {
    const [err,data]= await promiseHandle(fs.readJson('./Questions.json'))
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
        await fs.writeJson('./Questions.json',UsersDB)
        return Promise.resolve("Succes Writing to file");
    } catch{
        return Promise.reject(`Error reading file, file not exist`);
    } 
}


async function ReadAnswers () {
    const [err,data]= await promiseHandle(fs.readJson('./Answers.json'))
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
        await fs.writeJson('./Answers.json',UsersDB)
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
        await fs.writeJson('./Answers.json',UsersDB)
        return Promise.resolve("Succes Writing to file");
    } catch(e){
        return Promise.reject(`Error reading file, file not exist delete ${e}`);
    } 
}


async function readqid() {
    const [err,data]= await promiseHandle(fs.readJson('./properties.json'))
    if(err || !data) {
        if (err) return Promise.reject(`Error reading file, file not exist`);
        return Promise.reject(`Error!! No data..`);
    }
    return Promise.resolve(data);
}

async function updateqid() {
    let obj = await readqid()
    obj.qid = (obj.qid*1)+1
    try {
        JSON.stringify(obj, null, ' ');
        await fs.writeJson('./properties.json',obj)
        return Promise.resolve("Succes Writing to file");
    } catch{
        return Promise.reject(`Error reading file, file not exist`);
    } 
}



module.exports = {
    ReadUsers,WriteUser,ReadQuestions,WriteQuestions,ReadAnswers,WriteAnswers,DeleteAnswers,readqid,updateqid
}