import React from "react";

export default class Confirm extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
    };

    componentDidMount(){
        console.log(this.props.services)
    }

    render(){
        return (
            <section>
                <p>Hello</p>
            </section>
        );
    }
}