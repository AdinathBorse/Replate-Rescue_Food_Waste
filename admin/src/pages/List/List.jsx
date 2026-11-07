import  { useEffect } from 'react'
import './List.css'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const List = ({url, token}) => {

 // const url = "http://localhost:4000";
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await  axios.get(`${url}/api/food/myfoods`, { headers: { token } }) 
    
    if (response.data.success) {
      setList(response.data.data);
    }
    else{
      toast.error("Could not fetch food list");
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {id: foodId}, { headers: { token } })
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    }
    else{
      toast.error("Could not remove food item");
    }
  }

  useEffect(()=>{
    fetchList();
  },[])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item,index)=>{
          return(
            <div key={index} className="list-table-format">
              <img src={`${url}/images/`+item.image} alt="" />
              <div>
                <p style={{fontWeight: item.isMysteryBag ? "600" : "normal"}}>{item.name}</p>
                {item.isMysteryBag && (
                  <span style={{fontSize: "11px", color: "#059669", background: "#ecfdf5", padding: "2px 6px", borderRadius: "4px", display: "inline-block", marginTop: "2px", border: "1px solid #a7f3d0"}}>
                    Mystery Bag ({item.dietaryType})
                  </span>
                )}
              </div>
              <p>{item.category}</p>
              <p>
                ₹{item.price}
                {item.originalPrice > item.price && (
                  <span style={{fontSize: "12px", color: "#94a3b8", textDecoration: "line-through", marginLeft: "5px"}}>
                    ₹{item.originalPrice}
                  </span>
                )}
              </p>
              <p onClick={()=>removeFood(item._id)} className='crsr'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
