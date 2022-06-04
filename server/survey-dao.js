'use strict'

const sqlite = require("sqlite3");

function User(id, name) {
    this.id = id;
    this.name = name;
}

function Survey(id, title, aId, responses = 0) {
    this.id = id;
    this.title = title;
    this.aId = aId;
    this.responses = responses;
}
function Question(id, title, sId, type, min, max) {
    this.id = id;
    this.title = title;
    this.sId = sId;
    this.type = type;
    this.min = min;
    this.max = max;
}

function Answer(id, text, qId) {
    this.id = id;
    this.text = text;
    this.qId = qId;
}


const db = new sqlite.Database('survey.db', (err) => { if (err) throw err; })

/*SURVEY*/
exports.getAllSurveys = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * 
                    FROM survey
                    `;
        db.all(sql, (err, rows) => {
            if (err)
                reject(err);
            else {
                const surveys = rows.map(record => new Survey(record.id, record.title, record.aId, record.responses));
                resolve(surveys);

            }
        });
    });
}
/*SURVEY FOR ADMIN*/
exports.getAllSurveysAdmin = (adminId) => {
    return new Promise(async (resolve, reject) => {
        let filteredSurveys = [];
        try {
            filteredSurveys = await getSurveyByAdminId(adminId);
        } catch (error) {
            reject(error);
            return;
        }
        const sql = `SELECT S.id, S.title, COUNT(DISTINCT UA.uId) AS responses 
                    FROM userAnswer AS UA, answer AS A, question AS Q, survey AS S 
                    WHERE UA.aId = A.id AND A.qId = Q.id AND Q.sId = S.id AND S.aId= ? 
                    GROUP BY S.id `;
        db.all(sql, [adminId], (err, rows) => {
            if (err)
                reject(err);
            else {
                const surveys = rows.map(record => new Survey(record.id, record.title, adminId, record.responses));
                filteredSurveys.forEach(s => {
                    surveys.forEach(fs => {
                        if (fs.id === s.id)
                            s.responses = fs.responses;
                    }
                    )
                })
                resolve(filteredSurveys);

            }
        });
    });
};

exports.getSurveyById = (adminId, sId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM survey WHERE aId = ? AND id = ?';
        db.get(sql, [adminId, sId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                const survey = new Survey(row.id, row.title, row.aId, row.responses);
                resolve(survey);
            }
        });
    });
};

function getSurveyByAdminId(adminId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM survey WHERE aId = ?';
        db.all(sql, [adminId], (err, rows) => {
            if (err)
                reject(err);
            else {
                const surveys = rows.map(record => new Survey(record.id, record.title, record.aId, record.responses));
                resolve(surveys);

            }
        });
    });
};

exports.createSurvey = (adminId, title) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO survey(title,aId)VALUES(?,?)';
        db.run(sql, [title, adminId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}


/*QUESTIONS*/

exports.getQuestionsBySurveyId = (sId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM question WHERE sId = ?';
        db.all(sql, [sId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                const questions = rows.map(record => new Question(record.id, record.title, sId, record.type, record.min, record.max));
                resolve(questions);
            }
        });
    });
}

exports.createQuestion = (question) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO question(title, sId, type, min, max) VALUES(?,?,?,?,?)`;
        db.run(sql, [question.title, question.sId, question.type, question.min, question.max], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

//This function has to be protected by 'loggedIn'
exports.createClosedAnswer = (answer) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO answer(text,qId)VALUES(?,?)`;
        db.run(sql, [answer.text, answer.qId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.deleteQuestion = (sId, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM question WHERE id=? AND sId = ?';
        db.run(sql, [id, sId], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve("Done question Deletion");
        });
    });
}

/*USER*/
exports.addUser = (name) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO user(name)VALUES(?)`;
        db.run(sql, [name], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.getUserNameById = (uId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT name FROM user WHERE id = ?';
        db.get(sql, [uId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(row.name);
            }
        });
    });
}

/*ANSWER*/

exports.getClosedAnswer = (qId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT DISTINCT A.id, A.text
                    FROM answer AS A, question AS Q 
                    WHERE  A.qId=Q.id AND Q.id=? AND Q.type="CLOSED"`;
        db.all(sql, [qId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                const answers = rows.map(record => new Answer(record.id, record.text, qId));
                resolve(answers);
            }
        });
    });
}

exports.replyToQuestion = (qId, text) => {
    //TYPE PROBABLY USELESS SINCE CLOSED QUESTION NEEDS ONLY TO WORK ONTO RELATION TABLE

    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO answer(text,qId)VALUES(?,?)';
        db.run(sql, [text, qId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });

}

exports.AddtoRelation = (uId, aId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO userAnswer(uId,aId)VALUES(?,?)';
        db.run(sql, [uId, aId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}


exports.getUserAnswersPerSurvey = (userId, sId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT A.id,A.text,A.qId
                FROM answer AS A, userAnswer AS UA, user AS U, question AS Q,survey as S
                WHERE S.id = Q.sId AND S.id = ? AND Q.id = A.qId AND  UA.uId=U.id AND A.id=UA.aId AND U.id=?`;
        db.all(sql, [sId, userId], (err, rows) => {
            if (err)
                reject(err);
            else {
                const answers = rows.map(record => new Answer(record.id, record.text, record.qId));
                resolve(answers);
            }
        });
    });
}

exports.getAllUsersPerSurvey = (sId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT DISTINCT U.id,U.name
        FROM answer AS A, userAnswer AS UA, user AS U, question AS Q,survey as S
        WHERE S.id = Q.sId AND S.id = ? AND Q.id = A.qId AND  UA.uId=U.id AND A.id=UA.aId`;
        db.all(sql, [sId], (err, rows) => {
            if (err)
                reject(err);
            else {
                const users = rows.map(record => new User(record.id, record.name));
                resolve(users);
            }
        });
    });
}


async function main(data) {

    try {

        /* const taskList = new TaskList();
        // get all the tasks
        console.log("****** All the tasks in the database: ******");
        const tasks = await taskList.getAll();
        tasks.forEach((task) => console.log(task.toString()));
     */
        /*
        //get tasks after a given deadline
        const deadline = dayjs('2021-03-13T09:00:00.000Z');
        console.log("****** Tasks after " + deadline.format() + ": ******");
        const futureTasks = await taskList.getAfterDeadline(deadline);
        futureTasks.forEach( (task) => console.log(task.toString()) );
        //get tasks with a given word in the description
        const word = "phone";
        console.log("****** Tasks containing '" + word + "' in the description: ******");
        const filteredTasks = await taskList.getWithWord(word);
        filteredTasks.forEach( (task) => console.log(task.toString()) );
        */

        debugger;

    } catch (error) {
        console.error(error);
        return;
    }

}

main()