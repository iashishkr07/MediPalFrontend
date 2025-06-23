# Text-to-Speech Feature Documentation

## Overview

The text-to-speech (TTS) feature has been implemented to make medical information more accessible to users with visual impairments, reading difficulties, or those who prefer audio content. This feature uses the Web Speech API (SpeechSynthesis) and provides advanced controls for voice customization.

## Features

### 🎙️ Voice Selection

- Choose from multiple voices available on your system
- Support for different languages and accents
- Automatic detection of English voices as default

### ⚡ Speed Control

- Adjustable speech rate from 0.5x (slow) to 2x (very fast)
- Perfect for learning or quick listening
- Real-time speed adjustment

### 🎵 Pitch & Volume Control

- Customizable pitch levels (0.5 to 2.0)
- Volume control (0% to 100%)
- Suited for different hearing preferences

### ⏯️ Playback Controls

- Play, pause, resume, and stop functionality
- Visual feedback and status indicators
- Keyboard shortcuts support

## Components

### 1. TextToSpeech Component

The main TTS component with full controls and settings.

```jsx
import TextToSpeech from "./components/TextToSpeech";

<TextToSpeech
  text="Your text here"
  autoPlay={false}
  showControls={true}
  onStart={() => console.log("Started speaking")}
  onEnd={() => console.log("Finished speaking")}
  onPause={() => console.log("Paused")}
  onResume={() => console.log("Resumed")}
/>;
```

**Props:**

- `text` (string): The text to be spoken
- `autoPlay` (boolean): Auto-play when component mounts
- `showControls` (boolean): Show/hide the controls
- `onStart`, `onEnd`, `onPause`, `onResume` (functions): Event callbacks

### 2. TTSButton Component

A simple button component for quick TTS functionality.

```jsx
import TTSButton from "./components/TTSButton";

<TTSButton
  text="Your text here"
  size="middle"
  type="primary"
  children="Listen"
  tooltip="Listen to this text"
/>;
```

**Props:**

- `text` (string): The text to be spoken
- `size` (string): Button size ('small', 'middle', 'large')
- `type` (string): Button type ('default', 'primary', 'dashed', 'link', 'text')
- `children` (string): Button text
- `tooltip` (string): Tooltip text

### 3. useTextToSpeech Hook

A custom React hook for TTS functionality.

```jsx
import useTextToSpeech from "./hooks/useTextToSpeech";

const {
  speak,
  pause,
  resume,
  stop,
  isPlaying,
  isPaused,
  voices,
  selectedVoice,
} = useTextToSpeech({
  autoPlay: false,
  rate: 1,
  pitch: 1,
  volume: 1,
  lang: "en-US",
});

// Usage
speak("Hello world");
pause();
resume();
stop();
```

## Usage Examples

### Basic Usage

```jsx
import TextToSpeech from "./components/TextToSpeech";

function MyComponent() {
  return (
    <div>
      <h2>Medical Instructions</h2>
      <p>Take your medication as prescribed...</p>
      <TextToSpeech text="Take your medication as prescribed by your doctor." />
    </div>
  );
}
```

### Advanced Usage with Custom Settings

```jsx
import TextToSpeech from "./components/TextToSpeech";

function MedicalReport() {
  const reportText =
    "Your blood pressure is 120/80, which is within normal range...";

  return (
    <div>
      <h2>Medical Report</h2>
      <p>{reportText}</p>
      <TextToSpeech
        text={reportText}
        onStart={() => message.success("Reading medical report")}
        onEnd={() => message.info("Finished reading report")}
      />
    </div>
  );
}
```

### Using the Hook for Custom Implementation

```jsx
import useTextToSpeech from "./hooks/useTextToSpeech";

function CustomTTS() {
  const { speak, isPlaying, voices, selectedVoice, setVoice } =
    useTextToSpeech();

  return (
    <div>
      <select onChange={(e) => setVoice(voices[e.target.value])}>
        {voices.map((voice, index) => (
          <option key={index} value={index}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <button onClick={() => speak("Custom text")}>
        {isPlaying ? "Pause" : "Speak"}
      </button>
    </div>
  );
}
```

