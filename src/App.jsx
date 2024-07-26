import { useState, useEffect } from "react";

import { SettingOutlined } from "@ant-design/icons";
import { Button, Col, InputNumber, Row, Slider, Space, Select } from "antd";
import Dashboard from "./Dashboard";

import { xianData } from "./xianData";
import "./App.css";

var audioContext = null;
var analyser = null;
var theBuffer = null;
var DEBUGCANVAS = null;
var mediaStreamSource = null;

var rafID = null;
var buflen = 2048;
var buf = new Float32Array(buflen);


// 常量
const ratio = 1.059;

function App() {
  //
  let calculatedFreq = 0;
  const [freq, setFreq] = useState(-1);
  const [freqDif, setFreqDif] = useState(-10);
  const [criteria, setCriteria] = useState(390);
  const [selectedXianId, setSelectedXianId] = useState(1);
  const [selectedMode, setSelectedMode] = useState("zhengdiao");

  // 计算频率 freq = (ratio**sound)*criteria
  calculatedFreq = (Math.pow(ratio, xianData[selectedMode][selectedXianId - 1].sound) * criteria).toFixed(2);

  console.log(calculatedFreq)
  const startPitchDetect = () => {
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
    // console.log("autoCorrelate");

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

    // console.log(sampleRate / T0);

    setFreq(sampleRate / T0);
    setFreqDif(sampleRate / T0 - calculatedFreq);
    return sampleRate / T0;
  };

  const updatePitch = () => {
    var cycles = new Array();
    analyser.getFloatTimeDomainData(buf);

    var ac = autoCorrelate(buf, audioContext.sampleRate);
    console.log(ac);

    // if (!window.requestAnimationFrame)
    //   window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    // rafID = window.requestAnimationFrame(updatePitch);
  };

  // console.log(selectedXianId);

  const changeCriteria = (newValue) => {
    setCriteria(newValue);
  };

  const changeMode = (value) => {
    setSelectedMode(value);
  };

  return (
    <div>
      <Dashboard freqDif={freqDif} />
      <div className="xian-char">{xianData[selectedMode][selectedXianId - 1].char}</div>
      <div className="tiaoyin-main">
        <div className="descript">
          正在调{xianData[selectedMode][selectedXianId - 1].name},音名:
          {xianData[selectedMode][selectedXianId - 1].char},钢琴键位:
          {xianData[selectedMode][selectedXianId - 1].char},频率:{calculatedFreq}
          HZ
        </div>
        <div className="tiaoyin-main-select">
          <div className="string-icons">
            {xianData[selectedMode].map((xian, index) => (
              <div
                style={{
                  opacity: selectedXianId !== xian.id ? "0" : "1",
                }}
                key={xian.id}
              >
                <SettingOutlined
                  style={{ fontSize: "25px" }}
                  className="rotate"
                />
              </div>
            ))}
          </div>
          <div className="string-titles">
            {xianData[selectedMode].map((xian, index) => (
              <div className="string-title" key={xian.id}>
                <span>{xian.name}</span>
              </div>
            ))}
          </div>
          <div className="tiaoyin-container">
            {xianData[selectedMode].map((xian, index) => (
              <div
                className="string"
                key={xian.id}
                onClick={() => {
                  setSelectedXianId(xian.id);
                }}
              >
                <div
                  className="vertical-line"
                  style={{
                    borderRight:
                      selectedXianId !== xian.id
                        ? "8px solid rgba(255, 255, 255, 0.6)"
                        : "8px solid rgba(255, 255, 255, 0.9)",
                  }}
                ></div>
                <div
                  className="tiaoyin-string-text"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
                >
                  {xian.char}
                </div>
              </div>
            ))}
            <div className="start-btn">
              <Button onClick={startPitchDetect}>开始调音</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="tiaoyin-fq">
        <p>频率设置(Hz):</p>
        <Slider
          min={390}
          max={440}
          onChange={changeCriteria}
          value={criteria}
          style={{ width: "200px", marginLeft: "10px" }}
        />
        <p>{criteria}</p>
      </div>

      <div className="switch-mode">
        <p>切换模式:</p>
        <Select
          defaultValue="zhengdiao"
          style={{
            width: 120,
          }}
          onChange={changeMode}
          options={[
            {
              value: "zhengdiao",
              label: "正调",
            },
            {
              value: "jin5xian",
              label: "紧五弦",
            },
            {
              value: "man36xian",
              label: "慢三六弦",
            },
            {
              value: "man6xian",
              label: "慢六弦",
            },
            {
              value: "man3xian",
              label: "慢三弦",
            },
          ]}
        />
        <Button type="default" custom-style="height: 50rpx;" disabled>
          节拍器
        </Button>
      </div>
    </div>
  );
}

export default App;
