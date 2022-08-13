import React, {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [searchText, setSearchText] = useState("");
    const [playerData, setPlayerData] = useState({});
    const API_KEY = "RGAPI-f720f147-b0aa-433d-9830-bd83ab687e82";
    
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
            <h5>League Of Legends</h5>
            <input type={'text'} onChange={ e => setSearchText(e.target.value)}></input>
            <button onClick={e => searchForPlayer(e)}>Search</button>
        </div>
        {JSON.stringify(playerData) != '{}' ? 
        <>
            <p>{playerData.name}</p>
            <p>Summoner Level {playerData.summonerLevel}</p>
            <img width="200px" height="200px" src={"http://ddragon.leagueoflegends.com/cdn/12.15.1/img/profileicon/" + playerData.profileIconId +".png"}></img>
        </> 
        : 
        <><p>No Player Data</p></>
        }
    </div>
    );
}

export default App;