import React, { Component } from "react";

class RegisterBook extends Component{
    constructor(props){ 
        super(props);
        this.state = {
            contract: props.contract,
            web3: props.web3,
            currentAddress: props.currentAddress, 
            balance: props.balance,
            bookName: "",
            rate: 0,
            hash: "",
            buffer: null
        }       
        this.registerBook = this.registerBook.bind(this);
        this.captureFile = this.captureFile.bind(this);
    }

    static getDerivedStateFromProps(props,state){
        return {
          contract: props.contract,
          web3: props.web3,
          currentAddress: props.currentAddress,
          balance: props.balance
        };
    }

    captureFile(event){
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
          this.setState({
            buffer: Buffer(reader.result)
          });
        }
      }
    
    registerBook = async (event) =>{
        event.preventDefault();
        const ipfsClient = require('ipfs-http-client');
        const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' });
        const pdf = [{
            content: this.state.buffer
          }]
        for await (const result of ipfs.add(pdf)) {
            console.log(result.path)
            this.setState({hash: result.path});
        }
        const result = await this.state.contract.methods.registerBook(this.state.bookName,this.state.rate,this.state.hash).send({from: this.state.currentAddress});
        console.log("Result is: ",result);
        this.props.history.push('/');
    }

    render(){
        return(
            <div className="container h-100 text-center authorProfilePage">
                <h3 className="mt-2">ETHEREUM PUBLISH</h3>
                <hr/>
                <div className="registerBook">
                    <h4>Register Book</h4>
                    <hr/>
                        <form className="" onSubmit={ this.registerBook}>
                            <input type="text" className="form-control" placeholder="Book Name" onChange={e => {
                                this.state.bookName = e.target.value}}>
                            </input><br/>
                            <input type="text" className="form-control" placeholder="Book Rate(In Ether)" onChange={e => {
                                this.state.rate = e.target.value}}>
                            </input><br/>
                            <input type="file" className="form-control" onChange={ this.captureFile }/><br/>
                            <button type="submit" className="btn btn-primary">Register Book</button>
                        </form>  
                </div>
                <hr/>
                <h7>Your Address is : {this.state.currentAddress}</h7><br/> 
            </div>
        );
    }
}

export default RegisterBook;