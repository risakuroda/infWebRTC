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
  const remoteVideoArea = document.getElementById('remote-video-area');
  const remoteAudioArea = document.getElementById('remote-audio-area');
  
  const params = decodeURI(location.search);
  const roomNameInput = params.slice(6,-16);
  
  const myId = document.getElementById('my-id');
  const joinButton = document.getElementById('join');

  const { audio, video } = await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
  video.attach(localVideo);
  await localVideo.play();
  
  joinButton.onclick = async () => {
    if (roomNameInput === '') return;

    
    console.log(params);
    console.log(roomNameInput);

    const context = await SkyWayContext.Create(token);
    const room = await SkyWayRoom.FindOrCreate(context, {
      type: 'p2p',
      name: roomNameInput,
    });
    const me = await room.join();
  
    myId.textContent = me.id;
  
    await me.publish(audio);
    await me.publish(video);
  
    const subscribeAndAttach = (publication) => {
      if (publication.publisher.id === me.id) return;
        
      const subscribeButton = document.createElement('div');
      subscribeButton.className = 'col-3 content';
      subscribeButton.textContent = `${publication.id}`;
            
      async function mediaRun() {
        const { stream } = await me.subscribe(publication.id);

        let newMedia;
        switch (stream.track.kind) {
          case 'video':
            newMedia = document.createElement('video');
            newMedia.className = 'col-3 content';
            newMedia.playsInline = true;
            newMedia.autoplay = true;
            break;
          case 'audio':
            newMedia = document.createElement('audio');
            newMedia.className = 'col-3 content';
            newMedia.controls = true;
            newMedia.autoplay = true;
            break;
          default: return;
        }
        switch (stream.track.kind){
          case 'video':
            stream.attach(newMedia);
            remoteVideoArea.appendChild(newMedia);
            break;
          case 'audio':
            stream.attach(newMedia);
            remoteAudioArea.appendChild(newMedia);
            break;
          default: return;
        }
      };
      mediaRun();
    }
    room.publications.forEach(subscribeAndAttach);
    room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));    
  };
})();