//Book Class: Represents a book
class Book {
  constructor(title, author, isbn) {
    this.title= title
    this.author = author
    this.isbn = isbn
  }
}


//UI class: Handle UI tasks
class UI {
  static displayBooks(){
  const books = Store.getBooks() //set books to localStorage

  books.forEach((book) => UI.addBookToList(book))
  }
  static addBookToList(book){ //adds predefined books from class above to page
    const list = document.querySelector("#book-list") //list grabbed from DOM
    const row = document.createElement("tr") //create new row

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `


      //append row to the List
      list.appendChild(row)
  }

  static showAlert(message, className){ //creating an alert using bootstrap
    const div = document.createElement("div")
    div.className = `alert alert-${className}`
    div.appendChild(document.createTextNode(message)) //appends something to the div
    const container = document.querySelector('.container')
    const form = document.querySelector('#book-form')
    container.insertBefore(div, form)
    //vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(),
    3000)
  }
  static clearFields() //clear fields after submitting new books
  {
    document.querySelector('#title').value = ''
    document.querySelector('#author').value = ''
    document.querySelector('#isbn').value = ''
  }

  static deleteBook(el){
    if(el.classList.contains("delete")){
      el.parentElement.parentElement.remove()
    }
  }



}

//Store class: handles storage
class Store{
  static getBooks(){
    let books;
    if(localStorage.getItem('books') === null)
    {
      books = []
    }
    else{
      books = JSON.parse(localStorage.getItem('books'))
    }
    return books
  }

  static addBook(book)
  {
    const books = Store.getBooks() //grabbing books from local storage

    books.push(book)

    localStorage.setItem('books', JSON.stringify(books)) //wrap books via string, because books is an object at the moment
  }

  static removeBook(isbn){
    const books = Store.getBooks()

    books.forEach((book, index) => {
      if(book.isbn === isbn){
        books.splice(index, 1)
      }
    });

    localStorage.setItem('books', JSON.stringify(books))

  }

}
//Event: display book
document.addEventListener('DOMContentLoaded', UI.displayBooks)


//Event: Add a book
document.querySelector("#book-form").addEventListener('submit', (e) => {
  //Prevent actual submit
  e.preventDefault()
  //Get from values
  const title = document.querySelector("#title").value
  const author = document.querySelector("#author").value
  const isbn = document.querySelector("#isbn").value

  //Validate
  if(title === '' || author === '' || isbn === ''){
    UI.showAlert('Please fill in all fields', 'danger')
  }
  else{
    //instantiate books
    const book = new Book(title, author, isbn)

    console.log(book)

    //add book to UI
    UI.addBookToList(book)

    //add book to Store
    Store.addBook(book)

    //Show success message
    UI.showAlert('Book Added', 'success')
    //clear fields
    UI.clearFields()
  }

})

//Event: Delete/Remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
  //remove book from UI
  UI.deleteBook(e.target)
  //remove book from storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)//e.target give the link itself clicked
  UI.showAlert('Book Removed', 'success')
})
