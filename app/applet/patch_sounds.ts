import fs from 'fs';

const targetFile = 'src/App.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const tNotifTarget = `export const triggerNotification = (title: string, body: string, playSound: boolean = true) => {
  if (playSound) playNotificationSound();`;
const tNotifRepl = `export const NOTIFICATION_SOUNDS = [
  { id: "default_ding", name: "Default Ding (డిఫాల్ట్)" },
  { id: "soft_chime", name: "Soft Chime (సాఫ్ట్ గంట)" },
  { id: "success_ping", name: "Success Ping (సక్సెస్)" },
  { id: "alert_buzz", name: "Alert Buzz (అలర్ట్)" },
  { id: "gentle_pop", name: "Gentle Pop (పాప్)" },
  { id: "echo_bell", name: "Echo Bell (ఎకో బెల్)" },
  { id: "digital_blip", name: "Digital Blip (డిజిటల్ బ్లిప్)" },
  { id: "happy_trill", name: "Happy Trill (హ్యాపీ)" },
  { id: "sharp_click", name: "Sharp Click (క్లిక్)" },
  { id: "synth_wave", name: "Synth Wave (సింథ్)" },
  { id: "marimba_tap", name: "Marimba (మరింబా)" }
];

export const triggerNotification = (title: string, body: string, playSound: boolean | string = true) => {
  if (playSound === true) playNotificationSound("default_ding");
  else if (typeof playSound === "string" && playSound !== "false") playNotificationSound(playSound);`;

content = content.replace(tNotifTarget, tNotifRepl);

const pSoundTarget = `export const playNotificationSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!globalAudioContext) {
      globalAudioContext = new AudioContextClass();
    }

    if (globalAudioContext.state === "suspended") {
      globalAudioContext.resume().catch(() => {});
    }

    const playNote = (freq: number, startTime: number, duration: number) => {
      if (!globalAudioContext) return;
      const oscillator = globalAudioContext.createOscillator();
      const gainNode = globalAudioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        freq,
        globalAudioContext.currentTime + startTime,
      );

      gainNode.gain.setValueAtTime(
        0,
        globalAudioContext.currentTime + startTime,
      );
      gainNode.gain.linearRampToValueAtTime(
        0.5,
        globalAudioContext.currentTime + startTime + 0.05,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        globalAudioContext.currentTime + startTime + duration,
      );

      oscillator.connect(gainNode);
      gainNode.connect(globalAudioContext.destination);

      oscillator.start(globalAudioContext.currentTime + startTime);
      oscillator.stop(globalAudioContext.currentTime + startTime + duration);
    };

    // Ding-dong chord
    playNote(880, 0, 0.5); // A5
    playNote(1760, 0.1, 0.5); // A6
  } catch (e) {
    console.warn("Audio Context not supported or failed to initialize", e);
  }
};`;

const pSoundRepl = `export const playNotificationSound = (soundId: string = "default_ding") => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!globalAudioContext) {
      globalAudioContext = new AudioContextClass();
    }

    if (globalAudioContext.state === "suspended") {
      globalAudioContext.resume().catch(() => {});
    }

    const ctx = globalAudioContext;
    const t = ctx.currentTime;
    
    const playOsc = (type: OscillatorType, freq1: number, freq2: number | undefined, duration: number = 0.5, delay: number = 0, volume: number = 0.5) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq1, t + delay);
      if (freq2) {
        osc.frequency.exponentialRampToValueAtTime(freq2, t + delay + duration * 0.2);
      }

      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(volume, t + delay + duration * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, t + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + delay);
      osc.stop(t + delay + duration);
    };

    switch(soundId) {
       case "soft_chime":
          playOsc("sine", 523.25, 1046.50, 0.8, 0, 0.4);
          break;
       case "success_ping":
          playOsc("triangle", 659.25, 880, 0.4, 0, 0.3);
          playOsc("triangle", 880, 1318.51, 0.6, 0.1, 0.3);
          break;
       case "alert_buzz":
          playOsc("sawtooth", 150, 100, 0.3, 0, 0.2);
          break;
       case "gentle_pop":
          playOsc("sine", 400, 200, 0.1, 0, 0.5);
          break;
       case "echo_bell":
          playOsc("sine", 880, 880, 1.0, 0, 0.3);
          playOsc("sine", 880, 880, 0.5, 0.2, 0.15);
          break;
       case "digital_blip":
          playOsc("square", 1200, 1200, 0.1, 0, 0.1);
          playOsc("square", 1600, 1600, 0.15, 0.1, 0.1);
          break;
       case "happy_trill":
          playOsc("sine", 440, 554.37, 0.3, 0, 0.3);
          playOsc("sine", 554.37, 659.25, 0.3, 0.15, 0.3);
          break;
       case "sharp_click":
          playOsc("square", 800, 100, 0.05, 0, 0.3);
          break;
       case "synth_wave":
          playOsc("triangle", 220, 880, 1.0, 0, 0.4);
          break;
       case "marimba_tap":
          playOsc("sine", 600, 300, 0.2, 0, 0.5);
          break;
       case "default_ding":
       default:
          playOsc("sine", 880, 1760, 0.5, 0, 0.4);
          break;
    }
  } catch (e) {
    console.warn("Audio Context not supported or failed to initialize", e);
  }
};`;

content = content.replace(pSoundTarget, pSoundRepl);

fs.writeFileSync(targetFile, content, 'utf8');
