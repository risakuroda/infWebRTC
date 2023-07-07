import {nowInSec,SkyWayAuthToken,SkyWayContext,SkyWayRoom,SkyWayStreamFactory,uuidV4,} from '@skyway-sdk/room';
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
  const remoteTextArea = document.getElementById('remote-text-area');

  const params = decodeURI(location.search);
  const roomNameInput = params.slice(6,-16);

  const dataStreamInput = document.getElementById('data-stream');

  const myId = document.getElementById('my-id');
  const joinButton = document.getElementById('join');
  const writeButton = document.getElementById('write');

  const { audio, video } = await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
  video.attach(localVideo);
  await localVideo.play();

  const data = await SkyWayStreamFactory.createDataStream();
  writeButton.onclick = () => {
    data.write(dataStreamInput.value);
    const elm = document.createElement('div');
    elm.innerText=dataStreamInput.value;
    remoteTextArea.appendChild(elm);
    dataStreamInput.value = '';
  };

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
    await me.publish(data);

    const subscribeAndAttach = (publication) => {
      if (publication.publisher.id === me.id) return;

      const subscribeButton = document.createElement('div');
      subscribeButton.className = 'col-3 content';
      subscribeButton.textContent = `${publication.publisher.id}: ${publication.contentType}`;

      async function mediaRun() {
        const { stream } = await me.subscribe(publication.id);

        switch (stream.contentType) {
          case 'video':
            {
              const elm = document.createElement('video');
              elm.className = 'col-3 content';
              elm.playsInline = true;
              elm.autoplay = true;
              stream.attach(elm);
              remoteVideoArea.appendChild(elm);
            }
            break;
          case 'audio':
            {
              const elm = document.createElement('audio');
              elm.className = 'col-3 content';
              elm.controls = true;
              elm.autoplay = true;
              stream.attach(elm);
              remoteAudioArea.appendChild(elm);
            }
            break;
          case 'data': {
            const elm = document.createElement('div');
            remoteTextArea.appendChild(elm);
            elm.innerText = 'data\n';
            stream.onData.add((data) => {
              elm.innerText += data + '\n';
            });
          }
        }
      };
      mediaRun()
    };
    channel.publications.forEach(subscribeAndAttach);
    channel.onStreamPublished.add((e) => subscribeAndAttach(e.publication));
  };
})();