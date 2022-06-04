import { Answer } from "./models/Answer";
import { Question } from "./models/Question";
import { Survey } from "./models/Survey";
import { User } from "./models/User";

const url = 'http://localhost:3000';

/*** ADMIN APIs ***/

//Creation of a Survey (POST)
async function AddSurvey(survey) {
    fetch(url + '/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(survey),
    }).catch(() => { return ({ error: "Cannot communicate with the server." }) }); // connection errors
}

//Loads all Surveys filtered by AdminId (GET)
async function loadSurveysPerAdmin() {
    let surveys = [];
    const response = await fetch(url + '/api/admin/survey');
    let surveysJson = await response.json();
    if (response.ok) {
        surveysJson.forEach(s => {
            surveys = [...surveys, new Survey(s.id, s.title, s.aId, s.responses)];
        });
        return surveys;
    } else
        throw surveysJson;
}

//Loads all users' answers for a given survey (GET)
async function UserAnswerInSurvey(uId,sId){
    let UserAnswers = [];
    const response = await fetch(url + '/api/user/' + uId + '/' +sId);
    let answersJson = await response.json();
    if (response.ok) {
        answersJson.forEach(a => {
            UserAnswers = [...UserAnswers, new Answer(a.id, a.text, a.qId)];
        });
        return UserAnswers;
    } else
        throw answersJson;
}

//Loads all users for a given survey (GET)
async function getAllUsersPerSurvey(sId){
    let users = [];
    const response = await fetch(url + '/api/users/survey/' +sId);
    let usersJson = await response.json();
    if (response.ok) {
        usersJson.forEach(u => {
            users = [...users, new User(u.id, u.name)];
        });
        return users;
    } else
        throw usersJson;
}


/*** USER APIs ***/

//Load all available surveys (GET)
async function loadSurveys() {
    let surveys = [];
    const response = await fetch(url + '/api/survey');
    let surveysJson = await response.json();
    if (response.ok) {
        surveysJson.forEach(s => {
            surveys = [...surveys, new Survey(s.id, s.title, s.aId, s.responses)];
        });
        return surveys;
    } else
        throw surveysJson;
}

//Load all question related to a given survey (GET)
async function loadQuestionBySurveyId(sId) {
    let questions = [];
    const response = await fetch(url + '/api/survey/' + sId + '/question');
    let questionsJson = await response.json();
    if (response.ok) {
        questionsJson.forEach(q => {
            questions = [...questions, new Question(q.id, q.title, sId, q.type, q.min, q.max)];
        });
        return questions;
    } else
        throw questionsJson;
}

//Load the closed answers of a survey related to a question (GET)
async function loadClosedAnswerByQuestionId(qId) {
    let closedAnswers = [];
    const response = await fetch(url + '/api/question/' + qId);
    let closedAnswersJson = await response.json();
    if (response.ok) {
        closedAnswersJson.forEach(a => {
            closedAnswers = [...closedAnswers, new Answer(a.id, a.text, qId)];
        });
        return closedAnswers;
    } else
        throw closedAnswersJson;
}

//Send The answer of an open question (POST)
async function ReplytoOpenAnswer(qId, uIdText) {
    fetch(url + '/api/user/question/' + qId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uIdText),
    }).catch(() => { return ({ error: "Cannot communicate with the server." }) }); // connection errors
}

//Send the user to store it
async function addUser(user) {
    const response = await fetch(url + '/api/user/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    })
    if (response.ok) {
        const userId = await response.json();
        return userId;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }

}

//Send relation between user and answer while filling a survey
async function addUserAnswer(userAnswer) {
    fetch(url + '/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userAnswer),
    })
        .catch(() => { return ({ error: "Cannot communicate with the server." }) }); // connection errors
}



/*ADMIN APIs for Sessions*/

async function logIn(credentials) {
    let response = await fetch(url + '/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const admin = await response.json();
        return admin.username;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch(url + '/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch(url + '/api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

const API = { getUserInfo,loadSurveys, loadQuestionBySurveyId, loadClosedAnswerByQuestionId, logIn, logOut, ReplytoOpenAnswer, loadSurveysPerAdmin, addUser, addUserAnswer,UserAnswerInSurvey,getAllUsersPerSurvey,AddSurvey };
export default API;