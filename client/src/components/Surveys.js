import { ListGroup, Row, Alert } from "react-bootstrap";
import { NavLink } from 'react-router-dom';

function Surveys(props) {
    return (
        <main className="survey">
            <div className="below-nav">
                {props.message &&
                    <Alert style={{ width: "20%",fontSize:"" }} variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
                }
                <h1>{props.loggedIn ? "Your Surveys" : "Available Surveys"}</h1>
                <p style={{ color: "rgb(161, 153, 153)", fontSize: "1.1rem", paddingLeft: "0.313rem" }}>{props.loggedIn ? "Choose one survey among these displayed below to check responses (if available)" : "Choose one survey among these displayed below to begin"}</p>
                <SurveyList {...props} />
            </div>
        </main>
    );
}

function SurveyList(props) {
    return (

        <ListGroup as="ul" variant="list-group-flush" >
            {
                props.surveys && props.surveys.map((survey, index) =>

                    <Survey key={survey.id + survey.title} survey={survey} index={index} setSurvey={props.setSurvey} loggedIn={props.loggedIn} />

                )
            }
        </ListGroup>
    );
}

function Survey(props) {
    return (
        <>
            {props.loggedIn ?
                <div className={props.survey.responses > 0 ? 'hoov' : 'noresp'} style={{ color: "white", marginRight: "6.25rem" }}>
                    <ListGroup.Item as="li" className="d-flex w-100 justify-content-between bg-transparent"  >
                        <Row>
                            <p style={{ paddingRight: "1rem", color: ` ${props.survey.responses > 0 ? '#5bc0de' : '#5bc0de8e'}` }}>{props.index + 1 + "."}</p>
                            {props.survey.responses ?
                                <NavLink className="myDIV" to={"/"} onClick={() => props.setSurvey(props.survey)} style={{ color: "#5bc0de" }} >{props.survey.title} </NavLink>
                                :
                                <div className="myDIV" style={{ color: "#5bc0de8e" }} >{props.survey.title}</div>
                            }
                            <p className="hide hovfont " style={{ fontWeight: "lighter", fontSize: "70%", paddingTop: "0.450rem", color: `${props.survey.responses > 0 ? "#7FFF00" : "#FF1493"}`, paddingLeft: "10rem" }}><b>{props.survey.responses > 0 ? "View Survey's responses" : "No responses for this survey!"}</b></p>
                        </Row>
                        <h4 style={{ color: ` ${props.survey.responses > 0 ? '#5bc0de' : '#5bc0de8e'}` }}>Responses: {props.survey.responses}</h4>
                    </ListGroup.Item>
                </div>
                :
                <div className="hoov" style={{ color: "white", marginRight: "6.25rem" }}>
                    <ListGroup.Item as="li" className="d-flex w-100 justify-content-between bg-transparent"  >
                        <Row>
                            <p style={{ paddingRight: "1rem", color: "#5bc0de" }}>{props.index + 1 + "."}</p>
                            <NavLink className="myDIV" to={"/"} onClick={() => props.setSurvey(props.survey)} style={{ color: "#5bc0de" }} >{props.survey.title} </NavLink>
                            <p className="hide hovfont" style={{ fontSize: "70%", paddingTop: "0.469rem", color: "#7FFF00", paddingLeft: "10rem" }}>Fill this survey</p>
                        </Row>
                    </ListGroup.Item>
                </div>
            }
        </>
    );
}



export default Surveys;