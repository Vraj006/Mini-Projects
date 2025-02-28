import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

export default function SearchBox({updateinfo}) {

    let [city,setCity]=useState("");

    const API_URL="https://api.openweathermap.org/data/2.5/weather";
    const API_KEY="8c17723ad027312c7e2296f1aa5f6c45";

    let getweatherinfo=async()=>{
        let response=await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        let jsonResponse=await response.json();
        let result={
            city:city,
            temp:jsonResponse.main.temp,
            tempMin:jsonResponse.main.temp_min,
            tempMax:jsonResponse.main.temp_max,
            humidity:jsonResponse.main.humidity,
            feelsLike:jsonResponse.main.feels_like,
            weather:jsonResponse.weather[0].description,
        }
        return result;
    }

    let handleChange=(event)=>{
        setCity(event.target.value);
    }

    let handleSubmit=async(event)=>{
        event.preventDefault();
        setCity("");
        let info=await getweatherinfo();
        console.log(info);
        updateinfo(info);
    }

    return (
        <div className="SearchBox">
            <form onSubmit={handleSubmit}>
                <TextField id="city" label="City Name" variant="outlined" value={city} onChange={handleChange} required/>
                <br /><br />
                <Button variant="contained" startIcon={<SearchIcon />} type='submit'>
                    Search
                </Button>
            </form>
        </div>
    )
}