'use strict';

const express = require('express');
const morgan = require('morgan');  // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // session middleware

const adminDao = require('./admin-dao'); // module for accessing the users in the DB
const surveyDao = require('./survey-dao');

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy((username, password, done) => {
  // verification callback for authentication
  adminDao.getAdmin(username, password).then(user => {
    if (user)
      return done(null, user);
    else
      return done(null, false, { message: 'Incorrect username  and/or  password' });
  }).catch(err => {
    return done(err);
  });
}));


// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  adminDao.getAdminById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

/** Error Formatter for express-validator **/

/* Each error returned by .array() and .mapped() methods has the following format by default:
  {
    "msg": "The error message",
    "param": "param.name.with.index[0]",
    "value": "param value",
    // Location of the param that generated this error.
    // It's either body, query, params, cookies or headers.
    "location": "body",

    // nestedErrors only exist when using the oneOf function
    "nestedErrors": [{ ... }]
  }
*/

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format express-validate errors as strings
  return `${location}[${param}]: ${msg}`;
};


// init express
const app = new express();
const port = 3001;

const { Answer } = require('../client/src/models/Answer');
const { User } = require('../client/src/models/User');
const { Survey } = require('../client/src/models/Survey');
const { Question } = require('../client/src/models/Question');

app.use(morgan('dev'));
app.use(express.json()); // parse the body in JSON format => populate req.body attributes

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

/*SURVEY API*/

//GET ALL SURVEYS

app.get('/api/survey', async (req, res) => {
  surveyDao.getAllSurveys()
    .then((surveys) => { res.json(surveys); })
    .catch((error) => { res.status(500).json(error); });
})

//GET QUESTION BY SURVEY ID
app.get('/api/survey/:id/question', async (req, res) => {
  let sId = req.params.id;
  surveyDao.getQuestionsBySurveyId(sId)
    .then((questions) => { res.json(questions); })
    .catch((error) => { res.status(500).json(error); });
})

//GET CLOSED ANSWER PER QUESTION ID
app.get('/api/question/:id', async (req, res) => {
  let qId = req.params.id;
  surveyDao.getClosedAnswer(qId)
    .then((answers) => { res.json(answers); })
    .catch((error) => { res.status(500).json(error); });
});


/***  ADMIN APIs  ***/

// GET TO RETRIEVE SURVEYS FILTERED BY ADMINID COUNTING RESPONSES
app.get('/api/admin/survey', isLoggedIn, async (req, res) => {
  surveyDao.getAllSurveysAdmin(req.user.id)
    .then((surveys) => { res.json(surveys); })
    .catch((error) => { res.status(500).json(error); });
})


app.get('/api/survey/:id', isLoggedIn, async (req, res) => {
  let adminId = 1;
  let sId = req.params.id;
  surveyDao.getSurveyById(adminId, sId)
    .then((surveys) => { res.json(surveys); })
    .catch((error) => { res.status(500).json(error); });
})

//GET USER BY ITS ID
app.get('/api/user/:id', isLoggedIn, async (req, res) => {
  let uId = req.params.id;
  surveyDao.getUserNameById(uId)
    .then((name) => { res.json(name); })
    .catch((error) => { res.status(500).json(error); });
})

// GET USER ANSWERS RELATED TO A SURVEY
app.get('/api/user/:id/:sId', isLoggedIn, async (req, res) => {
  let uId = req.params.id;
  let sId = req.params.sId;

  surveyDao.getUserAnswersPerSurvey(uId, sId)
    .then((answers) => { res.json(answers); })
    .catch((error) => { res.status(500).json(error); });
})

//POST NEW QUESTION WHILE CREATING NEW SURVEY
app.post('/api/question', isLoggedIn,
  [
    check('title').isLength({ min: 1 }),
    check('type').isLength({ min: 1 }),
    check('min').isInt({ min: 0 }),
    check('max').isInt({ min: 1 }),
    check('sId').isInt()
  ],
  async (req, res) => {

    /* Express-validator validation*/
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    let title = req.body.title;
    let type = req.body.type;
    let min = req.body.min;
    let max = req.body.max;

    let sId = req.body.sId;

    try {
      let lastId = await surveyDao.createQuestion({ title: title, sId: sId, type: type, min: min, max: max });
      res.json("New question's id: " + lastId);
    } catch (error) {
      res.status(500).json(error);
    }
  });

