import React from "react";
import "./Confirm.css";
import RequestsContext from "../../Contexts/RequestsContext/RequestsContext";
import {Link} from "react-router-dom";

export default class Confirm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            price: 0,
            cancel: false
        };
    };

    static contextType = RequestsContext;

    componentDidMount(){
        let price = 0
        let requests = this.context.requests;


        if(requests){
            if(requests.length > 0){
                requests.forEach( request => {
                    price += Number(request.price);
                });
        
                this.setState({ price });
            }
        }

        if(this.context.requests){
            console.log(this.context.requests, this.props.services);
        } else{
            console.log(this.context);
        }
        console.log(this.props.services)
    }

    renderRequests = () => {
        let requests = this.context.requests;
        console.log(this.context.date)
        if(this.context.requests){
            console.log(this.context.date)
            if(this.context.requests.length > 0 ){
                requests = requests.map( (request, index) => <li key={index}>{request.service}</li>);
                
                return (
                    <>
                        <p style={{margin: "2em auto -1em auto"}}><strong>Services:</strong></p>
                        <ul id="confirm-ul">
                            {requests}
                        </ul>

                        <p style={{marginTop: "2em"}}>Set for</p>
                        <p>{new Date(this.context.date).toDateString()} at {this.context.time ? this.context.time : <p><strong>The time is needed. Edit your your request to include the time</strong></p>}</p>

                        <p> ${this.state.price}</p>

                        {this.state.cancel ? <p>Are you sure?</p> : ""}

                        <section id="confirm-btn-container">
                            
                            {!this.state.cancel ? (
                                <>
                                    <button>
                                        <Link to="/services">
                                            Edit requests
                                        </Link>
                                    </button>

                                    <button>
                                        <Link to="/services/checkout">
                                            Go to checkout
                                        </Link>
                                    </button>

                                    <button onClick={this.handleCancelBtn}>Cancel requests</button>
                                </>
                            )
                                :

                            <>
                                <button onClick={this.handleCancelRequests}>Yes</button>
                                <button onClick={this.handleCancelBtn}>Go back</button>   
                            </>
                        }
                        </section>
                    </>
                );

            } else{
                return <p>No requests have been requested.</p>
            }

        } else{
            return <p>No requests have been requested.</p>
        }
    }

    handleCancelBtn = () => {
        this.setState({cancel: !this.state.cancel});
    }

    handleCancelRequests = () => {
        this.context.resetRequests();
        this.props.history.push("/");
    }

    render(){
        console.log(this.state.price);

        return (
            <section id="confirm-section">
                {this.renderRequests()}
            </section>
        );
    }
}