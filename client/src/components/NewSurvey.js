import { useState } from "react";
import { Form, Alert, Button, Col, Row, ButtonGroup, ListGroup, Modal, ModalBody, ModalFooter, Card } from "react-bootstrap";
import { Question } from "../models/Question";
import { Redirect } from 'react-router-dom';
import { Answer } from "../models/Answer";
import { iconDelete, arrowDown, arrowUp } from "../icons";

function NewSurvey(props) {

    const [surveyTitle, setSurveyTitle] = useState("");

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    const [disable, setDisable] = useState(false);
    const [validated, setValidated] = useState(false);
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const handleSubmitSurvey = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(false);
            setShowAlert(true);
            setMessage({ msg: "Your Title should be at least 4 characters", type: 'danger' });
            event.stopPropagation();
        }
        setValidated(true);
        if (form.checkValidity() === true) {
            setShowAlert(false);
            setDisable(true);
        }
    };

    const deleteQuestion = (i) => {
        let filteredQuestions = questions.filter((q, index) => index !== i);
        setQuestions(filteredQuestions);
    }
    const moveUp = (i) => {
        setQuestions(prevQuestions => {
            let data = [...prevQuestions];
            let tmp = data[i - 1];
            data[i - 1] = data[i];
            data[i] = tmp;
            return data;
        })
    }

    const moveDown = (i) => {
        setQuestions(prevQuestions => {
            let data = [...prevQuestions];
            let tmp = data[i + 1];
            data[i + 1] = data[i];
            data[i] = tmp;
            return data;
        })
    }



    return (
        <>
            {!submitted ?
                <main className="questions">
                    <Col className="below-nav" >
                        <h1 style={{ textAlign: "center" }}>Create Your Survey</h1>
                        <Card style={{
                            margin: "auto",
                            width: "40%",
                            padding: "1.25rem",
                            backgroundColor: "transparent"
                        }}>
                            <Card.Header style={{ backgroundColor: "rgba(110, 3, 110, 0.76)", color: "white" }}>Insert Survey Title:</Card.Header>
                            <Form noValidate validated={validated} onSubmit={handleSubmitSurvey}>
                                <Card.Body style={{ backgroundColor: "rgba(136, 5, 136, 0.39)" }}>
                                    <Alert key={surveyTitle} variant={message.type} show={showAlert}>
                                        <small>{message.msg}</small>
                                    </Alert>
                                    <Form.Control required type="text" placeholder="Survey Title.." readOnly={disable} minLength={4} value={surveyTitle} onChange={ev => { if (ev.target.value.charAt(0) !== ' ') setSurveyTitle(ev.target.value) }} />
                                </Card.Body>
                                <Card.Footer style={{ backgroundColor: "rgba(110, 3, 110, 0.76)" }}>
                                    <Button variant="light" type="submit" disabled={disable}>
                                        Submit
                                    </Button>
                                </Card.Footer>
                            </Form>
                        </Card>

                        <QuestionModal setSubmitted={setSubmitted} surveyTitle={surveyTitle} newSurvey={props.newSurvey} answers={answers} setAnswers={setAnswers} disable={disable} setValidated={setValidated} setQuestions={setQuestions} validated={validated} questions={questions} />
                        <ListGroup as="ul" variant="flush" style={{ paddingTop: "3rem" }} key={"question-groups"}>
                            {questions && questions.map((q, index) =>
                                <div key={q.title + " id:" + index}>
                                    <h2 style={{ textAlign: "center", color: "lightgrey" }}>Question {index + 1}</h2>
                                    {
                                        q.type === "OPEN" ?
                                            <Card style={{ margin: "auto", width: "70%", padding: "0.625rem", backgroundColor: "transparent" }}>
                                                <ListGroup.Item as="li" className="bg-transparent" key={"open" + q.title} style={{ backgroundColor: "#FFFAF0" }}>
                                                    <Card.Header style={{ backgroundColor: "rgba(31, 30, 30, 0.726)" }}>
                                                        <Row className="ml-1">
                                                            <h3 style={{ color: "white" }}>Title:{q.title}</h3>
                                                            <Col>
                                                                <Button style={{ float: "right" }} variant="info" disabled={index === 0 ? 1 : ''} onClick={() => moveUp(index)}>{arrowUp}</Button>
                                                            </Col>
                                                        </Row>
                                                    </Card.Header>
                                                    <Card.Body style={{ backgroundColor: "rgba(39, 39, 39, 0.349)" }}>
                                                        <Row>
                                                            <Col>
                                                                <h3 style={{ color: "#5bc0de" }}>Info:</h3><br />
                                                                <h5>Type: {q.type}</h5>
                                                                <h5>Mandatory: {q.min === 1 ? "true" : "false"}</h5>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                    <Card.Footer style={{ backgroundColor: "rgba(31, 30, 30, 0.726)" }}>
                                                        <Button variant="danger" onClick={() => deleteQuestion(index)}>{iconDelete}</Button>
                                                        <Button style={{ float: "right" }} variant="info" disabled={index === (questions.length - 1) ? 1 : ''} onClick={() => moveDown(index)}>{arrowDown}</Button>
                                                    </Card.Footer>
                                                </ListGroup.Item>
                                            </Card>
                                            :
                                            <Card style={{ margin: "auto", width: "70%", padding: "0.625rem", backgroundColor: "transparent" }}>
                                                <ListGroup.Item as="li" className="bg-transparent" key={"closed" + q.title} style={{ backgroundColor: "#FFFAF0" }}>
                                                    <Card.Header style={{ backgroundColor: "rgba(31, 30, 30, 0.726)" }}>
                                                        <Row className="ml-1">
                                                            <h3 style={{ color: "white" }}>Title:{q.title}</h3>
                                                            <Col>
                                                                <Button style={{ float: "right" }} variant="info" disabled={index === 0 ? 1 : ''} onClick={() => moveUp(index)}>{arrowUp}</Button>
                                                            </Col>
                                                        </Row>
                                                    </Card.Header>
                                                    <Card.Body style={{ backgroundColor: "rgba(39, 39, 39, 0.349)" }}>
                                                        <Row style={{ marginLeft: "0.063rem" }}>
                                                            <h3 style={{ color: "#5bc0de" }}>Info:</h3><br />
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <h5>Type: {q.type}</h5>
                                                                <h5>Min:{q.min}</h5>
                                                                <h5>Max:{q.max}</h5>
                                                            </Col>
                                                            <Col className="mx-auto">
                                                                <h5>Answers:</h5>
                                                                {q.answers && q.answers.map((a, index) => <div style={{ color: "white" }} key={index}>{a}</div>)}
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                    <Card.Footer style={{ backgroundColor: "rgba(31, 30, 30, 0.726)" }}>
                                                        <Button variant="danger" onClick={() => deleteQuestion(index)}>{iconDelete}</Button>
                                                        <Button style={{ float: "right" }} variant="info" disabled={index === (questions.length - 1) ? 1 : ''} onClick={() => moveDown(index)}>{arrowDown}</Button>
                                                    </Card.Footer>
                                                </ListGroup.Item>
                                            </Card>
                                    }
                                </div>
                            )}
                        </ListGroup>
                    </Col>
                </main>
                :
                <Redirect to="/survey" />
            }

        </>
    );
}

