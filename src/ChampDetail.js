import React, {useState} from 'react';
import axios from 'axios';
import './ChampDetail.css';
import { useSearchParams  } from 'react-router-dom'

function ChampDetail(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [LoLCurrentVersion, setLoLCurrentVersion] = useState("12.14.1");
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
                                            
                                            console.log(responseJson.data)
                                            //console.log(myChamps[responseJson.data[i]['key']])
                                        })
                                    }, 0);
        }
    

        searchForChampion();
    return (<h1>Champion Details</h1>)
}

export default ChampDetail;