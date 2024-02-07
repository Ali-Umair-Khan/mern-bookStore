'use client'
import useSWR from 'swr';
import {useState, useEffect} from 'react';
import './styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
const Read = () => {
    const url ='http://localhost:5000/books';
    // const [books,setBooks]=useState([]);
    const [editingBook, setEditingBook] = useState(null);
    const [bookData, setBookData] = useState({
    title: '',
    author: '',
    publishYear: '',
  });

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData({
      ...bookData,
      [name]: value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Add your logic for handling form submission here
    console.log('Form submitted with data:', bookData);
    try {
        const response = await fetch('http://localhost:5000/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookData),
        });
        mutate();
        setBookData({});
  
        if (response.ok) {
          console.log('Book added successfully!');
          // Add any additional logic for success
        } else {
          console.error('Failed to add book.');
          // Handle error
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };

  
  const handleDelete = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:5000/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      mutate();

      if (response.ok) {
        console.log('Book deleted successfully!');
        // Trigger any additional logic after successful deletion
        onDelete();
      } else {
        console.error('Failed to delete book.');
        // Handle error
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
}

const handleEdit = async (_id) => {
      try {
        const response = await fetch(`http://localhost:5000/books/${_id}`);
        const bookData = await response.json();
        setEditingBook(bookData);
        setBookData(bookData);
        // setEditingPost(postData);
        // setText(postData.content);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching short for editing:", error);
      }
    };
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      const { _id } = editingBook;
      const title = e.target[0].value;
      const author = e.target[1].value;
      const publishYear = e.target[2].value;

      const bookData = { title,author,publishYear };
      // console.log(editingPost);
      // console.log('updated form data is', postData);
      // console.log('id is ', _id);
      try {
        await fetch(`http://localhost:5000/books/${_id}`, {
          method: "PUT",  
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        });
        mutate();
        // data && console.log('updated data is',data);
        setEditingBook(null);
        // setText('');
        setBookData({});
        e.target.reset();
      } catch (error) {
        console.error("Error updating short:", error.message);
      }
    };


// const handleUpdate = async (bookId) => {
//     const document = data.data[bookId];

//     try {
//       const response = await fetch(`http://localhost:5000/books/${bookId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(bookData),
//       });

//       if (response.ok) {
//         console.log('Book deleted successfully!');
//         // Trigger any additional logic after successful deletion
//         onDelete();
//       } else {
//         console.error('Failed to delete book.');
//         // Handle error
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       // Handle error
//     }
// }



  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading, isValidating, mutate, revalidate } = useSWR('http://localhost:5000/books',fetcher);

  useEffect(()=>{
    if(error) console.log(error);

  },[error])

  let len = data ? data.data.length : 0;
  if(len) console.log(data);

  const SubmitForm = ({handleSubmit}) =>{
    return(
    <form onSubmit={handleSubmit}>
      <label>
        <input
          type="text"
          placeholder="title"
          name="title"
          value={bookData.title}
          onChange={handleInputChange}
        />
      </label>

      <label>
        <input
          type="text"
          placeholder='author'
          name="author"
          value={bookData.author}
          onChange={handleInputChange}
        />
      </label>

      <label>
        <input
          type="text"
          placeholder="Publish Year"
          name="publishYear"
          value={bookData.publishYear}
          onChange={handleInputChange}
        />
      </label>

      <button type="submit">Submit</button>
</form>
)
}

const EditForm = ({handleUpdate}) =>{
  return(
  <form onSubmit={handleUpdate}>
    <label>
      <input
        type="text"
        placeholder="title"
        name="title"
        value={bookData.title}
        onChange={handleInputChange}
      />
    </label>

    <label>
      <input
        type="text"
        placeholder='author'
        name="author"
        value={bookData.author}
        onChange={handleInputChange}
      />
    </label>

    <label>
      <input
        type="text"
        placeholder="Publish Year"
        name="publishYear"
        value={bookData.publishYear}
        onChange={handleInputChange}
      />
    </label>

    <button type="submit">Edit/Submit</button>
</form>
)
}



const BookList = ({data,handleDelete,handleEdit}) => {
  return(
  <table>
    <thead>
        <tr className='book_details'>
          <th>title</th>
          <th>author</th>
          <th>publish year</th>
          <th>update</th>
          <th>delete</th>
        </tr>
    </thead>
      <tbody>
            {data && data.data.map(d=>(
                <tr key={d._id} className='book_details'>
                    <td>{d.title}</td>
                    <td>{d.author}</td>
                    <td>{d.publishYear}</td>
                    <td><Link href='/'> <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(d._id)}/></Link></td>
                    <td><Link href='/'> <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(d._id)}/></Link></td>
                </tr>
            ))}
      </tbody>
    
</table>
)
}

return(
<section className='bookStore'>
<h2>Add books</h2>
{/* <main className="main">
          {isLoading ? (
              <div style={centerDiv}><p>Loading...</p></div>
          ) : (
          <div className='main__col'>
            <div className="main__col-left">{Booklist({ data, handleDelete})}</div>
            {!editingPost ? <div className='main__col-right'>{SubmitForm({handleSubmit})}</div>
            : <div className='main__col-right'>{editingPost && EditForm({editingPost, handleUpdate})}</div>
            }
          </div> 
          )}      
          <button onClick={()=>window.scrollTo(0,0)} className='btn-top'>Go To Top</button>  
</main> */}
<main>
  {!editingBook ? <div>{SubmitForm({handleSubmit})}</div> 
  : <div>{EditForm({handleUpdate})}</div>
  }
  <div>{BookList({ data, handleDelete, handleEdit})}</div>
</main>
</section>
)
    
}

export default Read