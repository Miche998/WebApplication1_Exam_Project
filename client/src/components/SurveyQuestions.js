import { useEffect, useState } from 'react';
import { Col, ListGroup, Form, Button, Spinner, Row, Alert, ButtonGroup, Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { Answer } from '../models/Answer';
import API from '../API';
function SurveyQuestions(props) {

    const [disable, setDisable] = useState(false);
    const [validated, setValidated] = useState(false);
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertSubmit, setshowAlertSubmit] = useState(false);
    const [loadInfo, setLoadInfo] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [redirect,setRedirect] = useState(false);

    const [count, setCount] = useState(0);
    const increaseCount = (event) => {
        event.preventDefault();
        setCount(c => c + 1)
        setLoadInfo(false);
    }
    const decreaseCount = (event) => {
        event.preventDefault();
        setCount(c => c - 1);
        setLoadInfo(false);
    }
    const [users, setUsers] = useState([]);
    const [surveysAnswers, setSurveysAnswers] = useState([]);
    

    useEffect(() => {
        if (props.loggedIn && props.survey.id !== undefined) {
            API.getAllUsersPerSurvey(props.survey.id).then(result => {
                /* setUsers(result); */
                result.forEach(r => setUsers(result));
            })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [props.loggedIn, props.survey]
    );

    useEffect(() => {
        if (users[count] !== undefined && props.survey.id !== undefined) {
            API.UserAnswerInSurvey(users[count].id, props.survey.id).then(result => {
                setSurveysAnswers(result);
                setLoadInfo(true);
            })
                .catch(err => {
                    console.error(err);
                })
        }
    }, [users, count, props.survey]
    );

    useEffect(() => {

        if (submit) {
            props.updateUser(props.username).then((u) => {
                surveysAnswers && surveysAnswers.forEach((a) => {
                    if (a && a.type && a.type === "OPEN") {
                        if (!(props.questions[a.index].min === 0 && a.text.length === 0)) {
                            props.AddOpenAnswer(a.qId, a.text, u);
                        }
                    } else {
                        a && a.forEach(c => {
                            let closedAnswerJson = { "uId": u, "aId": c.ans.id };
                            props.AddAnswerUserRelation(closedAnswerJson);
                        })
                    }
                });
            }).then(() => {
                setshowAlertSubmit(false);
                setRedirect(true);
            }).catch(error => {
                console.log(error);
            });
        }

    }, [submit]);

    useEffect(()=>{
        if(redirect)
        reset();
    },[redirect]);

    const reset = () => {
        props.setSurvey(undefined);
        props.setUsername("");
        props.setUser("");
      }

    const handleChangeUser = (value) => {
        if (value.charAt(0) !== ' ') {
            props.setUsername(value)
        }
    }
    const handleSubmitUser = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(false);
            setShowAlert(true);
            setMessage({ msg: "To start the survey your name should be at least 3 characters", type: 'danger' });
            event.stopPropagation();
        }
        setValidated(true);
        if (form.checkValidity() === true) {
            setShowAlert(false);
            setDisable(true);
        }
    };


    const [validatedSubmit, setValidatedSubmit] = useState(false);
    const submitSurvey = (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(false);
            event.stopPropagation();
        }

        let flag = 0;
        props.questions.forEach((q, index) => {
            if (q.type === "OPEN" && surveysAnswers[index]) {
                if (surveysAnswers[index].text) {
                    return flag++;
                }
            } else if (q.type === "CLOSED" && surveysAnswers[index]) {
                surveysAnswers[index].forEach(a => {
                    if (a) {
                        return flag++;
                    }
                });
            }
        })

        setValidatedSubmit(true);
        if (flag === 0) {
            setshowAlertSubmit(true);
            setMessage({ msg: "To submit the survey you must insert at least 1 answer", type: 'danger' });
        }
        else {
            if (form.checkValidity() === true) {
                setSubmit(true);
            }
        }

    }

    const [text, setText] = useState([]);
    const [checked, setChecked] = useState([[]]);

    return (
        <>
            {!redirect ?
                <main className="questions" >
                    <Col className="below-nav">
                        {props.message &&
                            <>
                                <Alert style={{ textShadow: 'none', fontSize: "1rem", width: "31%", margin: "auto" }} variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
                            </>
                        }
                        <h1 style={{ textAlign: "center" }} className="ml-2">&#8205;&#8205;  {props.survey.title}</h1>
                        {!props.loggedIn ?
                            <>
                                <Card style={{
                                    margin: "auto",
                                    width: "40%",
                                    padding: "1.25rem",
                                    backgroundColor: "transparent"
                                }}>
                                    <Card.Header style={{ backgroundColor: "rgba(110, 3, 110, 0.76)", color: "white" }}>Insert a Name:</Card.Header>
                                    <Form noValidate validated={validated} onSubmit={handleSubmitUser} >
                                        <Card.Body style={{ backgroundColor: "rgba(136, 5, 136, 0.39)" }}>
                                            <br />
                                            <Alert key={props.username} variant={message.type} show={showAlert}>
                                                {message.msg}
                                            </Alert>
                                            <Form.Control required type="text" size="lg" placeholder="...name" minLength={3} value={props.username} onChange={ev => handleChangeUser(ev.target.value)} />
                                            <br />
                                        </Card.Body>
                                        <Card.Footer style={{ backgroundColor: "rgba(110, 3, 110, 0.76)" }}>
                                            <Button variant="light" type="submit" disabled={disable}>
                                                Save
                                            </Button>
                                        </Card.Footer>
                                    </Form>
                                </Card>
                                {disable ?
                                    <Form noValidate validated={validatedSubmit} onSubmit={submitSurvey}>
                                        <h2 style={{ textAlign: "center", color: "lightgrey" }} className="ml-2">Question</h2>
                                        <QuestionList {...props} text={text} setText={setText} checked={checked} setChecked={setChecked} surveysAnswers={surveysAnswers} setSurveysAnswers={setSurveysAnswers} loggedIn={props.loggedIn} />
                                        <Row className="justify-content-md-center">
                                            <Alert key={props.username} variant={message.type} show={showAlertSubmit}>
                                                {message.msg}
                                            </Alert>
                                        </Row>
                                        <Row className="justify-content-md-center">
                                            <Button style={{ marginBottom: "1.563rem", width: "15rem" }} variant="light" type="submit">
                                                <b>Submit</b>
                                            </Button>
                                        </Row>
                                    </Form>
                                    :
                                    ""
                                }
                            </>
                            :
                            <Col >
                                {users[count] !== undefined ? <h2 style={{ color: "lightgrey", textAlign: "center" }}>&#8205;User : {users[count].name}'s Survey</h2> : ""}
                                <QuestionList {...props} surveysAnswers={surveysAnswers} setSurveysAnswers={setSurveysAnswers} loggedIn={props.loggedIn} loadInfo={loadInfo} />
                            </Col>
                        }
                    </Col>
                    {props.loggedIn &&
                        <ButtonGroup className="fixed-bottom">
                            <Button style={{ backgroundColor: "rgb(59, 3, 59)", borderColor: "black" }} disabled={`${count === 0 ? 1 : ''}`} onClick={decreaseCount}>{"<<"} Left</Button>
                            <Button style={{ backgroundColor: "rgb(59, 3, 59)", borderColor: "black" }} disabled={`${count === users.length - 1 ? 1 : ''}`} onClick={increaseCount}>Right {">>"}</Button>
                        </ButtonGroup>
                    }
                </main>
                : <Redirect to="/home" />
            }
        </>
    );
}

