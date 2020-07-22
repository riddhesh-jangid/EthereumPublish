import React, { Component } from "react";

class ReaderBooks extends Component{
    constructor(props){ 
        super(props);
        this.state = {
            contract: props.contract,
            web3: props.web3,
            currentAddress: props.currentAddress, 
            balance: props.balance,
            bookArray: []
        }       
        this.state.readerName = props.location.state.readerName;
        this.readBook = this.readBook.bind(this);
        console.log("Reader Name: ",this.state.readerName);
        console.log("Acccount status:  ",props.accountStatus);
        if(props.accountStatus=="Reader" || props.accountStatus=="both"){}
        else{
            props.history.push('/');
        }
    }

    async componentWillMount(){
        try {                                                  
            const totalBook = await this.state.contract.methods.getAllBuyerBookByName(this.state.readerName).call({from: this.state.currentAddress});
            var books="";
            var bookArray=[];
            for(var i=0; i<totalBook; i++){
                books = await this.state.contract.methods.getBuyerBookById(i).call({from: this.state.currentAddress});
                console.log("Book ID "+i+books._bookName);
                bookArray.push(books);
            }
            this.setState({
                bookArray: bookArray
            });
        } 
        catch (e) {
            console.error(e);
            this.props.history.push("/Error");
        } finally {
            console.log('Executed');
        }
    }

    readBook = (hash) =>{
        console.log("Hash: ",hash);
        this.props.history.push({
            pathname: "/ReadBook",
            state: {
                hash: hash  
            }
        });
        
    }

    render(){
        return(            
            <div className="container h-100 text-center authorProfilePage">
                <h3 className="mt-2">ETHEREUM PUBLISH</h3>
                <hr/>
                <div className="buyBookList">
                    <h4>Book List</h4>
                    <hr/>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Book ID</th>
                                <th>Book Name</th>
                                <th>Read</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.bookArray.map((book, id) => (
                                <tr>
                                    <td>{id}</td>
                                    <td>{book._bookName}</td>
                                    <td>
                                        <button className="btn btn-success" onClick={e => {
                                            this.readBook(book._hash)
                                        }}>Read</button>
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

export default ReaderBooks;