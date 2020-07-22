import React, { Component } from "react";
import { Link } from 'react-router-dom';
import AuthorProfile from './AuthorProfile';
import ReaderProfile from './ReaderProfile';

class Home extends Component{
  constructor(props){
    super(props);
    this.state = {
      contract: props.contract,
      web3: props.web3,
      currentAddress: props.currentAddress, 
      balance: props.balance,
      authorName: "",
      readerName: ""
      };
    this.onExploreAuthor = this.onExploreAuthor.bind(this);
    this.onExploreReader = this.onExploreReader.bind(this);
    this.onCreateAuthor = this.onCreateAuthor.bind(this);
    this.onCreateReader = this.onCreateReader.bind(this);
  }

  static getDerivedStateFromProps(props,state){
    return {
      contract: props.contract,
      web3: props.web3,
      currentAddress: props.currentAddress,
      balance: props.balance
    };
  }

  onExploreAuthor = async() =>{
    const accountStatus = await this.state.contract.methods.checkExistenceOfAuthor().call({from: this.state.currentAddress});
    if(accountStatus){
      this.props.history.push("/AuthorProfile");
    }
    else{
      alert("Sorry :/ you don't have Author account");
    }
  }

  onExploreReader = async() =>{
    const accountStatus = await this.state.contract.methods.checkExistenceOfBuyer().call({from: this.state.currentAddress});
    if(accountStatus){
      this.props.history.push("/ReaderProfile");
    }
    else{
      alert("Sorry :/ you don't have Reader account");
    }
  }

  onCreateAuthor = async (event) =>{
    event.preventDefault();
    const accountStatus = await this.state.contract.methods.checkExistenceOfAuthor().call({from: this.state.currentAddress});
    if(accountStatus){
      alert("You already have a Author account");
    }
    else{
      const result = await this.state.contract.methods.registerAuthor(this.state.authorName).send({from: this.state.currentAddress});
      window.location.reload();
    }
  }

  onCreateReader = async (event) =>{
    event.preventDefault();
    const accountStatus = await this.state.contract.methods.checkExistenceOfBuyer().call({from: this.state.currentAddress});
    if(accountStatus){
      alert("You already have a Reader account");
    }
    else{
      const result = await this.state.contract.methods.registerBuyer(this.state.readerName).send({from: this.state.currentAddress});
      window.location.reload();
    }
  }

  render(){
    return(
      <div className="container h-100 text-center homePage">
        <h3 className="mt-2">ETHEREUM PUBLISH</h3>
        <div className="row mt-5">
          <div className="col-sm-6 authorProfile"> 
            <h4>AUTHOR PROFILE</h4>
            <hr/>
            <div className="m-5">
              <div className="m-4">
                <h5>Explore Your Author Profile</h5>
                <button className="btn btn-success" onClick={this.onExploreAuthor} >Explore</button>
              </div>
              <br/>
              <div className="m-4">
                <h5>Create Your Author Profile</h5>
                  <form className="d-flex justify-content-center" onSubmit={ this.onCreateAuthor}>
                      <input type="text" className="form-control" id="authorName" placeholder="Author Name" onChange={e => {
                        this.state.authorName = e.target.value
                      }}></input>
                      <button type="submit" className="btn btn-primary">Create</button>
                  </form>  
              </div>
            </div>  
          </div>
          <div className="col-sm-6 readerProfile">
            <h4>READER PROFILE</h4>
            <hr/>
              <div className="m-5">
                <div className="m-4">
                  <h5>Explore Your Reader Profile</h5>
                  <button className="btn btn-success" onClick={this.onExploreReader} >Explore</button>
                </div>
                <br/>
                <div className="m-4">
                  <h5>Create Your Reader Profile</h5>
                    <form className="d-flex justify-content-center" onSubmit={ this.onCreateReader }>
                        <input type="text" className="form-control" id="readerName" placeholder="Reader Name" onChange={e => {
                          this.state.readerName = e.target.value
                        }}></input>
                        <button type="submit" className="btn btn-primary">Create</button>
                    </form>  
                </div>
              </div>  
          </div>
        </div> 
        <hr/>
        <h7>Your Address is : {this.state.currentAddress}</h7><br/> 
      </div>
    );  
  }
}

export default Home;