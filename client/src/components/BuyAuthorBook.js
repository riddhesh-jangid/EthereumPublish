import React, { Component } from "react";
import { Link } from 'react-router-dom';

class BuyAuthorBook extends Component{
    constructor(props){ 
        super(props);
        this.state = {
            contract: props.contract,
            web3: props.web3,
            currentAddress: props.currentAddress, 
            balance: props.balance,
            bookArray: []
        }       
        this.state.authorName = props.location.state.authorName.names;
        console.log("Author Name: ",this.state.authorName);
        console.log("Acccount status:  ",props.accountStatus);
        if(props.accountStatus=="Reader" || props.accountStatus=="both"){}
        else{
            props.history.push('/');
        }
        this.buyBook = this.buyBook.bind(this);
    }

    async componentWillMount(){
        try {
            const totalBook = await this.state.contract.methods.getAllAuthorBooksByName(this.state.authorName).call({from: this.state.currentAddress});
            var books="";
            var bookArray=[];
            for(var i=0; i<totalBook; i++){
                books = await this.state.contract.methods.getAuthorBookById(this.state.authorName,i).call({from: this.state.currentAddress});
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
    

    buyBook = async (bookName,id,hash,rate) =>{
        const result1 = await this.state.contract.methods.buyBookById1(this.state.authorName).send({from: this.state.currentAddress,value: (rate*1000000000000000000)}); 
        const result2 = await this.state.contract.methods.buyBookById2(this.state.authorName,id,bookName,hash).send({from: this.state.currentAddress}); 
        this.props.history.push('/');
    }


    render(){
        return(
            <div className="container h-100 text-center authorProfilePage">
                <h3 className="mt-2">ETHEREUM PUBLISH</h3>
                <hr/>
                <div className="buyBookList">
                    <h4>Book List</h4>
                    <hr/>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Book ID</th>
                                <th>Book Name</th>
                                <th>Book Rate</th>
                                <th>Total Sold</th>
                                <th>
                                    Buy
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.bookArray.map((book, id) => (
                                <tr>
                                    <td>{id}</td>
                                    <td>{book._bookName}</td>
                                    <td>{book._rate}</td>
                                    <td>{book._soldCount}</td>
                                    <td>
                                        <button className="btn btn-success" onClick={e => {
                                            this.buyBook(book._bookName,id,book._hash,book._rate)
                                        }}>Buy</button>
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

export default BuyAuthorBook;