## Browser Support

The text-to-speech feature uses the Web Speech API (SpeechSynthesis), which is supported in:

- ✅ Chrome 33+
- ✅ Firefox 49+
- ✅ Safari 7+
- ✅ Edge 14+
- ❌ Internet Explorer (not supported)

## Voice Quality

Voice quality and available voices depend on your operating system:

### Windows

- Microsoft David (Male)
- Microsoft Zira (Female)
- Additional voices may be available

### macOS

- Various Siri voices
- High-quality natural-sounding speech

### Linux

- Festival voices
- eSpeak voices
- Quality may vary

## Accessibility Benefits

### 👁️ Visual Impairments

- Makes medical information accessible to users with visual impairments
- Allows independent reading of medical reports and instructions

### 📚 Reading Difficulties

- Helps users with dyslexia or other reading difficulties
- Converts complex medical text into clear, audible speech

### 🌍 Multilingual Support

- Support for multiple languages and accents
- Makes medical information accessible to diverse populations

### 🎧 Hands-Free Operation

- Allows users to listen while performing other tasks
- Perfect for busy healthcare environments

## Privacy & Security

- **Local Processing**: All text-to-speech processing happens locally in the browser
- **No External Servers**: No text is sent to external servers for speech synthesis
- **Secure**: Text content remains private and is not transmitted

## Technical Implementation

### Web Speech API

The implementation uses the standard Web Speech API:

```javascript
// Basic usage
const utterance = new SpeechSynthesisUtterance("Hello world");
window.speechSynthesis.speak(utterance);

// With options
const utterance = new SpeechSynthesisUtterance("Hello world");
utterance.rate = 1.0; // Speed
utterance.pitch = 1.0; // Pitch
utterance.volume = 1.0; // Volume
utterance.voice = selectedVoice; // Voice selection
window.speechSynthesis.speak(utterance);
```

### Event Handling

```javascript
utterance.onstart = () => console.log("Started speaking");
utterance.onend = () => console.log("Finished speaking");
utterance.onpause = () => console.log("Paused");
utterance.onresume = () => console.log("Resumed");
utterance.onerror = (event) => console.error("Error:", event);
```

## Demo Page

Visit `/text-to-speech` to see a comprehensive demo of all TTS features including:

- Quick examples with medical content
- Custom text input
- Advanced controls and settings
- Feature overview
- Accessibility information
- Technical details

## Integration with Existing Components

The TTS feature has been integrated into:

1. **PrecautionsTips Component**: Health tips and recommendations are now speakable
2. **Medical Reports**: Analysis results can be read aloud
3. **User Dashboard**: Important information is accessible via audio

## Future Enhancements

Potential improvements for the TTS feature:

- [ ] Speech-to-text integration
- [ ] Voice cloning capabilities
- [ ] Offline voice support
- [ ] Advanced pronunciation for medical terms
- [ ] Multi-language medical terminology support
- [ ] Voice preferences persistence
- [ ] Accessibility compliance improvements

## Troubleshooting

### Common Issues

1. **No voices available**

   - Check browser support
   - Ensure system has TTS voices installed
   - Try refreshing the page

2. **Speech not working**

   - Check browser permissions
   - Ensure audio is not muted
   - Try a different browser

3. **Poor voice quality**
   - Install additional system voices
   - Adjust speed and pitch settings
   - Use a different voice

### Browser-Specific Notes

- **Chrome**: Best support, most voices available
- **Firefox**: Good support, may have fewer voices
- **Safari**: Good support on macOS, limited on other platforms
- **Edge**: Good support, similar to Chrome

## Contributing

To contribute to the TTS feature:

1. Follow the existing code style
2. Add proper error handling
3. Include accessibility considerations
4. Test across different browsers
5. Update documentation

## License

This TTS feature is part of the MediPal application and follows the same licensing terms.
