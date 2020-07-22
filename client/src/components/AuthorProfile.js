import React, { Component } from "react";

class AuthorProfile extends Component{
    constructor(props){ 
        super(props);
        this.state = {
            contract: props.contract,
            web3: props.web3,
            currentAddress: props.currentAddress, 
            balance: props.balance,
            importedAuthorName: ""
        }       
        this.getContractBalance = this.getContractBalance.bind(this);
        this.yourBooks = this.yourBooks.bind(this);
        console.log("Constructor");
    }

    async componentWillMount(){
        try {
            this.setState({
                importedAuthorName: await this.state.contract.methods.getAuthorName().call({from: this.state.currentAddress})
            });
        } catch (e) {
            this.props.history.push("/Error");
        } finally {
            console.log('Executed');
        }
    }

    yourBooks = () =>{
        this.props.history.push({
            pathname: '/AuthorBooks',
            state: { 
                authorName: this.state.importedAuthorName 
            }
        });        
    }

    getContractBalance = async() =>{
        const contractBalance= await this.state.contract.methods.getAuthorContractBalance().call({from: this.state.currentAddress});
        alert("Your contract hold: "+contractBalance+" Ether");
    }

    render(){
        console.log("Render");
        return(
            <div className="container h-100 text-center authorProfilePage">
                <h3 className="mt-2">ETHEREUM PUBLISH</h3>
                <hr/>
                <div className="authorProfileMenu">
                    <h4>Author Space</h4>
                    <hr/>
                    <button className="btn btn-primary" onClick={ e => alert("Ether : "+this.state.balance+" wei") }>Account balance</button><br/><br/>
                    <button className="btn btn-primary" onClick={ e => this.yourBooks() }>Your Books</button><br/><br/>
                    <button className="btn btn-primary" onClick={e => this.props.history.push("/RegisterBook")}>Register New book</button><br/><br/>
                </div>
                <hr/>
                <h7>Hii, {this.state.importedAuthorName}</h7><br/>
                <h7>Your Address is : {this.state.currentAddress}</h7><br/> 
                <hr/> 
                <a className="btn btn-success" href="/">Home</a>
            </div>
        );
    }
}

export default AuthorProfile;