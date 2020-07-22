import React, { Component } from "react";

class Error extends Component{
    render(){
        return(
            <div className="h-100 text-center errorPage">
                <h2>1) Don't Reload page</h2><br/>
                <h2>2) Don't alter url directly</h2>
                <a className="btn btn-success" href="/">Home</a>
            </div>
        );
    }
}

export default Error;