//POST NEW CLOSED ANSWER WHILE CREATING NEW SURVEY
app.post('/api/question/:id', isLoggedIn,
  [
    check('id').isInt(),
    check('text').isLength({ min: 1 }),
  ],
  async (req, res) => {

    /* Express-validator validation*/
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    let text = req.body.text;
    let qId = req.params.id;
    let type = req.params.type;

    try {
      let lastId = await surveyDao.createClosedAnswer({ text: text, qId: qId });
      res.json("New closed answer's id: " + lastId);
    } catch (error) {
      res.status(500).json(error);
    }

  });

// POST TO SUBMIT ENTIRE SURVEY
app.post('/api/survey', isLoggedIn,
  [
    check('title').isLength({ min: 1 }),
    check('questions.*.title').isLength({ min: 1 }),
    check('questions.*.type').isLength({ min: 1 }),
    check('questions.*.min').isInt({ min: 0 }),
    check('questions.*.max').isInt({ min: 1 }),
  ],
  async (req, res) => {

    /* Express-validator validation*/
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    let questions = req.body.questions;
    let title = req.body.title;

    try {

      //CONTROLS OVER VALUES BEFOR STARTING TO POST
      questions.forEach(q => {
        if (q.type === "CLOSED") {
          if (q.answers) {
            if (!(q.min <= q.max && q.max <= q.answers.length)) {
              throw 'Min and Max constraints transgressed!';
            } else {
              q.answers.forEach(a => {
                if (!a.text)
                  throw 'Answer text Not Valid!';
              });
            }
          }
          else {
            throw 'Missing answers for closed question!';
          }
        }
        else if (q.type === "OPEN") {
          if (!(q.min <= q.max))
            throw 'Min and Max constraints transgressed!';
        }
        else
          throw 'Invalid Question Type!'
      })


      //CREATE SURVEY
      let sId = await surveyDao.createSurvey(req.user.id, title);
      //CYCLE OVER EVERY QUESTION LINKING IT TO THE SURVEY WITH sID
      questions.forEach(async q => {
        let qId = await surveyDao.createQuestion(new Question(undefined, q.title, sId, q.type, q.min, q.max));
        if (q.type === "CLOSED")
        //CYCLE OVER EVERY CLOSED ANSWER TO STORE THE ANSWERS OF THE QUESTION (qID) TO THE SURVEY (sID)
          q.answers.forEach(async a => await surveyDao.createClosedAnswer(new Answer(undefined, a.text, qId)));
      }
      );
      return res.json(sId);
    } catch (error) {
      res.status(500).json(error);
    }
  });


/*** USER API ***/


//POST TO ADD THE USER ON THE DB (id,name)
app.post('/api/user', check(['name']).isLength({ min: 1 }),
  async (req, res) => {

    /* Express-validator validation*/
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    let name = req.body.name;

    try {
      let lastId = await surveyDao.addUser(name);
      return res.json(lastId);
    } catch (e) {
      res.status(500).json(e);
    }


  });


//GET ALL USER PER SURVEY
app.get('/api/users/survey/:sId', isLoggedIn, async (req, res) => {
  let sId = req.params.sId;
  surveyDao.getAllUsersPerSurvey(sId)
    .then((users) => { res.json(users); })
    .catch((error) => { res.status(500).json(error); });
})


//OPEN ANSWER BY USER (CREATES THE RELATION UserId AnswerId and the RELATED ANSWER )
app.post('/api/user/question/:id',
  [
    check('uId').isInt(),
    check('id').isInt(),
    check('text').isLength({ min: 1, max: 200 })
  ],
  async (req, res) => {

    /* Express-validator validation*/
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    let text = req.body.text;
    let uId = req.body.uId;
    let qId = req.params.id;
    try {
      let lastId = await surveyDao.replyToQuestion(qId, text);
      await surveyDao.AddtoRelation(uId, lastId)
      res.json("Added new Relation between answer:" + lastId + " and UserId:" + uId);
    } catch (error) {
      res.status(500).json(error);
    }

  });

//POST TO ADD NEW ANSWER (UID AID RELATION)
app.post('/api/answer',
  [
    check('uId').isInt(),
    check('aId').isInt()
  ],

  async (req, res) => {

    /* Express-validator validation*/
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    let uId = req.body.uId;
    let aId = req.body.aId;

    try {
      let lastId = await surveyDao.AddtoRelation(uId, aId);
      return res.json(lastId);
    } catch (error) {
      res.status(500).json(error);
    }
  });


/***Admin sessions APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      return res.json(req.user);
    });
  })(req, res, next);
});


// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});