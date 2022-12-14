import React, {useState, useRef} from 'react';
import axios from 'axios';
import './ChampDetail.css';
import { useSearchParams  } from 'react-router-dom'
import PieChart from "./components/PieChart";

function ChampDetail(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [LoLCurrentVersion, setLoLCurrentVersion] = useState("12.14.1");
    const [champDetails, setChampDetails] = useState({});
    const [userData, setUserData] = useState({});
    const API_KEY = process.env.REACT_APP_API_KEY;
    const one = 1;
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
    function renderChart(){
        if(JSON.stringify(champDetails) !== '{}'){
            //console.log(Object.keys(champDetails.info));
            //console.log(Object.values(champDetails.info));
            /**/
            setUserData({
            labels: Object.keys(champDetails.info),
            datasets: [
              {
                label: "Users Gained",
                data: Object.values(champDetails.info),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#00AF00",
                  "#f3ba2f",
                ],
                borderColor: "black",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(232,105,90,0.8)",
                hoverBorderColor: "orange",
              },
            ],
            
          });
        }
    }
    let slideIndex = [1,1];
    function plusSlides(n, no) {
        showSlides(slideIndex[no] += n, no);
    }
    function showSlides(n, no) {
        let i;
        let x = document.getElementsByClassName("mySlides1");
        if (n > x.length) {slideIndex[no] = 1}    
        if (n < 1) {slideIndex[no] = x.length}
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";  
        }
        x[slideIndex[no]-1].style.display = "block";  
    }
    
    function loadChampionPictures(){
        const skins = champDetails['skins'];
        const container = document.getElementsByClassName("slideshow-container")[0];
        container.innerHTML = '';
        for (let index = 0; index < skins.length; index++) {
            const skin = skins[index];
            const src = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+ championName +"_" + skin['num'] +".jpg"
            const img = document.createElement('img');
            img.className = 'champ-pic fade-in'
            img.src = src;
            const div = document.createElement('div');
            div.className = 'mySlides1'
            div.appendChild(img);
            
            container.appendChild(div);
        }
        /*previous page*/
        const a1 = document.createElement('a');
        a1.className = 'prev';
        a1.addEventListener("click", function(){
            function plusSlides(n, no) {
                showSlides(slideIndex[no] += n, no);
            }
            function showSlides(n, no) {
                let i;
                let x = document.getElementsByClassName("mySlides1");
                if (n > x.length) {slideIndex[no] = 1}    
                if (n < 1) {slideIndex[no] = x.length}
                for (i = 0; i < x.length; i++) {
                    x[i].style.display = "none";  
                }
                x[slideIndex[no]-1].style.display = "block";  
            }
            plusSlides(-1, 0);
        });
        a1.innerHTML = '&#10094;';
        const span1 = document.createElement('span');
        a1.appendChild(span1);
        /*next page*/
        const a2 = document.createElement('a');
        a2.className = 'next';
        a2.addEventListener("click", function(){
            function plusSlides(n, no) {
                showSlides(slideIndex[no] += n, no);
            }
            function showSlides(n, no) {
                let i;
                let x = document.getElementsByClassName("mySlides1");
                if (n > x.length) {slideIndex[no] = 1}    
                if (n < 1) {slideIndex[no] = x.length}
                for (i = 0; i < x.length; i++) {
                    x[i].style.display = "none";  
                }
                x[slideIndex[no]-1].style.display = "block";  
            }
            plusSlides(1, 0);
        });
        a2.innerHTML = '&#10095;';
        const span2 = document.createElement('span');
        a2.appendChild(span2);
        container.appendChild(a1);
        container.appendChild(a2);
        showSlides(1, 0);
        showSlides(1, 1);
    }
    if(JSON.stringify(champDetails) !== '{}'){
        loadChampionPictures();
    }   
    
    console.log(champDetails)
    //<img style={{visibility:'collapse'}} src={"http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+ championName +"_0.jpg"}></img>
    return (
        <div className="main-page">
            {JSON.stringify(champDetails) !== '{}' ? 
            <>  
            </> 
            : 
            <><script>{searchForChampion()}</script></>
            }
            <h1>{champDetails.name} - {champDetails.title}</h1>
            <div className="slideshow-container">

            </div>
            
            {JSON.stringify(userData) !== '{}'? 
            <>  
                <div id='champion_stats_chart'>
                    <PieChart chartData={userData} />
                </div>
            </> 
            : 
            <> <script>{renderChart()}</script></>
            }
            {JSON.stringify(champDetails) !== '{}' ? 
            <>  
            <p className='background-info'>{champDetails['lore']}</p>
            <table>
            <tbody>
            <tr>
                <th>{champDetails['passive']['name']}</th>
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
export let slideIndex = [1,1];
export function plusSlides(n, no) {
    showSlides(slideIndex[no] += n, no);
}
export function showSlides(n, no) {
    let i;
    let x = document.getElementsByClassName("mySlides1");
    if (n > x.length) {slideIndex[no] = 1}    
    if (n < 1) {slideIndex[no] = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    x[slideIndex[no]-1].style.display = "block";  
}