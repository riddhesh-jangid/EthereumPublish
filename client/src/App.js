import React, { Component } from "react";
import { BrowserRouter, Route, Switch,Link } from 'react-router-dom';
import Publisher from "./contracts/Publisher.json";
import getWeb3 from "./getWeb3";
//import ipfs from './ipfs';
import { Document, Page, pdfjs } from 'react-pdf';
import Home from './components/Home.js';
import AuthorProfile from './components/AuthorProfile.js';
import ReaderProfile from './components/ReaderProfile.js';
import RegisterBook from './components/RegisterBook';
import AllAuthorName from './components/AllAuthorName';
import BuyAuthorBook from './components/BuyAuthorBook';
import AuthorBooks from './components/AuthorBooks';
import ReaderBooks from './components/ReaderBooks';
import ReadBook from './components/ReadBook';
import Error from './components/Error'

import "./App.css";


class App extends Component {
  state = { 
    storageValue: "",
    currentAddress: "", 
    balance: 0,
    web3: null, 
    accounts: null, 
    contract: null, 
    buffer: null, 
    ipfsHash: '',
    numPages: null,
    accountStatus:"" 
  };

  constructor(props){
    super(props);
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
  }

  onDocumentLoadSuccess = (document) => {
    const { numPages } = document;
    this.setState({
      numPages,
    });
  };

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

  async onSubmit(event){
    event.preventDefault();
    const ipfsClient = require('ipfs-http-client');
    const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' });
    const files = [{
      content: this.state.buffer
    }]
    
    for await (const result of ipfs.add(files)) {
      this.setState({ipfsHash: result.path});
    }    
  }

  componentDidMount = async () => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;    
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Publisher.networks[networkId];
      const instance = new web3.eth.Contract(
        Publisher.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const currentAddress = await web3.currentProvider.selectedAddress;
      const balance = await web3.eth.getBalance(currentAddress);
      var importedAuthorName;
      var importedReaderName;
      // Set web3, accounts, and contract to the state, and then proceed with an
      var getAccountStatus = await instance.methods.checkExistenceOfAuthor().call({from: currentAddress});
      var whichAccount="NoOne";
      if(getAccountStatus){
        whichAccount="Author";
        getAccountStatus = await instance.methods.checkExistenceOfBuyer().call({from: currentAddress});
        if(getAccountStatus){
          whichAccount="both";
        }
      }
      else{
        getAccountStatus = await instance.methods.checkExistenceOfBuyer().call({from: currentAddress});
        if(getAccountStatus){
          whichAccount="Reader";
        }
        else{
          whichAccount="NoOne";
        }
      }
      console.log("Account :",whichAccount);
      // example of interacting with the contract's methods.
      this.setState({ currentAddress,balance ,web3, accounts, contract: instance,accountStatus: whichAccount }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.set("QmYv1fbZ3qMohjoBhPu47dNoiV9EDQ6X88Xm5DZZHh8vxS").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    //const response = await contract.methods.get().call();

    // Update state with the result.
    //this.setState({ ipfsHash: response });
  };

  render() {
    if (0) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App h-100">
        <Switch>
          <Route path="/" render={(props) => <Home {...props} 
                  web3={this.state.web3} 
                  contract={this.state.contract} 
                  currentAddress={this.state.currentAddress }
                  balance={this.state.balance} />} exact />            
          <Route path="/AuthorProfile" render={(props) => <AuthorProfile {...props} 
                  web3={this.state.web3} 
                  contract={this.state.contract} 
                  currentAddress={this.state.currentAddress }
                  balance={this.state.balance}  
                  accountStatus={this.state.accountStatus}/>} /> 
          <Route path="/ReaderProfile" render={(props) => <ReaderProfile {...props} 
                  web3={this.state.web3} 
                  contract={this.state.contract} 
                  currentAddress={this.state.currentAddress }
                  balance={this.state.balance} 
                  accountStatus={this.state.accountStatus} />} />   
          <Route path="/RegisterBook" render={(props) => <RegisterBook {...props} 
                  web3={this.state.web3} 
                  contract={this.state.contract} 
                  currentAddress={this.state.currentAddress }
                  balance={this.state.balance} 
                  accountStatus={this.state.accountStatus} />} />   
          <Route path="/AllAuthorName" render={(props) => <AllAuthorName {...props} 
                  web3={this.state.web3} 
                  contract={this.state.contract} 
                  currentAddress={this.state.currentAddress }
                  balance={this.state.balance} 
                  accountStatus={this.state.accountStatus}/>} />   
          <Route path="/BuyAuthorBook" render={(props) => <BuyAuthorBook {...props} 
                  web3={this.state.web3} 
                  contract={this.state.contract} 
                  currentAddress={this.state.currentAddress }
                  balance={this.state.balance} 
                  accountStatus={this.state.accountStatus}/>} />
          <Route path="/AuthorBooks" render={(props) => <AuthorBooks {...props} 
                  web3={this.state.web3} 
                  contract={this.state.contract} 
                  currentAddress={this.state.currentAddress }
                  balance={this.state.balance} 
                  accountStatus={this.state.accountStatus}/>} />
          <Route path="/ReaderBooks" render={(props) => <ReaderBooks {...props} 
                  web3={this.state.web3} 
                  contract={this.state.contract} 
                  currentAddress={this.state.currentAddress }
                  balance={this.state.balance} 
                  accountStatus={this.state.accountStatus}/>} />
          <Route path="/ReadBook" render={(props) => <ReadBook {...props} 
                  web3={this.state.web3} 
                  contract={this.state.contract} 
                  currentAddress={this.state.currentAddress }
                  balance={this.state.balance} 
                  accountStatus={this.state.accountStatus}/>} />
          <Route path="/Error" component={Error} />
          <Route path="*" component={Error} />        
        </Switch>
      </div>
    );
  }
}

export default App;
//d-flex align-items-center justify-content-center h-100