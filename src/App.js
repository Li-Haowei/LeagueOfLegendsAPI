import React, {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [searchText, setSearchText] = useState("");
    const [playerData, setPlayerData] = useState({});
    const [championData, setChampionData] = useState({});
    const API_KEY = process.env.REACT_APP_API_KEY;

    function searchForPlayer(event){
        //Set up the correct API call
            return new Promise(function(resolve){
                setTimeout(function(){
                    var SummonerCallString = 
                        "https://na1.api.riotgames.com" + 
                        "/lol/summoner/v4/summoners/by-name/" + 
                        searchText + 
                        "?api_key=" + 
                        API_KEY
                    //handle API call
                    axios.get(SummonerCallString).then(function (response){
                        //Success
                        setPlayerData(response.data)
                        resolve(searchForChampions(response.data));
                    }).catch(function (error){
                        //Error
                        console.log(error)
                    })
                }, 1000);
            });
        
    }
    function searchForChampions(data){
        var ChampionCallString = 
                    "https://na1.api.riotgames.com" + 
                    "/lol/champion-mastery/v4/champion-masteries/by-summoner/" + 
                    data.id + 
                    "?api_key=" + 
                    API_KEY
            axios.get(ChampionCallString).then(function (response){
                        //Success
                        setChampionData(response.data)
                    }).catch(function (error){
                        //Error
                        console.log(error)
                    })
    }
    console.log(championData)
    //console.log(playerData)
    return ( 
    <div className = "App">
        <div className='Top'>
            <div className='column'>
            <img width="500px" height="200px" src='/lol.png'></img> 
            <br></br>
            
                <input 
                    id="summonerField" 
                    type={'text'} 
                    onChange={ e => 
                                setSearchText(e.target.value)
                              }
                    onKeyDown={e => 
                                {
                                    if(e.keyCode ===13)
                                    {
                                        searchForPlayer(e.target.value);
                                    }
                                }
                            }
                ></input>
                <button id="summonerSearchBtn" onClick={e => searchForPlayer(e)}>Search</button>
            </div> 
            <div className='column'>
            {JSON.stringify(playerData) != '{}' ? 
            <>
                <h3>{playerData.name}</h3>
                <h5>Summoner Level {playerData.summonerLevel}</h5>
                <img width="200px" 
                    height="200px" 
                    src={"http://ddragon.leagueoflegends.com/cdn/12.15.1/img/profileicon/" 
                    + playerData.profileIconId +".png"}>
                </img>
                
            </> 
            : 
            <><p>No Player Data</p></>
            }
            </div>
        </div>
        <div className='Mid'>
        {JSON.stringify(championData) != '{}' ? 
            <>
                <h3>Total Points: {championData.championPoints}</h3>
                <h5>Summoner Level {playerData.summonerLevel}</h5>
                <img width="200px" 
                    height="200px" 
                    src={"http://ddragon.leagueoflegends.com/cdn/12.15.1/img/profileicon/" 
                    + playerData.profileIconId +".png"}>
                </img>
            </> 
            : 
            <><p>No Player Data</p></>
            }
        </div>
    </div>
    );
}

export default App;