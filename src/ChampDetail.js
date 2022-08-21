import React, {useState} from 'react';
import axios from 'axios';
import './ChampDetail.css';

function ChampDetail(){
    const [LoLCurrentVersion, setLoLCurrentVersion] = useState("12.14.1");
    const API_KEY = process.env.REACT_APP_API_KEY;
    axios.get("https://ddragon.leagueoflegends.com/api/versions.json").then(
        function(response){
            setLoLCurrentVersion(response.data[0]);
        });
        function searchForChampion(){
            setTimeout(function(){
                 fetch('http://ddragon.leagueoflegends.com/cdn/' 
                 + LoLCurrentVersion + '/data/en_US/champion/Aatrox.json').then((response) => response.json())
                                        .then((responseJson) => {
                                            
                                            console.log(responseJson.data)
                                            //console.log(myChamps[responseJson.data[i]['key']])
                                        })
                                    }, 0);
        }
    

        searchForChampion();
    return (<h1>Champion Details</h1>)
}

export default ChampDetail;