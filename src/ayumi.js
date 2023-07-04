import { nowInSec, SkyWayAuthToken, SkyWayContext, SkyWayRoom, SkyWayStreamFactory, uuidV4 } from '@skyway-sdk/room';
const token = new SkyWayAuthToken({
    jti: uuidV4(),
    iat: nowInSec(),
    exp: nowInSec() + 60 * 60 * 24,
    scope: {
      app: {
        id: 'dcf87926-8f4d-429d-afd8-2fd610cd0031',
        turn: true,
        actions: ['read'],
        channels: [
          {
            id: '*',
            name: '*',
            actions: ['write'],
            members: [
              {
                id: '*',
                name: '*',
                actions: ['write'],
                publication: {
                  actions: ['write'],
                },
                subscription: {
                  actions: ['write'],
                },
              },
            ],
            sfuBots: [
              {
                actions: ['write'],
                forwardings: [
                  {
                    actions: ['write'],
                  },
                ],
              },
            ],
          },
        ],
      },
    },

}).encode('gHYUFPOituZ/3UsaCqP5sHLKsF+4i2+Z85+YuozeHEs=');
(async () => {
    const localVideo = document.getElementById('local-video');
    const buttonArea = document.getElementById('button-area');
    const remoteMediaArea = document.getElementById('remote-media-area');
    const roomNameInput = document.getElementById('room-name');
  
    const myId = document.getElementById('my-id');
    const joinButton = document.getElementById('join');
  
    const { audio, video } =
      await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
    video.attach(localVideo);
    await localVideo.play();
  
    joinButton.onclick = async () => {
      if (roomNameInput.value === '') return;
  
      const context = await SkyWayContext.Create(token);
      const room = await SkyWayRoom.FindOrCreate(context, {
        type: 'sfu',
        name: roomNameInput.value,
      });
      const me = await room.join();
  
      myId.textContent = me.id;
  
      await me.publish(audio);
      await me.publish(video);
  
      /*const subscribeAndAttach = (publication) => {
        if (publication.publisher.id === me.id) return;
  
        const subscribeButton = document.createElement('button');
        subscribeButton.textContent = `${publication.publisher.id}: ${publication.contentType}`;
        buttonArea.appendChild(subscribeButton);
  
        subscribeButton.onclick = async () => {
          const { stream } = await me.subscribe(publication.id);
  
          let newMedia;
          switch (stream.track.kind) {
            case 'video':
              newMedia = document.createElement('video');
              newMedia.playsInline = true;
              newMedia.autoplay = true;
              break;
            case 'audio':
              newMedia = document.createElement('audio');
              newMedia.controls = true;
              newMedia.autoplay = true;
              break;
            default:
              return;
          }
          stream.attach(newMedia);
          remoteMediaArea.appendChild(newMedia);
        };
      };*/
  
      room.publications.forEach(subscribeAndAttach);
      room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));
    };
})();


//画面操作に必要な要素を取得する
const times = document.querySelector ('#times')
//画面クリック時にイベントを発火する（Clickイベントを登録する）
like.addEventListner('click', (i) => {
})
//クリック時間の制御
let clickTime = 0
like.addEventListener('dbclick', (i) => {
  if(clickTime === 0) {
    clickTime = new Date().getTime()
  } else {
    if((new Date().getTime() - clickTime) < 800) {
 
    } else {
      clickTime = new Date().getTime()
    }
  }
})
//画像をダブルクリックした際に表示されるハートを作成する
const createHeart = (i) => {
    // https://fontawesome.come
    const heart = document.createElement('i')
    heart.classList.add('fas')
    heart.classList.add('fa-heart')

    //クリックした位置を取得する
    const x = e.clientX
    const y = e.clientY

    //ページから見て画像の位置を取得する
    const leftOffset = e.target.offsetLeft
    const topOffset = e.target.offsetTop

    // ハートを出す位置を制御
  // 画像の位置とクリック位置から計算
  const xInside = x - leftOffset
  const yInside = y - topOffset
 
  // ハートの位置を指定
  // スタイルの.loveMe .fa-heart {}にてposition: absolute;を
  // 指定しているため、位置を制御できる
  heart.style.top = `${yInside}px`
  heart.style.left = `${xInside}px`
 
  // 子要素として追加
  like.appendChild(heart)
}

// クリック時間の制御
// いいね数をカウント
let timesClicked = 0
 
// クリックイベントの登録
 
// ハートの作成
const createHeart1 = (i) => {

  // いいね数を増加して挿入
  times.innerHTML = ++timesClicked
  
}



 
