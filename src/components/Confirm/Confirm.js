import React from "react";
import "./Confirm.css";
import RequestsContext from "../../Contexts/RequestsContext/RequestsContext";
import {Link} from "react-router-dom";

export default class Confirm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            price: 0,
            confirm: false,
            complete: false,
            cancel: false
        };
    };

    static contextType = RequestsContext;

    componentDidMount(){

        setTimeout(()=>{
            console.log(this.context.requests)
            let price = 0
            let requests = this.context.requests;


            if(requests){
                if(requests.length > 0){
                    requests.forEach( request => {
                        price += Number(request.price);
                    });
            
                    this.setState({ price });
                }
            };
        }, 400);
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
                        {this.state.confirm ? <p>Confirm?</p> : ""}
                        

                        <section id="confirm-btn-container">
                            
                            {!this.state.cancel  && !this.state.confirm
                                ? 
                                (
                                    <>
                                        <button>
                                            <Link to="/services">
                                                Edit requests
                                            </Link>
                                        </button>

                                        <button onClick={this.handleConfirmBtn}>
                                            Go to checkout
                                        </button>

                                        <button onClick={this.handleCancelBtn}>Cancel requests</button>
                                    </>
                                )
                                :

                                    <>
                                        {
                                            this.state.confirm
                                                ?
                                                <>
                                                    <button onClick={this.handleSubmit}>Yes</button>
                                                    <button onClick={this.handleConfirmBtn}>No</button>
                                                </>
                                                :
                                                <>
                                                    <button onClick={this.handleCancelRequests}>Yes</button>
                                                    <button onClick={this.handleCancelBtn}>Go back</button>   
                                                </>
                                        }
                                    </>
                        }
                        </section>
                    </>
                );

            } else{
                return <p style={{ width: "90%", margin: "0 auto"}}>
                            No requests have been requested. Get started 
                            <Link to="/services"> here</Link>
                        </p>
            }

        } else{
            return <p style={{ width: "90%", margin: "0 auto"}}>
                    No requests have been requested.
                    <Link to="/services"> here</Link>
                </p>
        }
    }

    handleCancelBtn = () => {
        this.setState({cancel: !this.state.cancel});
    }

    handleConfirmBtn = () => {
        this.setState({ confirm: !this.state.confirm, cancel: false})
    }

    handleCancelRequests = () => {
        this.context.resetRequests();
        this.props.history.push("/");
    }

    renderComplete = () => {
        return (
            <section>
                <p>Requests have been processed.</p>
                <button onClick={()=> this.props.history.push("/user")}>Ok</button>
            </section>
        );
    };

    handleSubmit = (e) => {
        this.context.completeRequests();
        this.setState({ complete: true});

    };

    render(){
        console.log(this.state);

        return (
            <section id="confirm-section">
                {!this.state.complete ? this.renderRequests() : this.renderComplete()}
            </section>
        );
    }
}