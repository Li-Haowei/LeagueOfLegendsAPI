import React, {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [LoLCurrentVersion, setLoLCurrentVersion] = useState("12.14.1");
    const [searchText, setSearchText] = useState("");
    const [playerData, setPlayerData] = useState({});
    const [myChampionsData, setMyChampionsData] = useState({});
    const [allChampionsData, setAllChampionsData] = useState([]);
    const [myChampsToChampsPool, bindMyChampsToChampsPool] = useState({});
    const API_KEY = process.env.REACT_APP_API_KEY;
    axios.get("https://ddragon.leagueoflegends.com/api/versions.json").then(
        function(response){
            setLoLCurrentVersion(response.data[0]);
        })
    var champs = [];

    function searchForPlayer(event){
        console.log("search for player...")
        //Set up the correct API call
            return new Promise(function(resolve){
                return new Promise(function(resolve){
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
        console.log("search for champion pool...")
        var result = {};
        return new Promise(function(resolve){
            return new Promise(function(resolve){
                var ChampionCallString = 
                        "https://na1.api.riotgames.com" + 
                        "/lol/champion-mastery/v4/champion-masteries/by-summoner/" + 
                        data.id + 
                        "?api_key=" + 
                        API_KEY
                axios.get(ChampionCallString).then(function (response){
                            //Success
                            setMyChampionsData(response.data)
                            for(var i in response.data){
                                result[response.data[i]["championId"]] = response.data[i]
                            }
                            bindMyChampsToChampsPool(result)
                            searchForChampionsPool(result)
                            //console.log(result)
                        }).catch(function (error){
                            //Error
                            console.log(error)
                        })
                    }, 1000);
                });     
    }
    function searchForChampionsPool(myChamps){
        setTimeout(function(){
             fetch('http://ddragon.leagueoflegends.com/cdn/' 
             + LoLCurrentVersion + '/data/en_US/champion.json').then((response) => response.json())
                                    .then((responseJson) => {
                                        var champPool = document.getElementById('champ_pool');
                                        champPool.innerHTML = "";
                                        var result = [];
                                        for(var i in responseJson.data){
                                            if(myChamps[responseJson.data[i]['key']]==undefined) continue;
                                            /*champPool.innerHTML += 
                                            "<p>"
                                            + responseJson.data[i]['id']
                                            + "</p>"
                                            +"<img src='"
                                            +"http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/"
                                            +responseJson.data[i]['image']['full']
                                            +"'>"+"</img>"
                                            +"<p>"
                                            + myChamps[responseJson.data[i]['key']]['championPoints']
                                            + "</p>"*/
                                            result.push([i, responseJson.data[i],myChamps[responseJson.data[i]['key']]])
                                        }
                                        //console.log(responseJson.data[i])
                                        //console.log(myChamps[responseJson.data[i]['key']])
                                        setAllChampionsData(result)
                                        console.log(result)
                                    })
                                }, 1000);
    }
    //console.log(allChampionsData)
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
        {JSON.stringify(myChampionsData) != '{}' ? 
            <>  
            <div className='champs'>
                <h3>Number of Champion played: {myChampionsData.length}</h3>
                <div id='champ_pool'>
                </div>
            </div>
            </> 
            : 
            <><p>No Player Data</p></>
            }
        </div>
    </div>
    );
}

export default App;