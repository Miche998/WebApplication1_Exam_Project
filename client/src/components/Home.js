import './home.css'
import { Link } from 'react-router-dom'



function Home(props) {
    return (
        <main className="App-header">
            <div style={{ textAlign: "center" }}>
                <h1 >Start Discovering our Surveys</h1>
                <br/>
                <h4 className="sub">Our website offers different kind of Surveys.<br /> Click on the button below if you want to contribute anonymously!</h4>
                <br />
            </div>
            <Link to="/survey" className="btn btn-outline-dark bt" style={{color:"rgb(136, 5, 136)",width:"20%"}} onClick={() => props.setEnter(true)}><b>Leave your footprint!</b></Link>
        </main>

    )
}


export default Home;