function QuestionModal(props) {

    const [text, setText] = useState("");
    const [mandatory, setMandatory] = useState(0);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(1);
    const [answersNo, setAnswersNo] = useState(0);
    const [showAnswers, setShowAnswers] = useState(false);
    const [Nans, setNans] = useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false); setShowOpen(false); setShowClosed(false); };
    const handleShow = () => { setShow(true); reset(); }
    const [showClosed, setShowClosed] = useState(false);
    const [showOpen, setShowOpen] = useState(false);
    const reset = () => {
        setText(""); setMandatory(0); setAnswersNo(0);
        setMin(0); setMax(1);
        props.setAnswers([]); setNans([]);
        setShowAnswers(false); props.setValidated(false);
    }

    const increaseShowAnswers = (event) => {
        event.preventDefault();
        setAnswersNo(v => v + 1);
        setNans(old => [...old, answersNo]);
        setShowAnswers(true);
    }

    const decreaseShowAnswers = (event) => {
        event.preventDefault();
        setAnswersNo(v => v - 1);
        let tmp = [...Nans];
        tmp.pop();
        let ans = [...props.answers];
        if(ans[answersNo-1]  || ans[answersNo-1] === "")
            ans.pop();
        setNans(tmp);
        props.setAnswers(ans);
    }


    const onSubmitOpenQuestion = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            props.setValidated(false);
            event.stopPropagation();
        }
        props.setValidated(true);
        if (form.checkValidity() === true) {
            let q = new Question(undefined, text, undefined, "OPEN", mandatory, 1);
            props.setQuestions(old => [...old, q]);
            handleClose();
        }
    }

    const onSubmitClosedAnswer = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            props.setValidated(false);
            event.stopPropagation();
        }
        props.setValidated(true);
        if (form.checkValidity() === true) {
            let q = new Question(undefined, text, undefined, "CLOSED", min, max);
            q.answers = [];
            props.answers.forEach(a => q.answers.push(a));
            props.setQuestions(old => [...old, q]);
            handleClose();
        }
    }

    const SubmitSurvey = () => {

        let q = [];
        for (let i = 0; i < props.questions.length; i++) {
            if (props.questions[i].type === "OPEN") {
                /* q[i] = { "title": props.questions[i].title, "type": props.questions[i].type, "min": props.questions[i].min, "max": props.questions[i].max }; */
                q[i] = new Question(undefined, props.questions[i].title, undefined, "OPEN", props.questions[i].min, props.questions[i].max);
            } else if (props.questions[i].type === "CLOSED") {
                let a = [];
                for (let j = 0; j < props.questions[i].answers.length; j++) {
                    /* a.push({ "text": props.questions[i].answers[j] }); */
                    a.push(new Answer(undefined, props.questions[i].answers[j], undefined));
                }
                /* q[i] = {"title": props.questions[i].title, "type": props.questions[i].type, "min": props.questions[i].min, "max": props.questions[i].max, "answers": a }; */
                q[i] = new Question(undefined, props.questions[i].title, undefined, "CLOSED", props.questions[i].min, props.questions[i].max);
                q[i].answers = a;
            }
            /* q[i] ={"title" : props.questions[i].title, "type" : props.questions[i].type, "min" : props.questions[i].min, "max" : props.questions[i].max, "answers" : [...(props.questions[i].answers.forEach(n=>n.text))]}; */
        }
        let survey = { "title": props.surveyTitle, "questions": q };
        props.newSurvey(survey);
        props.setSubmitted(true);
    };

    return (
        <>
            <Col className="col-md-12 text-center">
                <Button onClick={handleShow} variant="info" disabled={!props.disable}>Insert New Question</Button>
                <Button className="ml-2" variant="dark" onClick={SubmitSurvey} disabled={props.questions.length < 1 ? 1 : ''}>Submit Survey</Button>
            </Col>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton style={{ backgroundColor: "rgb(173, 170, 170)" }}>
                    <Modal.Title><b>New Question</b></Modal.Title>
                </Modal.Header>
                <ModalBody style={{ backgroundColor: "rgb(173, 170, 170, 0.362)" }}>
                    <Form.Row><Form.Label><b>Question Type</b></Form.Label></Form.Row>
                    <ButtonGroup aria-label="Basic example">
                        <Button variant="outline-info" onClick={() => { setShowOpen(true); setShowClosed(false) }}><b>Open</b></Button>
                        <Button variant="outline-info" onClick={() => { setShowClosed(true); setShowOpen(false) }}><b>Closed</b></Button>
                    </ButtonGroup>
                </ModalBody>

                {showOpen &&
                    <OpenQuestionForm onSubmitOpenQuestion={onSubmitOpenQuestion} validated={props.validated} text={text} setText={setText} setMandatory={setMandatory} handleClose={handleClose} />
                }
                {showClosed &&
                    <ClosedQuestionForm setAnswers={props.setAnswers} validated={props.validated} answers={props.answers} onSubmitClosedAnswer={onSubmitClosedAnswer} text={text} setText={setText} min={min} setMin={setMin} max={max} setMax={setMax} answersNo={answersNo} setAnswersNo={setAnswersNo} showAnswers={showAnswers} increaseShowAnswers={increaseShowAnswers} decreaseShowAnswers={decreaseShowAnswers} Nans={Nans} handleClose={handleClose} />
                }
            </Modal>
        </>
    );
}

