import { survey } from "../icons.js";
import { Container, Button } from 'react-bootstrap';
import { NavLink, Link, Redirect, useHistory } from "react-router-dom";
import { useState } from "react";

function Nav(props) {

    const history = useHistory();
    const [disable, setDisable] = useState(false);
    const redirectToHome = (event) => {
        event.preventDefault();
        <Redirect to="/home" />
        props.doLogout();
    }

    return (
        <Container fluid className="p-0">
            <nav className="navbar navbar-expand-sm navbar-dark fixed-top" style={{ backgroundColor: "rgb(59, 3, 59)" }}>

                <div className='mr-auto '>
                    <NavLink className="d-none d-sm-block navbar-brand" to={`${props.loggedIn ? "/survey" : "/home"}`} onClick={() => { props.survey && props.setSurvey(undefined); props.setUsername("") }}>
                        {survey}
                        YourFootPrint
                    </NavLink>
                </div>
                {
                    props.loggedIn && !props.back &&
                    <Link to="/add">
                        <Button className="mr-2 text-light" variant="info" disabled={disable} onClick={() => setDisable(true)}>
                            <b>New Survey</b>
                        </Button>
                    </Link>
                }
                {!props.loggedIn ?
                    <>
                        {props.survey === undefined ?
                            <Link to="/login" className="mr-2 btn btn-outline-light"><b>Log In</b></Link>
                            :
                            ''
                        }
                    </>
                    :
                    <>
                        {!props.back ?
                            <button  className="mr-2 btn btn-danger text-light bt" onClick={redirectToHome}><b>Log Out</b></button>
                            : <Button onClick={() => history.goBack()}><b>Go Back</b></Button>
                        }
                    </>
                }
            </nav>
        </Container>

    );
}


export default Nav;