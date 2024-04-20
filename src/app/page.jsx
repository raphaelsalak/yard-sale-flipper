"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import "./assets/styles.css";
import Html5QrcodePlugin from "./Html5QrcodePlugin";

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [offerValue, setOfferValue] = useState('');
  const [data, setData] = useState(null);
  const [decodedText, setDecodedText] = useState('');
  const [profit, setProfit] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [boolArr, setBoolSortedArray] = useState(false);
  const [scanError, setScanError] = useState(false);

  useEffect(() => {
    if (data && data.itemSummaries && data.itemSummaries.length > 0) {
      const sorted = data.itemSummaries.sort((a, b) => {
        const priceA = parseFloat(a.price.value);
        const priceB = parseFloat(b.price.value);
        return priceB - priceA;
      });
      setSortedData(sorted);
      setBoolSortedArray(true);
      calculateProfit();
    }
  }, [data]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleOfferChange = (event) => {
    setOfferValue(event.target.value);
  };

  const onNewScanResult = (decodedText, decodedResult) => {
    if (decodedText) {
      setInputValue(decodedText);
    }
  };

  const handleButtonClick = () => {
    makeApiCall(inputValue);
  };

  const calculateProfit = () => {
    if (data && data.itemSummaries && data.itemSummaries.length > 0) {
      const difference = data.itemSummaries[0].price.value - offerValue;
      const formattedNumber = difference.toFixed(2);
      setProfit(formattedNumber);
    }
  };

  async function makeApiCall(value) {
    try {
      const response = await fetch('/api', {
        method: 'POST',
        body: JSON.stringify({ search: value })
      });
      if (response.ok) {
        const fetchedData = await response.json()
        setData(fetchedData)
        //check if it's empty
        if(fetchedData.itemSummaries.length > 0){
          setScanError(false)
        }
        else{
          setScanError(true)
        }
      }
    
    } catch (error) {
      console.error('Error fetching data:', error);
      setScanError(true)
      // Handle error appropriately, e.g., show a notification to the user
    }
  }

  return (
<>
  <div className="center-container">
    <h1 className="my-3 text-3xl font-bold text-center text-blue-600">Yard Sale Flipper</h1>
    <div className="input-container">
      <div className="container2">
        <div className="container3">
          <input
            className="input-field"
            type="number"
            value={offerValue}
            onChange={handleOfferChange}
            placeholder="their offer"
          />
          <input
            className="input-field"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="enter product name"
          />
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
    {!scanError && boolArr && <p className="p-text text-xs">Products in listing: </p>}
    {scanError && <p className="error-message">Could not find QR code. Please scan again.</p>}
    <div className="overflow-auto max-h-screen px-4"> {/* Add padding */}
      {!scanError && (
        <div className="grid grid-cols-1 gap-4">
          {sortedData.map((item, index) => (
            <div key={item.itemId} className={`card ${index === 0 ? 'first-card' : ''}`}>
              <img src={item.image.imageUrl} alt="Item" className="w-full h-auto" />
              <p>{item.price.value} {item.price.currency}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    {!scanError && profit && <p className="p-text text-xs">Potential Profit: {profit}</p>}
  </div>
</>




  );
}
