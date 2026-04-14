class AudioEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private n17Gain: GainNode | null = null;

  constructor() {
    // Audio context will be initialized on first user interaction
  }

  private init() {
    if (this.context) return;
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    
    this.ambientGain = this.context.createGain();
    this.ambientGain.gain.value = 0.2;
    this.ambientGain.connect(this.masterGain);

    this.n17Gain = this.context.createGain();
    this.n17Gain.gain.value = 0.4;
    this.n17Gain.connect(this.masterGain);
  }

  public async startAmbient() {
    this.init();
    if (!this.context || !this.ambientGain) return;

    // Create a base hum using oscillators
    const osc1 = this.context.createOscillator();
    const osc2 = this.context.createOscillator();
    const humGain = this.context.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.value = 50;
    osc2.type = 'sine';
    osc2.frequency.value = 51; // Slight detune for beating effect

    humGain.gain.value = 0.05;
    
    osc1.connect(humGain);
    osc2.connect(humGain);
    humGain.connect(this.ambientGain);

    osc1.start();
    osc2.start();

    // Add some white noise
    const bufferSize = 2 * this.context.sampleRate;
    const noiseBuffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.context.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    const noiseGain = this.context.createGain();
    noiseGain.gain.value = 0.01;
    
    whiteNoise.connect(noiseGain);
    noiseGain.connect(this.ambientGain);
    whiteNoise.start();
  }

  public playKeyPress(isEnter = false) {
    this.init();
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(isEnter ? 150 : 200, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(isEnter ? 50 : 100, this.context.currentTime + 0.05);
    
    gain.gain.setValueAtTime(isEnter ? 0.1 : 0.05, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.05);
  }

  public playError() {
    this.init();
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.context.currentTime);
    osc.frequency.setValueAtTime(80, this.context.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.2);
  }

  public playAccessGranted() {
    this.init();
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.3);
  }

  public playGlitch() {
    this.init();
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(Math.random() * 1000 + 100, this.context.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.setValueAtTime(0, this.context.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, this.context.currentTime + 0.07);
    gain.gain.setValueAtTime(0, this.context.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }

  public playN17Connect() {
    this.init();
    if (!this.context || !this.n17Gain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.context.currentTime + 1.5);
    
    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.context.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(this.n17Gain);
    
    osc.start();
    osc.stop(this.context.currentTime + 1.5);
  }
}

export const audioEngine = new AudioEngine();
