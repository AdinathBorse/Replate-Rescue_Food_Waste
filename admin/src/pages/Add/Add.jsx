import React from 'react'
import './Add.css'
import { assets } from '../../../../food-app/src/assets/assets'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';





const Add = ({url, token}) => {

  const [Image, setImage] = useState(null);
  const [isMysteryBag, setIsMysteryBag] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    originalPrice: "",
    dietaryType: "Veg",
    stock: 5,
    startTime: "09:00 PM",
    endTime: "11:45 PM"
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', Image);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('price', Number(data.price));
    formData.append('isMysteryBag', isMysteryBag);

    if (isMysteryBag) {
      formData.append('originalPrice', Number(data.originalPrice || 0));
      formData.append('dietaryType', data.dietaryType);
      formData.append('stock', Number(data.stock || 5));
      formData.append('startTime', data.startTime || "09:00 PM");
      formData.append('endTime', data.endTime || "11:45 PM");
    }

    const response = await axios.post(`${url}/api/food/add`, formData,{ headers: { token } });
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        originalPrice: "",
        dietaryType: "Veg",
        stock: 5,
        startTime: "09:00 PM",
        endTime: "11:45 PM"
      })
      setIsMysteryBag(false);
      setImage(false)
      toast.success(response.data.message);
    }
    else {
      toast.error(response.data.message);
    }
  }

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upld flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={Image ? URL.createObjectURL(Image) : assets.upload_area} alt="upload preview" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} accept="image/*" type="file" id="image" hidden required />
        </div>

        {/* Mystery Bag Toggle Checkbox */}
        <div className="add-mystery-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={isMysteryBag}
              onChange={(e) => setIsMysteryBag(e.target.checked)}
            />
            <span> List as <strong>Mystery Surplus Bag</strong> (Anti-Food Waste Deal)</span>
          </label>
        </div>

        <div className="add-product-name flex-col">
          <p>{isMysteryBag ? "Mystery Bag Name" : "Product Name"}</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name='name'
            placeholder={isMysteryBag ? "Enter mystery bag name" : "Enter product name"}
            required
          />
        </div>

        <div className="add-product-desc flex-col">
          <p>Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="5"
            placeholder={isMysteryBag ? "Describe the mystery bag experience" : "Write content here"}
            required
          ></textarea>
        </div>

        {/* Mystery Bag Specific Fields */}
        {isMysteryBag && (
          <div className="mystery-fields-box">
            <div className="mystery-row">
              <div className="flex-col">
                <p>Dietary Type</p>
                <select onChange={onChangeHandler} name="dietaryType" value={data.dietaryType}>
                  <option value="Veg"> Pure Veg</option>
                  <option value="Non-Veg"> Non-Veg</option>
                  <option value="Bakery"> Bakery / Dessert</option>
                </select>
              </div>

              <div className="flex-col">
                <p>Original Value (₹)</p>
                <input
                  onChange={onChangeHandler}
                  value={data.originalPrice}
                  type="number"
                  name='originalPrice'
                  placeholder='e.g., 750'
                  required={isMysteryBag}
                />
              </div>

              <div className="flex-col">
                <p>Available Tonight (Stock)</p>
                <input
                  onChange={onChangeHandler}
                  value={data.stock}
                  type="number"
                  name='stock'
                  placeholder='e.g., 5'
                />
              </div>
            </div>

            <div className="mystery-row" style={{ marginTop: '12px' }}>
              <div className="flex-col">
                <p>Active Start Time (Indian Time)</p>
                <select onChange={onChangeHandler} name="startTime" value={data.startTime}>
                  <option value="09:00 PM">09:00 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="08:30 PM">08:30 PM</option>
                  <option value="09:30 PM">09:30 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                  <option value="10:30 PM">10:30 PM</option>
                  <option value="11:00 PM">11:00 PM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                  <option value="07:30 PM">07:30 PM</option>
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                </select>
              </div>

              <div className="flex-col">
                <p>Active End Time (Indian Time)</p>
                <select onChange={onChangeHandler} name="endTime" value={data.endTime}>
                  <option value="11:45 PM">11:45 PM</option>
                  <option value="09:30 PM">09:30 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                  <option value="10:30 PM">10:30 PM</option>
                  <option value="11:00 PM">11:00 PM</option>
                  <option value="11:30 PM">11:30 PM</option>
                  <option value="12:00 AM">12:00 AM</option>
                  <option value="12:30 AM">12:30 AM</option>
                  <option value="01:00 AM">01:00 AM</option>
                  <option value="02:00 AM">02:00 AM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="add-category-price">
          <div className="add-product-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure veg">Pure veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>{isMysteryBag ? "Discounted Offer Price (₹)" : "Product Price"}</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name='price'
              placeholder={isMysteryBag ? "e.g., 199" : "₹150"}
              required
            />
          </div>
        </div>
        <button type='submit' className='add-button'>{isMysteryBag ? "ADD SURPLUS BAG" : "ADD"}</button>
      </form>
    </div>
  )
}

export default Add
