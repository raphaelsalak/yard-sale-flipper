"use client"
import Image from "next/image";
import { useState } from "react";
import "./assets/styles.css" 
export default function Home() { 
  const [inputValue, setInputValue] = useState('')
  const [data, setData] = useState(null) 
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }
  const handleButtonClick = () => {
    makeApiCall(inputValue)

  }
 
  const makeApiCall = async (value) => {
    const response = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify({ search: value})
    })
    const fetchedData = await response.json()
    setData(fetchedData)
  }
  const sortedData = data?.itemSummaries.sort((a, b) => {
    const priceA = parseFloat(a.price.value);
    const priceB = parseFloat(b.price.value);
    return priceB - priceA;
  });
  return (
    <>
    <div className="center-container">
      <div className="card-container">
        <input
        className="input-field"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="enter product name"> 
        </input>
        <button className="submit-button" onClick={handleButtonClick}>submit</button>
      </div>
      <div className="card-container">      
        {sortedData?.map(item => (
          <div key={item.itemId} className="card">
            <img src={item.image.imageUrl} alt="Item" />
            <p>{item.price.value} {item.price.currency}</p>
          </div>
      ))}
      </div>
    </div>
    </>
   
  );
}
