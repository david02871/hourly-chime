const intervalMinutes = 30; // set to 60 for hourly chime
const earliestHour = 0;
const latestHour = 23;

const intervalMs = intervalMinutes * 60 * 1000;
const audioElement = document.querySelector('audio.audio-player');

const createAudioOutputSelector = async () => {
    const audioOutputSelector = document.createElement('select');
    document.body.appendChild(audioOutputSelector);

    const mediaDevices = await navigator.mediaDevices.enumerateDevices()
        .catch(console.error);

    mediaDevices.forEach(mediaDevice => {
        const option = document.createElement('option');
        if (mediaDevice.kind === 'audiooutput') {
            option.value = mediaDevice.deviceId;
            option.text = mediaDevice.label || `speaker ${audioOutputSelector.length + 1}`;
            audioOutputSelector.appendChild(option);
        }
    })

    audioOutputSelector.addEventListener('change',
        (event) => audioElement.setSinkId(event.target.value).catch(console.error)
    );
}

const initIntervalChime = () => {
    createAudioOutputSelector();

    const timeToFirstChimeMs = intervalMs - new Date().getTime() % intervalMs;
    setTimeout(tick, timeToFirstChimeMs);
}

const tick = () => {
    const date = new Date();
    const hour = date.getHours();

    if ((hour >= earliestHour) && (hour <= latestHour)) {
        audioElement.play();
        console.info(new Date().toLocaleTimeString());
        console.info('hour', hour);
    }

    setTimeout(tick, intervalMs);
}

initIntervalChime();