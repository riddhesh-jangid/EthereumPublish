import React, { Component } from "react";

class ReaderProfile extends Component{
    constructor(props){ 
        super(props);
        this.state = {
            contract: props.contract,
            web3: props.web3,
            currentAddress: props.currentAddress, 
            balance: props.balance,
            importedReaderName: ""
        }       
        this.yourBooks = this.yourBooks.bind(this);
    }

    async componentWillMount(){
        try {
            this.setState({
                importedReaderName: await this.state.contract.methods.getBuyerName().call({from: this.state.currentAddress})
            });
        } 
        catch (e) {
            console.error(e);
            this.props.history.push("/Error");
        } finally {
            console.log('Executed');
        }
    }
    
    yourBooks = () =>{
        this.props.history.push({
            pathname: '/ReaderBooks',
            state: { 
                readerName: this.state.importedReaderName 
            }
        });        
    }


    render(){
        return(
            <div className="container h-100 text-center readerProfilePage">
                <h3 className="mt-2">ETHEREUM PUBLISH</h3>
                <hr/>
                <div className="readerProfileMenu">
                    <h4>Reader Space</h4>
                    <hr/>
                    <button className="btn btn-primary" onClick={e => this.yourBooks()}>Your Books</button><br/><br/>
                    <button className="btn btn-primary" onClick={e => this.props.history.push("/AllAuthorName")}>Explore Books</button><br/><br/>
                    <button className="btn btn-primary" onClick={e => alert("Ether : "+this.state.balance+" wei")}>Account balance</button><br/><br/>
                </div>
                <hr/>
                <h7>Hii, {this.state.importedReaderName}</h7><br/>
                <h7>Your Address is : {this.state.currentAddress}</h7>
                <br/><hr/> 
                <a className="btn btn-success" href="/">Home</a>
            </div>
        );
    }
}

export default ReaderProfile;