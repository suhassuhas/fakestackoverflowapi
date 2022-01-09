## Problem Statement

The application serves as a platform for users to ask and answer questions, and, through membership and active participation, to vote questions and answers up or down similar to Reddit/Stack overflow and edit questions and answers. Users of application can earn reputation points and "badges" for example, a person is awarded 10 reputation points for receiving an "up" vote on a question or an answer to a question, and can receive badges for their valued contributions, which represents a gamification of the traditional Q&A website. Users unlock new privileges with an increase in reputation like the ability to vote, comment, and even edit other people's posts

### Features Added In this API

- [x] Login with bcrypt hashing.
- [x] Access some resources using JWT token 
- [x] Allows to register.
- [x] Allows User to ask a question.
- [x] Allows User answer the question given the question id.
- [X] Get all the questions using JWT Token 
- [x] Get answers for the particular question given the question id using JWT Auth
- [x] Ability to upVote and downVote an particular question.
- [x] Ability to upVote and downVote an particular question.
- [x] Ability to Comment for particular question
- [x] Ability to See post for a particular question with relevant answers and comments
- [ ] User badges -> Not implemented


# Api endpoints and input format 


## Register - Post request

### Example
post http://localhost:8080/register \
Content-type: application/json 

{ \
    "registration_name": "mithun",\
    "username": "mithun11@gmail.com",\
    "password": "somepwd"\
}

## Login - Post request

### Example
post http://localhost:8080/login \
Content-type: application/json 

{\
    "username": "mithun11@gmail.com",\
    "password": "hippo"\
}



## Post Question 

### Example
post http://localhost:8080/question \
Content-type: application/json 

{ \
    "user_details": {\
            "username": "suhas90@gmail.com",\
            "password": "suhasravifd07"\
      }, \
    "question": {\
        "title":"javascript modules", \
        "body":"What are modules in javascript"\
    }\
}

## Post Answer

### Example
post http://localhost:8080/question/:qid/answer\
Content-type: application/json

{\
    "user_details": {\
            "username": "suhas90@gmail.com",\
            "password": "suhasravifd07"\
      }, \
    "question": {\
        "question_id":102, \
        "answer":"You can use the following command => 'python -m pdb python-script.py'"\
    }\
}

## Get Answer for a question id

### Example
get http://localhost:8080/question/:qid \
Authorization: Bearer "Token"

## Get All Questions

### Example
get http://localhost:8080/question/all \
Authorization: Bearer "Token"


## Upvote a question 

### Example 
post http://localhost:8080/posts/:qid/upvote/question \
Authorization: Bearer "Token"


## Downvote a question 

### Example 
post http://localhost:8080/posts/:qid/downvote/question \
Authorization: Bearer "Token"


## Upvote a Answer 

### Example 
post http://localhost:8080/posts/:qid/upvote/answer \
Authorization: Bearer "Token"


## Downvote a Answer 

### Example 
post http://localhost:8080/posts/:qid/downvote/answer \
Authorization: Bearer "Token"


## See a post with question,answers and comments

### Example
post http://localhost:8080/posts/:qid \
Authorization: Bearer "Token"


## Add a comment for a paricular question given question id

### Example
post http://localhost:8080/posts/:qid/comment \
Authorization: Bearer "Token"