function OpenQuestionForm(props) {
    return (
        <Form noValidate validated={props.validated} onSubmit={props.onSubmitOpenQuestion}>
            <ModalBody style={{ backgroundColor: "rgb(173, 170, 170, 0.362)" }} >
                <Form.Group controlId={"Textarea"}>
                    <Form.Label><b>Question Title:</b></Form.Label>
                    <Form.Control required as="textarea" minLength={1} maxLength={200} value={props.text} onChange={ev => { if (ev.target.value.charAt(0) !== ' ') props.setText(ev.target.value) }} />
                    <br /><Form.Label><b>Mandatory</b></Form.Label>
                    <Form.Check type="switch" custom id='1' onChange={ev => props.setMandatory(parseInt(ev.target.id))} />
                </Form.Group>
            </ModalBody>
            <ModalFooter className="align-item-center" style={{ backgroundColor: "rgb(173, 170, 170)" }}>
                <Button variant="danger" onClick={props.handleClose}>
                    <b>Close</b>
                </Button>
                <Button type="submit" variant="success" >
                    <b>Save Changes</b>
                </Button>
            </ModalFooter>
        </Form>
    );

}

function ClosedQuestionForm(props) {

    const handleInputChange = (e, index) => {
        const list = [...props.answers];
        list[index] = e.target.value;
        props.setAnswers(list);

    };

    return (
        <Form noValidate validated={props.validated} onSubmit={props.onSubmitClosedAnswer}>
            <ModalBody style={{ backgroundColor: "rgb(173, 170, 170, 0.362)" }}>
                <Form.Group controlId={"Textarea"}>
                    <Form.Label><b>Question Title:</b></Form.Label>
                    <Form.Control required as="textarea" minLength={1} maxLength={200} value={props.text} onChange={ev => { if (ev.target.value.charAt(0) !== ' ') props.setText(ev.target.value) }} />
                    <Form.Control.Feedback type="invalid"><b>Please provide a question Title!</b></Form.Control.Feedback>
                    <Form.Row>
                        <Col>
                            <Form.Label><b>Min</b></Form.Label>
                            <Form.Control required type='number' min={0} value={props.min} onChange={ev => props.setMin(ev.target.value)} >
                            </Form.Control>
                            <Form.Control.Feedback><b>Looks good!</b></Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Label><b>Max</b></Form.Label>
                            <Form.Control required type='number' min={props.min} max={props.answersNo} value={props.max} onChange={ev => props.setMax(ev.target.value)} >
                            </Form.Control>
                            <Form.Control.Feedback><b>Looks good!</b></Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid"><b>Please provide a valid value!</b></Form.Control.Feedback>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                            <Form.Label><b>#Answers:</b></Form.Label>
                            <Form.Row>
                                <Col>
                                    <Form.Control required disabled={true} type="number" value={props.answersNo} />
                                </Col>
                                <Col>
                                    <Button onClick={props.increaseShowAnswers} variant="info"><b>Add</b></Button>
                                    <Button onClick={props.decreaseShowAnswers} disabled={props.answersNo === 0} className="ml-2" variant="info"><b>Remove</b></Button>
                                </Col>
                            </Form.Row>
                        </Col>
                    </Form.Row>
                    {props.showAnswers &&
                        props.Nans.map((n, index) =>
                            <div key={"closed: " + n + " index:" + index}>
                                <Form.Row key={n}>
                                    <Form.Label><b>Closed Answer {n + 1}:</b></Form.Label>
                                    <Form.Control key={"text-" + { n }} required as="textarea" placeholder="...new question" minLength={1} maxLength={200} value={props.answers[index]} onChange={ev => handleInputChange(ev, index)} />
                                    <Form.Control.Feedback type="invalid"><b>Please provide an answer!</b></Form.Control.Feedback>
                                </Form.Row>
                            </div>
                        )
                    }

                </Form.Group>
            </ModalBody>
            <ModalFooter className="align-item-center" style={{ backgroundColor: "rgb(173, 170, 170)" }}>
                <Button variant="danger" onClick={props.handleClose}>
                    <b>Close</b>
                </Button>
                <Button type="submit" variant="success" disabled={props.answers.length === 0} >
                    <b>Save Changes</b>
                </Button>
            </ModalFooter>
        </Form>
    );
}
export default NewSurvey;