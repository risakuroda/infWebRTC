const youtube = document.getElementById("youtube");

function fetchData(keyword){
  fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyApIvZ8TBjELwOKFSkT1YVMay0X1d-JP_w&type=video&part=snippet&q=${keyword}`)
  .then(response => response.json())
  .then(data => {
    for(let i=0; i < 4; i++){
      console.log(data.items[i].id.videoId);
      const videoID = data.items[i].id.videoId;
      const youtubeAppend = document.createElement('iframe');
      youtubeAppend.src=`https://www.youtube.com/embed/${videoID}`;
      youtube.appendChild(youtubeAppend);
    }
  })
  .catch(error => {
    console.log(error);
  })
}
const search = location.search;
youtube.onclick = () =>{
  fetchData(search);
};


