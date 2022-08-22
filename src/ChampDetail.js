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
                                            //console.log(champDetails);
                                            //console.log(champDetails['lore'])
                                        })
                                    }, 500);
        }
    //console.log(JSON.stringify(champDetails) !== '{}')

        //searchForChampion();
    return (
        <div className="main-page">
            <script>{searchForChampion()}</script>
            <h1>{championName} Details</h1>
            <img src={"http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+ championName +"_0.jpg"}></img>
            {JSON.stringify(champDetails) !== '{}' ? 
            <>  
            <p className='background-info'>{champDetails['lore']}</p>
            </> 
            : 
            <><p>Loading</p></>
            }
        </div>
    )
}

export default ChampDetail;