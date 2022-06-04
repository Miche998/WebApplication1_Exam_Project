import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from './components/Nav';
import { Container, Row, Spinner, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from './API';
import Surveys from './components/Surveys';
import Login from './components/Login';
import NewSurvey from './components/NewSurvey'
import Home from './components/Home';
import { SurveyQuestions } from './components/SurveyQuestions'
import NotFound from './components/NotFound';
import { Survey } from './models/Survey';

function App() {

  /*STATES*/
  //variable to keep logged admin
  const [loggedIn, setLoggedIn] = useState(false);

  //variables related to the user
  const [username, setUsername] = useState('');
  const [user, setUser] = useState('');

  //variable to show the goBack button in the nav
  const [back, setBack] = useState(true);

  //Alert variable
  const [message, setMessage] = useState('');

  //variable to launch the useEffect when user pass from /home to /survey
  const [enter, setEnter] = useState(false);

  //List of surveys to be displayed
  const [surveys, setSurveys] = useState([]);

  //variable to keep actual survey info
  const [survey, setSurvey] = useState();

  //List of questions to be displayed
  const [questions, setQuestions] = useState([]);

  //variable to show the spinners while data is loading
  const [loading, setLoading] = useState(true);

  /*variable to launch the useEffect when a survey is
   created by the admin in order to update the surveyList*/
  const [submitted, setSubmitted] = useState(false);



  useEffect(() => {

    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // Storing UserInfo (the name) to display it in the logout modal
        await API.getUserInfo();
        setLoggedIn(true);
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);


  /*This use Effect is launched when the admin logs in or when the user clicks
  on the home button in order to load and display the surveys according to the 
  relative role*/

  useEffect(() => {
    if (!loggedIn) {
      API.loadSurveys().then(result => {
        setSurveys(result);
        setLoading(false);
      })
        .catch(err => {
          setMessage({ msg: "Impossible to load surveys! Please, try again...", type: 'danger' });
          console.error(err);
        });
    } else {
      API.loadSurveysPerAdmin().then(result => {
        setSurveys(result);
        setLoading(false);
      })
        .catch(err => {
          setMessage({ msg: "Impossible to load surveys! Please, try again...", type: 'danger' });
          console.error(err);
        });
    }
  }, [enter, loggedIn]
  );


  /*This use Effect is launched when the admin creates and submit a new
   survey in order to load and display the updated surveyList */

  useEffect(() => {
    if (submitted && loggedIn) {
      API.loadSurveysPerAdmin().then(result => {
        setSurveys(result);
        setLoading(false);
        setSubmitted(false);
      })
    }
  }, [submitted, loggedIn]);

  /*This use Effect is launched when an user or an admin
  clicks on the survey in order to load and display
  the questions related to the selected survey*/

  useEffect(() => {
    if (survey !== undefined) {
      API.loadQuestionBySurveyId(survey.id).then(result => {
        setQuestions(result);
        setLoading(false);
      })
        .catch(err => {
          setMessage({ msg: "Impossible to load  survey! Please, try again...", type: 'danger' });
          console.error(err);
        });
    }
  }, [survey])
 
  //function to call the api to submit the userinfo to the server
  const updateUser = async (userName) => {
    let name = { "name": userName }
    let result = await API.addUser(name);
    setUser(result);
    return result;
  }

  //function to do Login
  const doLogIn = async (credentials) => {
    try {
      const logged = await API.logIn(credentials);
      setLoggedIn(true);
      setLoading(true);
      /* setIsCheckingAuth(false); */
      setMessage({ msg: `Welcome, ${logged}!`, type: 'success' });
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  }


  //function to do Logout
  const doLogOut = async () => {
    setMessage("");
    await API.logOut();
    setLoggedIn(false);
    setSurvey(undefined);
    setLoading(true);
  }

  //function to add the compiled survey to the DB calling its API while it stores the info locally to show it immediately
  const newSurvey = (survey) => {
    let s = new Survey(undefined, survey.title, undefined);
    setSurveys(old => [...old, s]);
    setSubmitted(true);
    API.AddSurvey(survey);
  }
  //function to submit the answer to an open question to the server
  const AddOpenAnswer = async (qId, text, uId) => {
    const uIdText = { "text": text, "uId": uId }
    await API.ReplytoOpenAnswer(qId, uIdText);
  }

  //function to submit the answer to a closed question (which is a relation in a DB table) to the server
  const AddAnswerUserRelation = async (closedAnswerJson) => {
    await API.addUserAnswer(closedAnswerJson);
  }

  return (
    <Router>
      <Container fluid>
        <Switch>
          <Route exact path="/">
            {survey === undefined ?
              <Redirect to="/home" />
              :
              <Redirect to={"/survey/" + survey.title} />
            }

          </Route>
          {!loggedIn &&
            <Route path="/home">
              <Row>
                <Nav loggedIn={loggedIn} doLogout={doLogOut} survey={survey} setUsername={setUsername} />
                <Home setEnter={setEnter} />
              </Row >
            </Route>
          }

          <Route exact path="/survey">
            <Nav loggedIn={loggedIn} doLogout={doLogOut} survey={survey} setSurvey={setSurvey} setUsername={setUsername} setBack={setBack} />
            {!loading ?
              <Surveys message={message} setMessage={setMessage} surveys={surveys} setSurvey={setSurvey} loggedIn={loggedIn} />
              : <main className="spin"><span><Spinner animation="border" variant="info" /> <b>Please wait, loading Survey...</b></span></main>}
          </Route>


          <Route exact path="/survey/:title" render={({ match }) =>

            surveys.some(t => t.title === match.params.title) ? (
              <Row>
                <Nav loggedIn={loggedIn} doLogout={doLogOut} survey={survey} setSurvey={setSurvey} back={back} setBack={setBack} setUsername={setUsername} />
                {loading ?
                  <main className="spin"><span><Spinner animation="border" variant="info" /> <b>Please wait, loading Survey...</b></span></main> :
                  <SurveyQuestions message={message} setMessage={setMessage} submitted={submitted} setSubmitted={setSubmitted} questions={questions} username={username} setUsername={setUsername} setSurvey={setSurvey} survey={survey} setLoading={setLoading} user={user} updateUser={updateUser} setUser={setUser} AddOpenAnswer={AddOpenAnswer} AddAnswerUserRelation={AddAnswerUserRelation} loggedIn={loggedIn} />
                }
              </Row>
            ) :
              <Redirect to="/survey" />
          } />
          <Route path="/login">
            <>
              {loggedIn ? <Redirect to={"/survey"} />
                :
                <Row className='col-12-centered below-nav login'>
                  {message && <Row>
                    <Alert style={{ textShadow: 'none', fontSize: "1.1rem" }} variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
                  </Row>}
                  <Login login={doLogIn} />
                </Row>}
            </>
          </Route>
          <Route path="/add">
            {loggedIn ?
              <Row>
                <Nav loggedIn={loggedIn} doLogout={doLogOut} survey={survey} setUsername={setUsername} back={back} />
                <NewSurvey newSurvey={newSurvey} />
              </Row>
              : <Redirect to="/survey" />
            }
          </Route>
          <Route path="/404">
            <Row>
              <NotFound loggedIn={loggedIn} />
            </Row >
          </Route>
          <Redirect to="/404" />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;


