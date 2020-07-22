import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
//import ipfs from './ipfs';
import { Document, Page, pdfjs } from 'react-pdf';

import "./App.css";

class App extends Component {
  state = { storageValue: "", web3: null, accounts: null, contract: null, buffer: null, ipfsHash: '', numPages: null };

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
      console.log("Buffer : ",this.state.buffer);
    }
  }

  async onSubmit(event){
    event.preventDefault();
    const ipfsClient = require('ipfs-http-client');
    const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' });
    var ipfsPATH= "/ipfs/QmYv1fbZ3qMohjoBhPu47dNoiV9EDQ6X88Xm5DZZHh8vxS";
    const files = [{
      content: this.state.buffer
    }]
    
    for await (const result of ipfs.add(files)) {
      console.log(result.path)
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
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
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
    await contract.methods.set("QmYv1fbZ3qMohjoBhPu47dNoiV9EDQ6X88Xm5DZZHh8vxS").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ ipfsHash: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h3>Welcome to Ethereum Publish</h3>
        <p>Author Name :- {this.state.ipfsHash}</p>
            <Document
              file={"http://localhost:8080/ipfs/"+this.state.ipfsHash}
              onLoadSuccess={this.onDocumentLoadSuccess}>
                {Array.from(
                          new Array(this.state.numPages),
                          (el, index) => (
                            <Page
                              key={`page_${index + 1}`}
                              pageNumber={index + 1}
                            />
                          ),
                        )}              
            </Document>
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.captureFile} />
          <input type="submit" />
        </form>    
        </div>
    );
  }
}

export default App;
