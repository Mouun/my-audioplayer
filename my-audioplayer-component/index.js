import "./lib/webaudio-controls.js";
import { style } from "./style.js";

const getBaseURL = () => {
  const base = new URL(".", import.meta.url);
  console.log("Base = " + base);
  return `${base}`;
};

const template = document.createElement("template");

template.innerHTML = `
  <style>${style}</style>
  <div class="container">
    <h3 id="media-name"></h3>
    <audio
      class="outline-none"
      crossOrigin="anonymous"
      id="player"
      src=""
      controls
    >
    </audio>
    <div class="player-progress-container">
      <progress class="mb-4 w-full" id="progress-bar" min="0" max="0" value="0" step="1"></progress>
      <div class="player-progress-number-container">
        <span id="progress-number-current"></span>
        <span class="progress-number-separator">/</span>
        <span id="progress-number-max"></span>
      </div>
    </div>
    <div class="player-control-buttons-container w-full mb-4">
      <button id="minus-ten-btn" class="control-button">-10</button>
      <button id="play-btn" class="control-button">Play</button>
      <button id="pause-btn" class="control-button">Pause</button>
      <button id="stop-btn" class="control-button">Stop</button>
      <button id="plus-ten-btn" class="control-button">+10</button>
      <div class="loop-checkbox-container">
        <input id="loop-btn" type="checkbox" class="loop-checkbox">
        <label for="loop-btn" class="loop-checkbox-label ml-2 block text-sm leading-5 text-gray-900">
          Loop
        </label>
      </div>
    </div>
    <div class="volume-knob-container mb-4">
      <webaudio-knob id="volume-knob" src="./assets/img/LittlePhatty.png" sprites="100" diameter="70"></webaudio-knob>
    </div>
    <div class="panner-container mb-4">
      <span>Panner :</span>
      <input class="my-4" id="panning-control" type="range" min="-1" max="1" step="0.1" value="0">
      <span class="my-4" id="panning-value"></span>
    </div>
    <div class="equalizer-container mb-4">
      <label for="equalizer-60"><span class="equalizer-label">60Hz :</span></label>
      <input id="equalizer-60" type="range" value="0" step="1" min="-30" max="30">
      <output id="gain0">0 dB</output>
      <br>   
      <label for="equalizer-170"><span class="equalizer-label">170Hz :</span></label>
      <input id="equalizer-170" type="range" value="0" step="1" min="-30" max="30">
      <output id="gain1">0 dB</output>
      <br>
      <label for="equalizer-350"><span class="equalizer-label">350Hz :</span></label>
      <input id="equalizer-350" type="range" value="0" step="1" min="-30" max="30">
      <output id="gain2">0 dB</output>
      <br>
      <label for="equalizer-1000"><span class="equalizer-label">1000Hz :</span></label>
      <input id="equalizer-1000" type="range" value="0" step="1" min="-30" max="30">
      <output id="gain3">0 dB</output>
      <br>
      <label for="equalizer-3500"><span class="equalizer-label">3500Hz :</span></label>
      <input id="equalizer-3500" type="range" value="0" step="1" min="-30" max="30">
      <output id="gain4">0 dB</output>
      <br>
      <label for="equalizer-10000"><span class="equalizer-label">10000Hz :</span></label>
      <input id="equalizer-10000" type="range" value="0" step="1" min="-30" max="30">
      <output id="gain5">0 dB</output>
    </div>
    <button id="rester-equalizer-btn" class="control-button">Reset Equalizer</button>
    <canvas class="my-12" id="canvas"></canvas>
  </div>
`;

