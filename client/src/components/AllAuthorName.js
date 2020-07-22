import React, { Component } from "react";
import { Link } from 'react-router-dom';

class AllAuthorName extends Component{
    constructor(props){ 
        super(props);
        this.state = {
            contract: props.contract,
            web3: props.web3,
            currentAddress: props.currentAddress, 
            balance: props.balance,
            authorArray: []
        }       
        console.log("Acccount status:  ",props.accountStatus);
        if(props.accountStatus=="Reader" || props.accountStatus=="both"){}
        else{
            props.history.push('/');
        }
    }

    async componentWillMount(){
        try {
            const totalAuthor = await this.state.contract.methods.totalAuthor().call({from: this.state.currentAddress});
            var authorNames="";
            var authorArray=[];
            for(var i=0; i<totalAuthor; i++){
                authorNames = await this.state.contract.methods.getAuthorNameById(i).call({from: this.state.currentAddress});
                console.log("Author ID "+i+authorNames);
                authorArray.push(authorNames);
            }
            this.setState({
                authorArray: authorArray
            });
        } 
        catch (e) {
            console.error(e);
            this.props.history.push("/Error");
        } finally {
            console.log('Executed');
        }
    }

    render(){
        return(
            <div className="container h-100 text-center authorProfilePage">
                <h3 className="mt-2">ETHEREUM PUBLISH</h3>
                <hr/>
                <div className="authorList">
                    <h4>Author List</h4>
                    <hr/>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Author ID</th>
                                <th>Author Name</th>
                                <th>Explore Book</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.authorArray.map((names, id) => (
                                <tr>
                                <td>{id}</td>
                                <td>{names}</td>
                                <td>
                                    <Link to={{
                                        pathname: '/BuyAuthorBook',
                                        state: { 
                                            authorName: {names} }
                                        }}> Click 
                                    </Link>
                                </td>
                                </tr>
                            ))}
                        </tbody>    
                    </table>    
                    <br/>
                </div>
            </div>    
        );
    }
}

export default AllAuthorName;