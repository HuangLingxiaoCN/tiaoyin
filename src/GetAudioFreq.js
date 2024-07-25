var audioContext = null;
var analyser = null;
var theBuffer = null;
var DEBUGCANVAS = null;
var mediaStreamSource = null;

var rafID = null;
var buflen = 2048;
var buf = new Float32Array(buflen);

export const startPitchDetect = () => {
    console.log("startPitchDetect");

    audioContext = new AudioContext();

    // Attempt to get audio input
    navigator.mediaDevices
        .getUserMedia({
            audio: {
                mandatory: {
                    googEchoCancellation: "false",
                    googAutoGainControl: "false",
                    googNoiseSuppression: "false",
                    googHighpassFilter: "false",
                },
                optional: [],
            },
        })
        .then((stream) => {
            // Create an AudioNode from the stream.
            mediaStreamSource = audioContext.createMediaStreamSource(stream);

            // Connect it to the destination.
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            mediaStreamSource.connect(analyser);
            // 指定获取频率的时间间隔
            setInterval(updatePitch, 300);
            // updatePitch();
        })
        .catch((err) => {
            console.log(err);
            // always check for errors at the end.
            console.error(`${err.name}: ${err.message}`);
            alert("Stream generation failed.");
        });
};

const autoCorrelate = (buf, sampleRate) => {
    // Implements the ACF2+ algorithm
    var SIZE = buf.length;
    var rms = 0;

    for (var i = 0; i < SIZE; i++) {
        var val = buf[i];
        rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) {
        // not enough signal
        setFreq(-1);
        setFreqDif(-10);
        return -1;
    }

    var r1 = 0,
        r2 = SIZE - 1,
        thres = 0.2;
    for (var i = 0; i < SIZE / 2; i++)
        if (Math.abs(buf[i]) < thres) {
            r1 = i;
            break;
        }
    for (var i = 1; i < SIZE / 2; i++)
        if (Math.abs(buf[SIZE - i]) < thres) {
            r2 = SIZE - i;
            break;
        }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    var c = new Array(SIZE).fill(0);
    for (var i = 0; i < SIZE; i++)
        for (var j = 0; j < SIZE - i; j++) c[i] = c[i] + buf[j] * buf[j + i];

    var d = 0;
    while (c[d] > c[d + 1]) d++;
    var maxval = -1,
        maxpos = -1;
    for (var i = d; i < SIZE; i++) {
        if (c[i] > maxval) {
            maxval = c[i];
            maxpos = i;
        }
    }
    var T0 = maxpos;

    var x1 = c[T0 - 1],
        x2 = c[T0],
        x3 = c[T0 + 1];
    // a = (x1 + x3 - 2*x2)/2;
    var a = (x1 + x3 - 2 * x2) / 2;
    // b = (x3 - x1)/2;
    var b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    setFreq(sampleRate / T0);
    setFreqDif(sampleRate / T0 - stdFreq);
    return sampleRate / T0;
};

export const updatePitch = () => {
    var cycles = new Array();
    analyser.getFloatTimeDomainData(buf);

    var ac = autoCorrelate(buf, audioContext.sampleRate);
    console.log(ac);

    // if (!window.requestAnimationFrame)
    //   window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    // rafID = window.requestAnimationFrame(updatePitch);
};