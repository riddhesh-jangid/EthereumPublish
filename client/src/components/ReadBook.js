import React, { Component } from "react";
import { Document, Page, pdfjs } from 'react-pdf';

class ReadBook extends Component{
    constructor(props){
        super(props);
        this.state={
            numPages: null 
        }
        try{
            this.state.hash = props.location.state.hash;
        }
        catch(e){
            props.history.push('/');
        }
    }

    onDocumentLoadSuccess = (document) => {
        const { numPages } = document;
        this.setState({
          numPages,
        });
      };
    
    render(){
        return(
            <div className="h-100">
                <Document
                file={"http://localhost:8080/ipfs/"+this.state.hash}
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
            </div>
        );
    }
}

export default ReadBook;