function QuestionList(props) {
    let qId = 1;
    let i = 1;
    return (
        <ListGroup as="ul" variant="flush">
            {
                props.questions && props.questions.map((question, index) =>
                    <Question key={"element" + i++} index={index} text={props.text} setText={props.setText} checked={props.checked} setChecked={props.setChecked} question={question} qId={qId++} surveysAnswers={props.surveysAnswers} setSurveysAnswers={props.setSurveysAnswers} loggedIn={props.loggedIn} loadInfo={props.loadInfo} />
                )
            }

        </ListGroup>
    );
}

function Question(props) {
    return (
        <Card style={{ margin: "auto", width: "70%", padding: "0.625rem", backgroundColor: "transparent" }} key={"card" + props.question.id}>
            <ListGroup.Item key={"li" + props.question.id} as="li" className=" bg-transparent" >
                <Card.Header style={{ backgroundColor: "rgba(31, 30, 30, 0.726)" }}><Title title={props.question.title} qId={props.qId} /></Card.Header>
                <Answers key = {"answer" + props.question.id} text={props.text} setText={props.setText} checked={props.checked} setChecked={props.setChecked} question={props.question} index={props.index} surveysAnswers={props.surveysAnswers} setSurveysAnswers={props.setSurveysAnswers} loggedIn={props.loggedIn} loadInfo={props.loadInfo} />
            </ListGroup.Item>
        </Card>
    );
}
function Title(props) {
    return (
        <div>
            <h3 style={{ color: "white" }}> {props.qId + ". " + props.title} </h3>
        </div>
    );
}