export default class MyAudioPlayer extends HTMLElement {
  static get observedAttributes() {
    return ["src", "show-controls", "loop"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.src = this.getAttribute("src");
    this.showControls = this.getAttribute("show-controls") || false;
    this.loop = this.getAttribute("loop") || false;

    this.filters = [];

    this.basePath = getBaseURL();
    this.fixRelativeImagePaths();
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    console.log(`Attribut ${attribute} changed from ${oldValue} to ${newValue}`);
  }

  connectedCallback() {
    this.mediaName = this.shadowRoot.getElementById("media-name");
    this.player = this.shadowRoot.getElementById("player");
    this.progressBar = this.shadowRoot.getElementById("progress-bar");
    this.volumeKnob = this.shadowRoot.getElementById("volume-knob");
    this.panningControl = this.shadowRoot.getElementById("panning-control");
    this.panningValue = this.shadowRoot.getElementById("panning-value");
    this.progressBar = this.shadowRoot.getElementById("progress-bar");
    this.progressNumberCurrent = this.shadowRoot.getElementById("progress-number-current");
    this.progressNumberMax = this.shadowRoot.getElementById("progress-number-max");
    this.canvas = this.shadowRoot.getElementById("canvas");

    // Buttons
    this.minusTenButton = this.shadowRoot.getElementById("minus-ten-btn");
    this.playButton = this.shadowRoot.getElementById("play-btn");
    this.pauseButton = this.shadowRoot.getElementById("pause-btn");
    this.stopButton = this.shadowRoot.getElementById("stop-btn");
    this.plusTenButton = this.shadowRoot.getElementById("plus-ten-btn");
    this.loopCheckbox = this.shadowRoot.getElementById("loop-btn");
    this.resetEqualizer = this.shadowRoot.getElementById("rester-equalizer-btn");

    // Equalizer ranges
    this.equalizer60 = this.shadowRoot.getElementById("equalizer-60");
    this.equalizer170 = this.shadowRoot.getElementById("equalizer-170");
    this.equalizer350 = this.shadowRoot.getElementById("equalizer-350");
    this.equalizer1000 = this.shadowRoot.getElementById("equalizer-1000");
    this.equalizer3500 = this.shadowRoot.getElementById("equalizer-3500");
    this.equalizer10000 = this.shadowRoot.getElementById("equalizer-10000");

    // Title initialization
    this.mediaName.innerHTML = this.innerHTML;

    // Player initialization
    this.player.src = this.src;
    this.player.loop = this.loop;
    this.player.controls = this.showControls;

    // Loop checkbox initialization
    this.loopCheckbox.checked = this.loop;

    // Volume knob initialization
    this.volumeKnob.value = this.player.volume * 100;

    // Panning value initialization
    this.panningValue.innerHTML = 0;

    // Canvas initialization
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.canvasContext = this.canvas.getContext("2d");

    // The AudioContext shouldn't be initialized before any user input has been detected
    const audioContext = new AudioContext();
    const playerNode = audioContext.createMediaElementSource(this.player);

    this.pannerNode = audioContext.createStereoPanner();

    this.analyserNode = audioContext.createAnalyser();
    this.analyserNode.fftSize = 1024;
    this.bufferLenght = this.analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLenght);

    playerNode.connect(this.pannerNode).connect(this.analyserNode).connect(audioContext.destination);

    // Equalizer initialization
    [60, 170, 350, 1000, 3500, 10000].forEach((freq, i) => {
      var eq = audioContext.createBiquadFilter();
      eq.frequency.value = freq;
      eq.type = "peaking";
      eq.gain.value = 0;
      this.filters.push(eq);
    });

    playerNode.connect(this.filters[0]);
    for (var i = 0; i < this.filters.length - 1; i++) {
      this.filters[i].connect(this.filters[i + 1]);
    }

    this.filters[this.filters.length - 1].connect(audioContext.destination);

    this.visualize();
    this.declareListeners();
  }

