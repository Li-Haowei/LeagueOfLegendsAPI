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

    const [tanks, setTanks] = useState([]);
    const [mages, setMages] = useState([]);
    const [fighters, setFighters] = useState([]);
    const [marksmen, setMarksmen] = useState([]);
    const [supports, setSupports] = useState([]);
    const [assasins, setAssasins] = useState([]);
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
                                        var result = [];
                                        for(var i in responseJson.data){
                                            if(myChamps[responseJson.data[i]['key']]==undefined) continue;
                                            result.push(
                                                [i, 
                                                "http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/"+responseJson.data[i]['image']['full'], 
                                                responseJson.data[i],
                                                myChamps[responseJson.data[i]['key']]])
                                        }
                                        //console.log(responseJson.data[i])
                                        //console.log(myChamps[responseJson.data[i]['key']])
                                        setAllChampionsData(result)
                                        sortChampsByCat(result)
                                    })
                                }, 0);
    }
    
    function sortChampsByCat(data){
        var listOfFighters = [];
        var listOfTanks = [];
        var listOfMarksmen = [];
        var listOfSupports = [];
        var listOfMages = [];
        var listOfAssasins = [];
        for (let index = 0; index < data.length; index++) {
            const champion = data[index];
            //console.log(champion[2]['tags'])
            for (let j = 0; j < champion[2]['tags'].length; j++) {
                switch (champion[2]['tags'][j]) {
                    case 'Fighter':
                        listOfFighters.push(champion)
                        break;
                    case 'Tank':
                        listOfTanks.push(champion)
                        break;
                    case 'Marksman':
                        listOfMarksmen.push(champion)
                        break;
                    case 'Mage':
                        listOfMages.push(champion)
                        break;
                    case 'Support':
                        listOfSupports.push(champion)
                        break; 
                    case 'Assassin':
                        listOfAssasins.push(champion)
                        break; 
                    default:
                        break;
                }
            }
        }
        //console.log(listOfTanks)
        const allLists = [listOfFighters,listOfTanks,listOfMarksmen,listOfMages,listOfSupports,listOfAssasins]
        for (let index = 0; index < allLists.length; index++) {
            allLists[index] = sortByChampionLevels(allLists[index])
        }
        createChampionPoolView(allLists)
    }
    /*Sort champion list by their levels and mastery*/
    function sortByChampionLevels(list){
        list.sort(function(a,b){
            return b[3]['championLevel']-a[3]['championLevel'] 
        });
        var newList = {1:[],2:[],3:[],4:[],5:[],6:[],7:[]};
        for (let i = 0; i < list.length; i++) {
            const champ = list[i];
            newList[champ[3]['championLevel']].push(champ);
        }
        for (let index = 1; index <= 7; index++) {
            newList[index].sort(function(a,b){
                return b[3]['championPoints']-a[3]['championPoints'] 
            }); 
        }
        //console.log(newList)
        return newList;
    }
    function createChampionPoolView(list){
        var champPool = document.getElementById('champ_pool');
        champPool.innerHTML = "";
        for (let index = 0; index < list.length; index++) {
            var result = ""
            var title = ""
            switch (index) {
                case 0:
                    title = "FIGHTER"
                    break;
                case 1:
                    title = "TANK"
                    break;
                case 2:
                    title = "MASKSMAN"
                    break;
                case 3:
                    title = "MAGE"
                    break;
                case 4:
                    title = "SUPPORT"
                    break;
                case 5:
                    title = "ASSASSIN"
                    break;
                default:
                    break;
            }
            result += "<div className='category'>"
            result += "<h2>"
                                + title
                                + "</h2>"
            const masteryList = list[index];
            for (let mastery = 7; mastery >= 1; mastery--) {
                result += "<img width='100px' height='100px' src='"
                                    +"/m"+mastery+".png'></img>"
                const championsList = masteryList[mastery];
                //console.log(championsList)
                for (let i = 0; i < championsList.length; i++) {
                    const champ = championsList[i];
                    result +=           "<div className='champ_plate'>"
                                        +"<p>"
                                        + champ[0]
                                        + "</p>"
                                        +"<img src='"
                                        + champ[1]
                                        +"'>"+"</img>"
                                        +"<p>"
                                        + "Mastery Points: "
                                        + champ[3]['championPoints']
                                        + "</p>"
                                        + "</div>"
                }
            }
            result+= "</div>"
            champPool.innerHTML += result
        }
    }

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
                <h3>Champion Pool: {myChampionsData.length}</h3>
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