"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import "./assets/styles.css" 
import Html5QrcodePlugin from "./Html5QrcodePlugin"
export default function Home() { 
  const [inputValue, setInputValue] = useState('')
  const [offerValue, setOfferValue] = useState('')
  const [data, setData] = useState(null) 
  const [decodedText, setDecodedText] = useState('')
  const [profit, setProfit] = useState('')
  const [sortedData, setSortedData] = useState([])
  const [boolArr, setBoolArray] = useState(false)

  useEffect(() => {
    if(data){
      setSortedData(data?.itemSummaries.sort((a, b) => {
        const priceA = parseFloat(a.price.value);
        const priceB = parseFloat(b.price.value);
        return priceB - priceA;
      }));
      setBoolArray(true)
      calculateProfit()
    }
  }, [data]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }    
  const handleOfferChange = (event) => {
    setOfferValue(event.target.value);
  }    

  const onNewScanResult = (decodedText, decodedResult) => {
    // handle decoded results here
    setInputValue(decodedText)
  };

  const handleButtonClick = () => {
    makeApiCall(inputValue)
    
  }
  const calculateProfit = () => {
    let difference = 0
    let formattedNumber = 0
    difference = data?.itemSummaries[0].price.value - offerValue
    formattedNumber = difference.toFixed(2);
    setProfit(formattedNumber)

  }
 
  async function makeApiCall (value) {
    const response = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify({ search: value})
    })
    const fetchedData = await response.json()
    setData(fetchedData)
  }


  return (
  <>
    <div className="center-container">
      <div className="input-container">
        <div className="container2">
          <div className="container3">
            <input
              className="input-field"
              type="number"
              value={offerValue}
              onChange={handleOfferChange}
              placeholder="their offer"> 
            </input>
            <input
              className="input-field"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="enter product name"> 
            </input>
          </div>
          <button className="submit-button" onClick={handleButtonClick}>submit</button>
        </div>
      </div>
      <Html5QrcodePlugin
        fps={10}
        qrbox={250}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
      />
      {boolArr && <p className="p-text">What's being sold right now</p>}
      <div className="card-container">      
        {sortedData?.map(item => (
          <div key={item.itemId} className="card">
            <img src={item.image.imageUrl} alt="Item" />
            <p>{item.price.value} {item.price.currency}</p>
          </div>
        ))}
      </div>
      {profit ? (<p className="p-text">Potential Profit: {profit}</p>
      ) : (<p></p>)}
    </div>
  </>
   
  );
}
