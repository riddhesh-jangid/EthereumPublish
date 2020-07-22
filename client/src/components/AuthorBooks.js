import React, { Component } from "react";

class AuthorBooks extends Component{
    constructor(props){ 
        super(props);
        this.state = {
            contract: props.contract,
            web3: props.web3,
            currentAddress: props.currentAddress, 
            balance: props.balance,
            bookArray: []
        }       
        this.state.authorName = props.location.state.authorName;
        console.log("Author Name: ",this.state.authorName);
        console.log("Acccount status:  ",props.accountStatus);
        if(props.accountStatus=="Author" || props.accountStatus=="both"){}
        else{
            props.history.push('/');
        }
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
                                <th>Book Rate</th>
                                <th>Total Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.bookArray.map((book, id) => (
                                <tr>
                                    <td>{id}</td>
                                    <td>{book._bookName}</td>
                                    <td>{book._rate}</td>
                                    <td>{book._soldCount}</td>
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

export default AuthorBooks;