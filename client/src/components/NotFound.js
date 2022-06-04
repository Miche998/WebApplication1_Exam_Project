import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

function NotFound(props) {
    return (
        <main className="App-header">
            <img src="https://media.tenor.com/images/225cb3b4c82eb3e67c74b268e91eaf2a/tenor.gif" width="181.0731707317073" height="180" alt="Pepega Pepe Dancing GIF" />
            <h1 className="not-found" style={{fontSize:"5rem"}}>Page not found</h1>
            <h3><em>/404</em></h3>
            <h5>We could not find the above page on our servers.</h5>
            <p><b>Did you mean: <Link to={props.loggedIn? "/survey" : "/"} style={{color:"purple"}}>{props.loggedIn? "/survey" : "/Home"}</Link></b></p>
            <Link to={props.loggedIn? "/survey" : "/"}><Button variant="warning">Home Page</Button></Link>
        </main>

    )
}

export default NotFound;