function Answers(props) {

    const [answers, setAnswers] = useState([]);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (props.question.type === "CLOSED") {
            API.loadClosedAnswerByQuestionId(props.question.id).then(result => {
                setAnswers(result);
                setLoad(false);

            })
                .catch(err => {
                    console.error(err);
                })
        }
    }, [props.question]
    );

    const [clicked, setClicked] = useState([]);

    let checkboxes = [...props.surveysAnswers];
    checkboxes[props.index] = [];

    const handleChange = (id, value, toggle) => {
        if (!toggle && clicked.length === 1) {
            setClicked([]);
            checkboxes[props.index] = [];
            props.setSurveysAnswers(checkboxes);
        }
        else {
            let filteredChecked;
            if (toggle) {
                filteredChecked = [...clicked, { "id": parseInt(id), "text": value }];
            } else if (!toggle) {
                filteredChecked = clicked.filter((c) => parseInt(c.id) !== parseInt(id));
            }
            setClicked(filteredChecked);
            filteredChecked.forEach(c => {

                let a = new Answer(c.id, c.text, props.question.id);
                a.type = "CLOSED";
                a.index = props.index;
                /* props.setSurveysAnswers(old => [...old, a]); */
                checkboxes[props.index].push({ type: "CLOSED", ans: a });
                props.setSurveysAnswers(checkboxes);

            })
        }
    }


    const [string, setString] = useState("");
    const handleString = (value) => {
        if (value.charAt(0) !== ' ') {
            setString(value);
            let outcome = [...props.surveysAnswers];
            let openA = new Answer(undefined, value, props.question.id);
            openA.type = "OPEN";
            openA.index = props.index;
            outcome[props.index] = openA;
            props.setSurveysAnswers(outcome);
        }
    }


    let type;
    if (props.question.type === "OPEN") {
        type = true;
    }
    else {
        type = false;
    }
    return (
        <>
            {props.loggedIn ?
                <>
                    {props.loadInfo ?
                        <>
                            {props.surveysAnswers.find(sa => sa.qId === props.question.id) ?
                                <>
                                    {type ?
                                        <>
                                            {props.surveysAnswers.map(a => {
                                                return a.qId === props.question.id &&
                                                    <div key={"div" + a.id}>
                                                        <Form.Group controlId={"Textarea" + props.question}>
                                                            <Card.Body style={{ backgroundColor: "rgba(0, 0, 0, 0.349)" }}>
                                                                <Form.Control key={a.id} readOnly required as="textarea" value={a.text} />
                                                            </Card.Body>
                                                            <Card.Footer style={{ backgroundColor: "rgba(31, 30, 30, 0.726)" }}>
                                                                <Row className="mx-auto">
                                                                    <Col>
                                                                        <Row>
                                                                            <small className="mr-auto" style={{ color: "#D8D8D8" }}>The answer can be at most 200 character long </small>
                                                                        </Row>
                                                                        <Row>
                                                                            <small className="mr-auto" style={{ color: "#D8D8D8" }}>{props.question.min > 0 ? `This answer is mandatory` : 'This answer is optional'}</small>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Card.Footer>
                                                        </Form.Group>
                                                    </div>

                                            })}
                                        </>
                                        :
                                        <Form.Group controlId={props.question.id}>
                                            <Card.Body style={{ backgroundColor: "rgba(0, 0, 0, 0.349)" }}>
                                                {props.surveysAnswers.map((a) => {
                                                    return a.qId === props.question.id &&
                                                        <div key={"div" + a.id}>
                                                            <Form.Check
                                                                custom
                                                                key={`check-${a.id}`}
                                                                disabled
                                                                type={'checkbox'}
                                                                id={`${a.id}`}
                                                                label={a.text}
                                                                checked={true}
                                                            />
                                                        </div>
                                                })}
                                            </Card.Body>
                                            <Card.Footer style={{ backgroundColor: "rgba(31, 30, 30, 0.726)" }}>
                                                <Row className="mx-auto">
                                                    <Col>
                                                        <Row>
                                                            <small className=" mr-auto" style={{ color: "#D8D8D8" }}>{props.question.min === 0 ? 'You are free to not reply to this question' : `You must check at least ${props.question.min} answers`}</small>
                                                        </Row>
                                                        <Row>
                                                            <small className="mr-auto" style={{ color: "#D8D8D8" }}>{`You can check at most ${props.question.max} answers`}</small>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Card.Footer>
                                        </Form.Group>

                                    }
                                </>
                                :
                                <div key={"empty" + props.question.id}>
                                    <Form.Group controlId={"Textarea" + props.question}>
                                        <Card.Body style={{ backgroundColor: "rgba(0, 0, 0, 0.349)" }}>
                                            <h4 style={{ color: "rgb(91, 192, 222)" }}>This question has no response</h4>
                                        </Card.Body>
                                        <Card.Footer style={{ backgroundColor: "rgba(31, 30, 30, 0.726)" }}>
                                            <Row className="mx-auto">
                                                <Col>
                                                    <Row>
                                                        <small className="mr-auto" style={{ color: "#D8D8D8" }}>This Answer was optional</small>
                                                    </Row>
                                                    <Row>
                                                        <small className="mr-auto" style={{ color: "#D8D8D8" }}>{`The User could check at most ${props.question.max} answers`}</small>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Card.Footer>
                                    </Form.Group>
                                </div>
                            }
                        </>
                        : <span><Spinner animation="border" variant="info" /> <b style={{ color: "white" }}>Please wait, loading Answers..</b></span>}
                </>
                :
                <>
                    {type ?
                        <Form.Group controlId={"Textarea" + props.question}>
                            <Card.Body style={{ backgroundColor: "rgba(0, 0, 0, 0.349)" }}>
                                <Form.Control required={props.question.min} as="textarea" placeholder="...write here your answer" minLength={props.question.min === 1 ? 1 : 0} maxLength={200} value={string} onChange={ev => handleString(ev.target.value)} />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Please provide an answer!</Form.Control.Feedback>
                            </Card.Body>
                            <Card.Footer style={{ backgroundColor: "rgba(31, 30, 30, 0.726)" }}>
                                <Row className="mx-auto">
                                    <Col>
                                        <Row>
                                            <small className="mr-auto" style={{ color: "#D8D8D8" }}>The answer can be at most 200 character long </small>
                                        </Row>
                                        <Row>
                                            <small className="mr-auto" style={{ color: "#D8D8D8" }}>{props.question.min > 0 ? `This answer is mandatory` : 'This answer is optional'}</small>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Footer>

                        </Form.Group>
                        : <>
                            {load ?
                                <span><Spinner animation="border" variant="warning" /> <b>Please wait, loading Questions...</b></span>
                                :
                                <Form.Group controlId={props.question.id}>
                                    <Card.Body style={{ backgroundColor: "rgba(0, 0, 0, 0.349)" }}>
                                        {answers && answers.map((a) => (
                                            <Form.Check
                                                custom
                                                required={clicked.length < props.question.min}
                                                disabled={clicked.length >= props.question.max && !clicked.find(c => c.id === a.id)}
                                                style={{ color: "white" }}
                                                key={`check-${a.text+a.id}`}
                                                type={'checkbox'}
                                                id={`${a.id}`}
                                                label={a.text}
                                                value={a.text}
                                                onChange={ev => handleChange(ev.target.id, ev.target.value, ev.target.checked)} />
                                        ))}

                                    </Card.Body>
                                    <Card.Footer style={{ backgroundColor: "rgba(31, 30, 30, 0.726)" }}>
                                        <Row className="mx-auto">
                                            <Col>
                                                <Row>
                                                    <small className=" mr-auto" style={{ color: "#D8D8D8" }}>{props.question.min === 0 ? 'You are free to not reply to this question' : `You must check at least ${props.question.min} answers`}</small>
                                                </Row>
                                                <Row>
                                                    <small className="mr-auto" style={{ color: "#D8D8D8" }}>{`You can check at most ${props.question.max} answers`}</small>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card.Footer>
                                </Form.Group>
                            }
                        </>
                    }
                </>
            }
        </>
    );
}

export { SurveyQuestions };