/**
 * ビデオ通話とテキストチャットを行うためのJavaScript
 */
import {nowInSec,SkyWayAuthToken,SkyWayContext,SkyWayRoom,SkyWayStreamFactory,uuidV4,} from '@skyway-sdk/room';
//SkyWayAuthToken発行
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
  const videoIdArea = document.getElementById('video-id-area');
  const audioIdArea = document.getElementById('audio-id-area');
  const remoteArea = document.getElementById('remote-area');

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

    const context = await SkyWayContext.Create(token);
    const channel = await SkyWayRoom.FindOrCreate(context, {
      type: 'p2p',
      name: roomNameInput,
    });
    const me = await channel.join();

    myId.textContent = me.id;

    await me.publish(audio);
    await me.publish(video);

    const subscribeAndAttach = (publication) => {
      if (publication.publisher.id === me.id) return;

      const subscribe = document.createElement('div');
      subscribe.className = 'col-3 content';
      subscribe.innerText = `${publication.publisher.id}`;
      
      async function videoAndAudio() {
        const { stream } = await me.subscribe(publication.id);

        let elm;
        switch (stream.contentType) {
            case 'video':
                elm = document.createElement('video');
                elm.className = 'col-3 content';
                elm.playsInline = true;
                elm.autoplay = true;
                stream.attach(elm);
                remoteVideoArea.appendChild(elm);
                break;
            case 'audio':
                elm = document.createElement('audio');
                elm.className = 'col-3 content';
                elm.controls = true;
                elm.autoplay = true;
                stream.attach(elm);
                remoteAudioArea.appendChild(elm);
                remoteAudioArea.appendChild(subscribe);
                break;
            default: return;
        }
      };
      videoAndAudio();
    };
    channel.publications.forEach(subscribeAndAttach);
    channel.onStreamPublished.add((e) => subscribeAndAttach(e.publication));
  };
})();