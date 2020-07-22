pragma solidity 0.5.16;


contract Publisher{

    mapping(address=>Author) private authorsLookup;
    mapping(string=>address) private findAuthorAddress;
    mapping(address=>string) private findAuthorName;
    string[] public allAuthorName;
    address[] public allAuthorAddress;

    mapping(address=>Buyer) private buyersLookup;
    mapping(string=>address) private findBuyerAddress;
    mapping(address=>string) private findBuyerName;
    string[] public allBuyerName;
    address[] public allBuyerAddress;

    //modifier to check if given author name is already exist
    modifier checkExistAuthorName(string memory _authorName){
        bool _status = false;
        uint len = allAuthorName.length;
        for(uint i=0 ; i<len ; i++){
            if(keccak256(abi.encodePacked(allAuthorName[i])) == keccak256(abi.encodePacked(_authorName))){
                _status = true;
            }
        }
        require(_status == false, "This Author name is already registered...Please choose other name :0");
        _;
    }

    //modifier to check if given Reader name is already exist
    modifier checkExistBuyerName(string memory _buyerName){
        bool _status = false;
        uint len = allBuyerName.length;
        for(uint i=0 ; i<len ; i++){
            if(keccak256(abi.encodePacked(allBuyerName[i])) == keccak256(abi.encodePacked(_buyerName))){
                _status = true;
            }
        }
        require(_status == false, "This Reader name is already registered...Please choose other name :0");
        _;
    }


    function registerAuthor(string memory _authorName) checkExistAuthorName(_authorName) public {
       Author author = new Author(_authorName); 
       authorsLookup[msg.sender] = author;
       findAuthorAddress[_authorName] = msg.sender;
       findAuthorName[msg.sender] = _authorName;
       author.setAuthorAddress(msg.sender);
       allAuthorAddress.push(msg.sender);
       allAuthorName.push(_authorName);
    }
    
    function registerBuyer(string memory _buyerName) checkExistBuyerName(_buyerName) public {
        Buyer buyer = new Buyer(_buyerName);
        buyersLookup[msg.sender] = buyer;
        findBuyerAddress[_buyerName] = msg.sender;
        findBuyerName[msg.sender] = _buyerName;
        allBuyerAddress.push(msg.sender);
        allBuyerName.push(_buyerName);
    }
    
    function checkExistenceOfAuthor() public view returns(bool _status){
        _status = false;
        uint len = allAuthorAddress.length;
        for(uint i=0 ; i<len ; i++){
            if(allAuthorAddress[i]==msg.sender){
                _status = true;
            }
        }
    }
    
    function checkExistenceOfBuyer() public view returns(bool _status){
        _status = false;
        uint len = allBuyerAddress.length;
        for(uint i=0 ; i<len ; i++){
            if(allBuyerAddress[i]==msg.sender){
                _status = true;
            }
        }
    }
    
    function registerBook(string memory _bookName,uint _rate,string memory _hash)  public{
        authorsLookup[msg.sender].registerBook(_bookName,_rate,_hash);        
    }
    
    function getAllAuthorBooks() public view returns(uint _totalBooks){
        _totalBooks = authorsLookup[msg.sender].getAllAuthorBooks();
    }

    function getAllAuthorBooksByName(string memory _authorName) public view returns(uint _totalBooks){
        _totalBooks = authorsLookup[findAuthorAddress[_authorName]].getAllAuthorBooks();
    }


    function getAuthorBookById(string memory _authorName, uint id) public view returns(string memory _bookName,uint _rate,uint _soldCount,string memory _hash){
        (_bookName,_rate,_soldCount,_hash) = authorsLookup[findAuthorAddress[_authorName]].getAuthorBookById(id);
    }
    
    function buyBookById1(string memory _authorName) public payable{
        address(uint160(findAuthorAddress[_authorName])).transfer(msg.value);
    }

    function buyBookById2(string memory _authorName,uint _id,string memory _bookName,string memory _hash) public{
        authorsLookup[findAuthorAddress[_authorName]].buyBookById(_id);
        buyersLookup[msg.sender].buyBook(_authorName,_bookName,_hash);
    }
    
    function getAllBuyerBook() public view returns(uint _totalBooks){
        _totalBooks = buyersLookup[msg.sender].getAllBuyerBook();
    }

    function getAllBuyerBookByName(string memory _buyerName) public view returns(uint _totalBooks){
        _totalBooks = buyersLookup[findBuyerAddress[_buyerName]].getAllBuyerBook();
    }


    function getBuyerBookById(uint _id) public view returns(string memory _authorName,string memory _bookName,string memory _hash){
        (_authorName,_bookName,_hash) = buyersLookup[msg.sender].getBuyerBookById(_id); 
    }
    
    function getBuyerName() public view returns(string memory _buyerName){
        _buyerName = buyersLookup[msg.sender].getBuyerName();
    }
    
    function getAuthorName() public view returns(string memory _authorName){
        _authorName = authorsLookup[msg.sender].getAuthorName();
    }

    function getAuthorNameById(uint _id) public view returns(string memory _authorName){
        _authorName = allAuthorName[_id];
    }

    function getReaderNameById(uint _id) public view returns(string memory _buyerName){
        _buyerName = allBuyerName[_id];
    }

    function totalAuthor() public view returns(uint _totalAuthor){
        _totalAuthor = allAuthorAddress.length;
    }

    function totalReader() public view returns(uint _totalBuyer){
        _totalBuyer = allBuyerAddress.length;
    }

}

contract Buyer{
    struct Book{
        string authorName;
        string bookName;
        string bookHash;
    }
    
    Book[] public books;
    
    string public buyerName;
    
    constructor(string memory _buyerName) public{
        buyerName = _buyerName;
    }
    
    function getBuyerName() public view returns(string memory _buyerName){
        _buyerName = buyerName;
    }
    
    function buyBook(string memory _authorName,string memory _bookName,string memory _hash) public{
        books.push(Book(_authorName,_bookName,_hash));
    }
    
    function getBuyerBookById(uint _id) public view returns(string memory _authorName,string memory _bookName,string memory _hash){
        _authorName = books[_id].authorName;
        _bookName = books[_id].bookName;
        _hash = books[_id].bookHash;
    }

    function getAllBuyerBook() public view returns(uint _totalBooks){
        _totalBooks = books.length;
    }
}

contract Author{
    
    struct Book{
        string name;
        uint rate;
        uint soldCount;
        string bookHash;
    }
    
    Book[] public books;

    string authorName;

    address authorContractAddress;

    address payable authorAddress;

    constructor(string memory _authorName) public{
        authorName = _authorName;
        authorContractAddress = address(this);
    }

    function setAuthorAddress(address payable _address) public{
        authorAddress = _address;
    }

    function getAuthorContractAddress() public view returns(address _address){
        _address = authorContractAddress;
    }
    
    function getAuthorName() public view returns(string memory _authorName){
        _authorName = authorName;
    }

    function buyBookById(uint _id) public{
        books[_id].soldCount++;
    }
    
    function registerBook(string memory _bookName, uint _rate,string memory _hash) public{
        books.push(Book(_bookName,_rate,0,_hash));
    }
    
    function getAuthorBookById(uint _id) public view returns(string memory _bookName,uint _rate,uint _soldCount,string memory _hash){
        _bookName = books[_id].name;
        _rate = books[_id].rate;
        _soldCount = books[_id].soldCount;
        _hash = books[_id].bookHash;
    }
    
    function getAllAuthorBooks() public view returns(uint _totalBooks){
        _totalBooks = books.length;
    }
}

