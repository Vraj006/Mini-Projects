import { useState } from "react";
import InfoBox from "./InfoBox";
import SearchBox from "./SearchBox";

export default function WeatherApp(){

    const [weatherInfo,setWeatherInfo]=useState({
        city:"Delhi",
        temp:28.05,
        tempMin:28.05,
        tempMax:28.05,
        humidity:83,
        feelsLike: 32.71,
        weather:"Mist"
    });

    let updateinfo=(r)=>{
        setWeatherInfo(r);
    }

    return(
        <>
        <h2>Weather App</h2>
        <SearchBox updateinfo={updateinfo}/>
        <br />
        <InfoBox info={weatherInfo}/>
        </>
    )
}