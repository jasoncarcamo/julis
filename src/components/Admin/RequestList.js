import React from "react";
import TokenService from "../../TokenService/TokenService";
import "./requestlist.css";

export default class RequestList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: {

            },
            confirm: false,
            cancelRequest: false,
            admin_comment: "",
            error: ""
        };
    };

    componentDidMount(){
        
        fetch(`https://nameless-beach-67218.herokuapp.com/api/user/${this.props.request.user_id}`, {
            headers: {
                'content-type': "application/json",
                'authorization': `bearer ${TokenService.getAdminToken()}`
            }
        })  
            .then( res => {
                if(!res.ok){
                    return res.json().then( e => Promise.reject(e));
                };

                return res.json()
            })
            .then(resData => {

                this.setState({ user: resData.user });

            })
            .catch( err => this.setState({ error: err.error}))
    }

    renderRequests = () => {
        let requests = this.props.request.service;

        requests = requests.map( (request, index) => {
            return <li key={index}>{request.service}</li>;
        });

        return requests;
    };

    numberToAnchor = () => {
        let number = this.state.user.mobile_number;
        
        number = String(number).split(" ").join("");
        
        return number;
    }

    addressToLink = (state)=>{
        let address = `${state.user.house_number}+${state.user.street_name}+${state.user.city}+${state.user.state}`
        
        address = address.split(" ").join("+");

        return `https://www.google.com/maps/search/?api=1&query=${address}`;
    }

    adminCommentHandler = (e)=>{
        this.setState({ admin_comment: e.target.value});
    }

    renderConfirmForm = ()=>{
        return (
            <form id="confirm-request-form" onSubmit={this.handleConfirmRequest}>
                <fieldset>
                    <label htmlFor="request-comment">Comment:</label>
                    <textarea id="request-comment" onChange={this.adminCommentHandler} value={this.state.admin_comment} required></textarea>

                    <div>
                        <button type="submit">Ok</button>
                        <button onClick={()=>{this.setState({ confirm: !this.state.confirm})}}>Cancel</button>
                    </div>
                </fieldset>
            </form>
        )
    }

    renderOptionBtns = ()=>{
        return (
            <div>
                <button onClick={()=>{this.setState({ confirm: !this.state.confirm})}}>Confirm</button>
                <button onClick={()=>{this.setState({ cancelRequest: !this.state.cancelRequest})}}>Cancel request</button>
            </div>
        )
    }

    renderConfirmCancel = ()=>{
        return (
            <div>
                <button onClick={this.handleDeleteRequest}>Confirm cancel</button>
                <button onClick={()=>{this.setState({ cancelRequest: !this.state.cancelRequest})}}>Cancel</button>
            </div>
        )
    }

    handleConfirmRequest = (e)=>{
        e.preventDefault();

        fetch(`https://nameless-beach-67218.herokuapp.com/api/requests/${this.props.request.id}`, {
            method:  "PATCH",
            headers: {
                'content-type': "application/json",
                'authorization': `bearer ${TokenService.getAdminToken()}`
            },
            body: JSON.stringify({
                admin_confirmed: true,
                admin_comment: this.state.admin_comment
            })
        })
            .then( res => {
                if(!res.ok){
                    return res.json().then( e => Promise.reject(e));
                };

                return res.json();
            })
            .then( resData => {
                
                this.componentDidMount();
                this.props.refreshAdmin();
               
            })
            .catch( err => this.setState({ error: err.error}));
    }

    handleDeleteRequest = (e)=>{
        e.preventDefault();
        fetch(`https://nameless-beach-67218.herokuapp.com/api/requests/${this.props.request.id}`, {
            method: "DELETE",
            headers: {
                'content-type': "application/json",
                'authorization': `bearer ${TokenService.getAdminToken()}`
            }
        })
            .then( res => {
                if(!res.ok){
                    return res.json().then( e => Promise.reject(e));
                };

                return res.json();
            })
            .then( resData => {

                this.componentDidMount();
                this.props.refreshAdmin();

            })
            .catch( err => this.setState({ error: err.error}));
    }

    render(){
        
        return (
            <li className="request-list">
                <p>Name: {this.state.user.first_name} {this.state.user.last_name}
                </p>

                <ul>
                    Requests: 
                    {this.renderRequests()}
                </ul>

                <p>Set for: {new Date(this.props.request.date).toDateString()}</p>
                <p>Time: {this.props.request.time}</p>

                <p>Address: <a href={this.addressToLink(this.state)}>{this.state.user.house_number} {this.state.user.street_name} {this.state.user.city} {this.state.user.state}</a></p>

                <p>Mobile number: <a href={`tel:${this.numberToAnchor()}`}>{this.state.user.mobile_number}</a></p>

                <p>Email: <a href={`mailto:${this.state.user.email}`}>{this.state.user.email}</a></p>

                {this.props.request.admin_comment !== null ? <p>Will need: {this.props.request.admin_comment}</p>:""}

                {this.state.confirm ? this.renderConfirmForm() : ""}

                {!this.state.confirm && !this.state.cancelRequest ? this.renderOptionBtns() : ""}

                {this.state.cancelRequest ? this.renderConfirmCancel() : ""}
            </li>
        );
    };
}