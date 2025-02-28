// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';

// export default function InfoBox({info}) {
//   return (
//     <div className="InfoBox">   
//     <Card sx={{ maxWidth: 345 }}>
//       <CardMedia
//         sx={{ height: 140 }}
//         image="https://images.unsplash.com/photo-1531169174570-84a547a85a59?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHdlYXRoZXJ8ZW58MHx8MHx8fDA%3D"/>
//       <CardContent>
//         <Typography gutterBottom variant="h5" component="div">
//             <b>{info.city}</b>
//         </Typography>
//         <Typography variant="body2" sx={{ color: 'text.secondary' }} component={"span"}>
//             <p>Temperature : {info.temp}&deg;C</p>
//             <p>Humidity : {info.humidity}&deg;C</p>
//             <p>Min Temp : {info.tempMin}&deg;C</p>
//             <p>Max Temp : {info.tempMax}&deg;C</p>
//             <p>The Weather can be described as <i>{info.weather}</i> and feels like {info.feelsLike}&deg;C</p>
//         </Typography>
//       </CardContent>   
//     </Card>
//         </div>
//   );
// }


import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';

export default function InfoBox({ info }) {

  const HOT_URL="https://images.unsplash.com/uploads/14121010130570e22bcdf/e1730efe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdCUyMHdlYXRoZXJ8ZW58MHx8MHx8fDA%3D";
  const COLD_URL="https://images.unsplash.com/photo-1519863436079-8436f74be632?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fENPTEQlMjB3ZWF0aGVyfGVufDB8fDB8fHww";
  const RAIN_URL="https://media.istockphoto.com/id/1257951336/photo/transparent-umbrella-under-rain-against-water-drops-splash-background-rainy-weather-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=sw_CRZcGopaGHDWqtT1M8y64k5uCcq-nro55Bw3YzyQ=";

  // Check if `info` exists and has the necessary data
  if (!info || !info.city) {
    return <div>Loading weather information...</div>; 
  }

  return (
    <div className="InfoBox">
      <Card sx={{ maxWidth: 450 }}>
        <CardMedia
          sx={{ height: 200 }}
          image={info.humidity>80 ?RAIN_URL : (info.temp)>15 ? HOT_URL:COLD_URL}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            <b>{info.city} {info.humidity>80 ? <ThunderstormIcon/> : (info.temp)>15 ? <WbSunnyIcon/> :<AcUnitIcon/>}</b>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.2rem' }} component="span">
            <b><p>Temperature: {info.temp}&deg;C</p></b>
            <b><p>Humidity: {info.humidity}%</p></b>
            <b><p>Min Temp: {info.tempMin}&deg;C</p></b>
            <b><p>Max Temp: {info.tempMax}&deg;C</p></b>
            <p>
              The Weather can be described as <b>{info.weather}</b> and feels like <b>{info.feelsLike}&deg;C</b>
            </p>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
 