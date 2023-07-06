
function fetchData(keyword){

fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyApIvZ8TBjELwOKFSkT1YVMay0X1d-JP_w&type=video&part=snippet&q=${keyword}`)
.then(response => response.json())
.then(data => {
  
for(let i=0; i < 4; i++){
  console.log(data.items[i].id.videoId);
  const videoID = data.items[i].id.videoId;
  const youtubeAppend = document.createElement('iframe');
  //youtubeAppend.src=`https://www.youtube.com/watch?v=${videoID}`;
  youtubeAppend.src=`https://www.youtube.com/embed/${videoID}`;
  document.getElementById("youtube").appendChild(youtubeAppend);

/*
<iframe width="560" height="315" src="https://www.youtube.com/embed/nWHvKl10t_U" title="YouTube video player" frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

*/

}
})
.catch(error => {
  console.log(error);
})
}

const youtube = document.getElementById("youtube");
youtube.onclick = () =>{
  fetchData('ヒットソング');
};


