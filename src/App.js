import React, {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [searchText, setSearchText] = useState("");
    const [playerData, setPlayerData] = useState({});
    const API_KEY = "";
    
    function searchForPlayer(event){
        //Set up the correct API call
        var APICallString = "https://na1.api.riotgames.com" + "/lol/summoner/v4/summoners/by-name/" + searchText + "?api_key=" + API_KEY
        //handle API call
        axios.get(APICallString).then(function (response){
            //Success
            setPlayerData(response.data)
        }).catch(function (error){
            //Error
            console.log(error)
        })
    }
    //console.log(playerData)
    return ( 
    <div className = "App" >
        <div className = "container">
            <img width="500px" height="200px" src='/lol.png'></img> 
            <br></br>
            <input type={'text'} onChange={ e => setSearchText(e.target.value)}></input>
            <button onClick={e => searchForPlayer(e)}>Search</button>
        </div>
        {JSON.stringify(playerData) != '{}' ? 
        <>
            <h3>{playerData.name}</h3>
            <h5>Summoner Level {playerData.summonerLevel}</h5>
            <img width="200px" height="200px" src={"http://ddragon.leagueoflegends.com/cdn/12.15.1/img/profileicon/" + playerData.profileIconId +".png"}></img>
        </> 
        : 
        <><p>No Player Data</p></>
        }
    </div>
    );
}

export default App;