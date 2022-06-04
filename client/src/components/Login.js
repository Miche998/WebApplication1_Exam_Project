import { useState } from "react";
import { Form, Button } from 'react-bootstrap';
import { iconCode, survey, iconOutCode } from '../icons';

function Login(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };

        props.login(credentials);
    };

    return (
        <>
            <div>
                <h3 style={{color:"white"}}>{iconCode}
                    {survey}YourFootPrint{iconOutCode}</h3>
            </div>

            <br />

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{color:"rgb(136, 5, 136)"}}>Username</Form.Label>
                    <Form.Control required type="username" placeholder="Enter username" value={username} onChange={ev => setUsername(ev.target.value)} />
                   
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label style={{color:"rgb(136, 5, 136)"}}>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} />
                    <Form.Text className="text-muted">
                        We'll never share your data with anyone else.
                    </Form.Text>
                </Form.Group>

                <Button variant="outline-light" type='submit' size="lg" style={{marginLeft:"37%"}}>
                    <b>Login</b>
                </Button>
            </Form>
        </>

    );
}

export default Login;