  declareListeners() {
    // Player
    this.player.ontimeupdate = (event) => {
      if (!isNaN(this.player.duration)) {
        const time = event.target.currentTime;
        this.progressBar.value = event.target.currentTime;
        const minutes = Math.floor(time / 60);
        const seconds = (time - minutes * 60).toFixed(0);
        this.progressNumberCurrent.innerHTML = `${minutes}:${this.formatInt(seconds)}`;
      }
    };

    this.player.onloadedmetadata = () => {
      this.progressBar.max = this.player.duration;

      const minutes = Math.floor(this.player.duration / 60);
      const seconds = (this.player.duration - minutes * 60).toFixed(0);

      this.progressNumberCurrent.innerHTML = "0:00";
      this.progressNumberMax.innerHTML = `${minutes}:${this.formatInt(seconds)}`;
    };

    // Progress
    this.progressBar.onclick = (event) => {
      const x = event.pageX - this.progressBar.offsetLeft;
      const y = event.pageY - this.progressBar.offsetTop;
      const clickedValue = (x * this.progressBar.max) / this.progressBar.offsetWidth;

      this.player.currentTime = clickedValue;
    };

    // Buttons
    this.minusTenButton.onclick = () => (this.player.currentTime -= 10);
    this.playButton.onclick = () => this.player.play();
    this.pauseButton.onclick = () => this.player.pause();
    this.stopButton.onclick = () => {
      this.player.pause();
      this.player.currentTime = 0;
    };
    this.plusTenButton.onclick = () => (this.player.currentTime += 10);
    this.loopCheckbox.onchange = () => (this.player.loop = this.loopCheckbox.checked);
    this.resetEqualizer.onclick = () => {
      this.equalizer60.value = 0;
      this.changeGain(0, 0);
      this.equalizer170.value = 0;
      this.changeGain(0, 1);
      this.equalizer350.value = 0;
      this.changeGain(0, 2);
      this.equalizer1000.value = 0;
      this.changeGain(0, 3);
      this.equalizer3500.value = 0;
      this.changeGain(0, 4);
      this.equalizer10000.value = 0;
      this.changeGain(0, 5);
    };

    // Volume knob
    this.volumeKnob.oninput = (event) => (this.player.volume = event.target.value / 100);

    // Panning control
    this.panningControl.oninput = (event) => {
      this.pannerNode.pan.value = event.target.value;
      this.panningValue.innerHTML = event.target.value;
    };

    // Equalizer
    this.equalizer60.oninput = (event) => this.changeGain(event.target.value, 0);
    this.equalizer170.oninput = (event) => this.changeGain(event.target.value, 1);
    this.equalizer350.oninput = (event) => this.changeGain(event.target.value, 2);
    this.equalizer1000.oninput = (event) => this.changeGain(event.target.value, 3);
    this.equalizer3500.oninput = (event) => this.changeGain(event.target.value, 4);
    this.equalizer10000.oninput = (event) => this.changeGain(event.target.value, 5);
  }

  visualize() {
    this.canvasContext.fillStyle = "rgba(255, 255, 255, 1)";
    this.canvasContext.fillRect(0, 0, this.width, this.height);

    this.analyserNode.getByteTimeDomainData(this.dataArray);

    this.canvasContext.lineWidth = 2;
    this.canvasContext.strokeStyle = "#5a67d8";

    this.canvasContext.beginPath();
    let sliceWidth = this.width / this.bufferLenght;
    let x = 0;

    for (let i = 0; i < this.bufferLenght; i++) {
      let v = this.dataArray[i] / 255;
      let y = v * this.height;

      if (i === 0) {
        this.canvasContext.moveTo(x, y);
      } else {
        this.canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.canvasContext.lineTo(this.width, this.height / 2);
    this.canvasContext.stroke();
    requestAnimationFrame(() => {
      this.visualize();
    });
  }

  fixRelativeImagePaths() {
    let webaudioControls = this.shadowRoot.querySelectorAll("webaudio-knob, webaudio-slider, webaudio-switch, img");
    webaudioControls.forEach((e) => {
      let currentImagePath = e.getAttribute("src");
      if (currentImagePath !== undefined) {
        let imagePath = e.getAttribute("src");
        e.src = this.basePath + "/" + imagePath;
      }
    });
  }

  formatInt(baseNumber) {
    return ("0" + baseNumber).slice(-2);
  }

  changeGain(sliderVal, nbFilter) {
    var value = parseFloat(sliderVal);
    this.filters[nbFilter].gain.value = value;
    var output = this.shadowRoot.querySelector("#gain" + nbFilter);
    output.value = value + " dB";
  }
}

customElements.define("my-audioplayer", MyAudioPlayer);
