import React, {useState} from 'react';
import axios from 'axios';
import './ChampDetail.css';
import { useSearchParams  } from 'react-router-dom'

function ChampDetail(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [LoLCurrentVersion, setLoLCurrentVersion] = useState("12.14.1");
    const [champDetails, setChampDetails] = useState({});
    //var champDetails = {};
    const API_KEY = process.env.REACT_APP_API_KEY;
    const championName = searchParams.get("championName")
    axios.get("https://ddragon.leagueoflegends.com/api/versions.json").then(
        function(response){
            setLoLCurrentVersion(response.data[0]);
        });
        function searchForChampion(){
            setTimeout(function(){
                 fetch('http://ddragon.leagueoflegends.com/cdn/' 
                 + LoLCurrentVersion + '/data/en_US/champion/' + championName + '.json').then((response) => response.json())
                                        .then((responseJson) => {
                                            setChampDetails(responseJson.data[championName]);
                                            //console.log(champDetails['lore'])
                                        })
                                    }, 500);
        }
    //console.log(JSON.stringify(champDetails) !== '{}')
    console.log(champDetails);
        //searchForChampion();

    
    return (
        <div className="main-page">
            {JSON.stringify(champDetails) !== '{}' ? 
            <>  
            </> 
            : 
            <><script>{searchForChampion()}</script></>
            }
            <h1>{championName} Details</h1>
            <img src={"http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+ championName +"_0.jpg"}></img>
            {JSON.stringify(champDetails) !== '{}' ? 
            <>  
            <p className='background-info'>{champDetails['lore']}</p>
            <table>
            <tbody>
            <tr>
                <th>Passive</th>
                <th><img src={"http://ddragon.leagueoflegends.com/cdn/" + LoLCurrentVersion + "/img/passive/"+ champDetails['passive']['image']['full']}></img></th>
                <th>{champDetails['passive']['description']}</th>
            </tr>
            <tr>
                <th>{champDetails['spells'][0]['name']}</th>
                <th><img src={"http://ddragon.leagueoflegends.com/cdn/" + LoLCurrentVersion + "/img/spell/"+ champDetails['spells'][0]['id'] +".png"}></img></th>
                <th>{champDetails['spells'][0]['description'].split('<br>')} 
                <br></br>Cooldown: {champDetails['spells'][0]['cooldownBurn']}
                <br></br> Cost: {champDetails['spells'][0]['costBurn']} 
                <br></br> Base Damage: {champDetails['spells'][0]['effectBurn'][1]} 
                </th>
            </tr>
            <tr>
                <th>{champDetails['spells'][1]['name']}</th>
                <th><img src={"http://ddragon.leagueoflegends.com/cdn/" + LoLCurrentVersion + "/img/spell/"+ champDetails['spells'][1]['id'] +".png"}></img></th>
                <th>{champDetails['spells'][1]['description'].replaceAll('<br>', '\n')} 
                <br></br> Cooldown: {champDetails['spells'][1]['cooldownBurn']} 
                <br></br> Cost: {champDetails['spells'][1]['costBurn']} 
                <br></br> Base Damage: {champDetails['spells'][1]['effectBurn'][1]} 
                </th>
            </tr>
            <tr>
                <th>{champDetails['spells'][2]['name']}</th>
                <th><img src={"http://ddragon.leagueoflegends.com/cdn/" + LoLCurrentVersion + "/img/spell/"+ champDetails['spells'][2]['id'] +".png"}></img></th>
                <th>{champDetails['spells'][2]['description'].replaceAll('<br>', '\n')} 
                <br></br> Cooldown: {champDetails['spells'][2]['cooldownBurn']} 
                <br></br> Cost: {champDetails['spells'][2]['costBurn']} 
                <br></br> Base Damage: {champDetails['spells'][2]['effectBurn'][1]} 
                </th>
            </tr>
            <tr>
                <th>{champDetails['spells'][3]['name']}</th>
                <th><img src={"http://ddragon.leagueoflegends.com/cdn/" + LoLCurrentVersion + "/img/spell/"+ champDetails['spells'][3]['id'] +".png"}></img></th>
                <th>{champDetails['spells'][3]['description'].replaceAll('<br>', '\n')} 
                <br></br> Cooldown: {champDetails['spells'][3]['cooldownBurn']} 
                <br></br> Cost: {champDetails['spells'][3]['costBurn']}
                <br></br> Base Damage: {champDetails['spells'][3]['effectBurn'][1]} 
                </th>
            </tr>
            </tbody>
            </table>
            </> 
            : 
            <><p>Loading</p></>
            }
        </div>
    )
}

export default ChampDetail;