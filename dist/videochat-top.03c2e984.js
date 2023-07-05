const music = document.getElementById("music");
const movie = document.getElementById("movie");
const youtube = document.getElementById("youtube");
const divination = document.getElementById("divination");
const karaoke = document.getElementById("karaoke");
music.onclick = function nextpage() {
    var roomNameInput = music.value;
    document.location.href = "room.html?value=" + `${roomNameInput}`;
};
movie.onclick = function nextpage() {
    var roomNameInput = movie.value;
    document.location.href = "room.html?value=" + `${roomNameInput}`;
};
youtube.onclick = function nextpage() {
    var roomNameInput = movie.value;
    document.location.href = "room.html?value=" + `${roomNameInput}`;
};
divination.onclick = function nextpage() {
    var roomNameInput = movie.value;
    document.location.href = "room.html?value=" + `${roomNameInput}`;
};
karaoke.onclick = function nextpage() {
    var roomNameInput = movie.value;
    document.location.href = "room.html?value=" + `${roomNameInput}`;
};

//# sourceMappingURL=videochat-top.03c2e984.js.map
