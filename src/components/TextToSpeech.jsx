import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Select,
  Slider,
  Card,
  Space,
  Switch,
  message,
  Divider,
} from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  SoundOutlined,
  SettingOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { SUPPORTED_LANGUAGES, LANGUAGE_METADATA } from "../translate";
import { useLocation } from "react-router-dom";

const { Option } = Select;

// Use centralized language definitions
const LANGUAGES = SUPPORTED_LANGUAGES;

const TextToSpeech = ({
  text,
  autoPlay = false,
  showControls = true,
  className = "",
  onStart,
  onEnd,
  onPause,
  onResume,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [currentText, setCurrentText] = useState(text);
  const utteranceRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Set default voice (prioritize Indian languages)
      const indianLanguages = [
        "hi",
        "en",
        "bn",
        "te",
        "ta",
        "mr",
        "gu",
        "kn",
        "ml",
        "pa",
        "or",
        "as",
        "ur",
        "sa",
        "ne",
        "si",
        "my",
        "th",
        "km",
        "lo",
      ];

      let defaultVoice = null;

      // Try to find an Indian language voice
      for (const lang of indianLanguages) {
        const voice =
          availableVoices.find(
            (voice) => voice.lang.startsWith(lang) && voice.default
          ) || availableVoices.find((voice) => voice.lang.startsWith(lang));

        if (voice) {
          defaultVoice = voice;
          break;
        }
      }

      // Fallback to any available voice
      if (!defaultVoice) {
        defaultVoice =
          availableVoices.find((voice) => voice.default) || availableVoices[0];
      }

      setSelectedVoice(defaultVoice);

      // Set default language based on selected voice
      if (defaultVoice) {
        const langCode = defaultVoice.lang.split("-")[0];
        setSelectedLanguage(langCode);
      }
    };

    // SpeechSynthesis voices are loaded asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();

    // Auto-play if enabled
    if (autoPlay && text) {
      setTimeout(() => speak(), 500);
    }

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, autoPlay]);

  // Stop speech on page refresh, navigation, and unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.speechSynthesis.cancel();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // If using React Router, stop speech on route change
  if (useLocation) {
    useEffect(() => {
      window.speechSynthesis.cancel();
    }, [location]);
  }

  // Filter voices by selected language
  const getVoicesForLanguage = (languageCode) => {
    return voices.filter(
      (voice) =>
        voice.lang.startsWith(languageCode) ||
        voice.lang.startsWith(languageCode + "-")
    );
  };

  // Enhanced auto-detect language from text (focused on Indian languages)
  const detectLanguage = (text) => {
    // Indian language scripts detection
    const indianScripts = {
      hi: /[\u0900-\u097F]/, // Devanagari (Hindi, Marathi, Sanskrit)
      bn: /[\u0980-\u09FF]/, // Bengali
      te: /[\u0C00-\u0C7F]/, // Telugu
      ta: /[\u0B80-\u0BFF]/, // Tamil
      gu: /[\u0A80-\u0AFF]/, // Gujarati
      kn: /[\u0C80-\u0CFF]/, // Kannada
      ml: /[\u0D00-\u0D7F]/, // Malayalam
      pa: /[\u0A00-\u0A7F]/, // Gurmukhi (Punjabi)
      or: /[\u0B00-\u0B7F]/, // Odia
      as: /[\u0980-\u09FF]/, // Assamese (uses Bengali script)
      ur: /[\u0600-\u06FF]/, // Urdu (Arabic script)
      si: /[\u0D80-\u0DFF]/, // Sinhala
      my: /[\u1000-\u109F]/, // Myanmar
      th: /[\u0E00-\u0E7F]/, // Thai
      km: /[\u1780-\u17FF]/, // Khmer
      lo: /[\u0E80-\u0EFF]/, // Lao
    };

    // Check for Indian scripts first
    for (const [lang, pattern] of Object.entries(indianScripts)) {
      if (pattern.test(text)) {
        return lang;
      }
    }

    // If text contains only Latin letters, treat as English
    if (/^[A-Za-z0-9\s.,!?;:'"()\-]+$/.test(text)) {
      return "en";
    }

    // Default to Hindi for mixed content or unrecognized scripts
    return "hi";
  };

  const speak = () => {
    if (!currentText || !currentText.trim()) {
      message.error("No text to speak.");
      return;
    }
    if (!voices || voices.length === 0) {
      message.error("No voices are loaded yet. Please try again in a moment.");
      return;
    }
    if (!selectedVoice) {
      // Try to fallback to a default voice
      const fallbackVoice = voices.find((v) => v.default) || voices[0];
      if (fallbackVoice) {
        setSelectedVoice(fallbackVoice);
        message.warning(
          "No voice available for the selected language. Using default voice."
        );
      } else {
        message.error("No voice available for the selected language.");
        return;
      }
    }

    // Cancel any ongoing speech and wait a bit before speaking
    window.speechSynthesis.cancel();
    setTimeout(() => {
      // Defensive: re-check selectedVoice after possible fallback
      const voiceToUse =
        selectedVoice || voices.find((v) => v.default) || voices[0];
      if (!voiceToUse) {
        message.error("No valid voice found to use.");
        return;
      }
      const utterance = new SpeechSynthesisUtterance(currentText);
      utterance.voice = voiceToUse;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        onStart?.();
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        onEnd?.();
      };

      utterance.onpause = () => {
        setIsPaused(true);
        onPause?.();
      };

      utterance.onresume = () => {
        setIsPaused(false);
        onResume?.();
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error, event);
        message.error(
          `Text-to-speech error: ${event.error || "Unknown error"}`
        );
        setIsPlaying(false);
        setIsPaused(false);
      };

      if (!utterance.voice) {
        message.error("No valid voice selected for this language.");
        return;
      }
      if (!utterance.text || !utterance.text.trim()) {
        message.error("No text to speak.");
        return;
      }

      utteranceRef.current = utterance;
      console.log(
        "[TTS] Speaking with voice:",
        utterance.voice,
        "Text:",
        utterance.text
      );
      window.speechSynthesis.speak(utterance);
    }, 100); // 100ms delay after cancel
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    onPause?.();
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
    onResume?.();
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);

    // Find a voice for the selected language
    const languageVoices = getVoicesForLanguage(languageCode);
    if (languageVoices.length > 0) {
      const defaultVoice =
        languageVoices.find((voice) => voice.default) || languageVoices[0];
      setSelectedVoice(defaultVoice);
    }
  };

  const handleVoiceChange = (voiceIndex) => {
    const voice = voices[voiceIndex];
    setSelectedVoice(voice);

    // Update language based on selected voice
    const langCode = voice.lang.split("-")[0];
    setSelectedLanguage(langCode);

    // If currently playing, restart with new voice
    if (isPlaying) {
      stop();
      setTimeout(() => speak(), 100);
    }
  };

  const handleRateChange = (value) => {
    setRate(value);
    if (isPlaying) {
      stop();
      setTimeout(() => speak(), 100);
    }
  };

  const handlePitchChange = (value) => {
    setPitch(value);
    if (isPlaying) {
      stop();
      setTimeout(() => speak(), 100);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
    if (isPlaying) {
      stop();
      setTimeout(() => speak(), 100);
    }
  };

  const getVoiceDisplayName = (voice) => {
    if (!voice) return "";
    const langName = LANGUAGES[voice.lang.split("-")[0]] || voice.lang;
    return `${voice.name} (${langName})`;
  };

  const formatRate = (rate) => {
    if (rate === 0.5) return "0.5x (Slow)";
    if (rate === 0.75) return "0.75x";
    if (rate === 1) return "1x (Normal)";
    if (rate === 1.25) return "1.25x";
    if (rate === 1.5) return "1.5x (Fast)";
    if (rate === 2) return "2x (Very Fast)";
    return `${rate}x`;
  };

  // Auto-detect language when text changes
  useEffect(() => {
    if (currentText && currentText.trim()) {
      const detectedLang = detectLanguage(currentText);
      if (detectedLang !== selectedLanguage) {
        setSelectedLanguage(detectedLang);
        // Find a voice for the detected language
        const languageVoices = getVoicesForLanguage(detectedLang);
        if (languageVoices.length > 0) {
          const defaultVoice =
            languageVoices.find((voice) => voice.default) || languageVoices[0];
          setSelectedVoice(defaultVoice);
        }
      }
    }
  }, [currentText, voices]);

  if (!showControls) {
    return null;
  }

  const availableLanguages = [
    ...new Set(voices.map((voice) => voice.lang.split("-")[0])),
  ];
  const currentLanguageVoices = getVoicesForLanguage(selectedLanguage);

  return (
    <Card size="small" className={`tts-component ${className} mb-4`}>
      <Space direction="vertical" className="w-full">
        {/* Main Controls */}
        <Space>
          {!isPlaying ? (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={speak}
              disabled={!currentText || !selectedVoice}
            >
              {isPaused ? "Resume" : "Play"}
            </Button>
          ) : (
            <Button
              icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
              onClick={isPaused ? resume : pause}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
          )}

          <Button
            icon={<StopOutlined />}
            onClick={stop}
            disabled={!isPlaying && !isPaused}
          >
            Stop
          </Button>

          <Button
            icon={<SettingOutlined />}
            onClick={() => setShowSettings(!showSettings)}
            type={showSettings ? "primary" : "default"}
          >
            Settings
          </Button>
        </Space>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <Space direction="vertical" className="w-full">
              {/* Language Selection */}
              <div>
                <label className="block mb-2 font-bold">
                  <GlobalOutlined /> Language:
                </label>
                <Select
                  className="w-full"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  placeholder="Select a language"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {availableLanguages.map((langCode) => (
                    <Option key={langCode} value={langCode}>
                      {LANGUAGES[langCode] || langCode} ({langCode})
                    </Option>
                  ))}
                </Select>
              </div>

              <Divider />

              {/* Voice Selection */}
              <div>
                <label className="block mb-2 font-bold">Voice:</label>
                <Select
                  className="w-full"
                  value={voices.indexOf(selectedVoice)}
                  onChange={handleVoiceChange}
                  placeholder="Select a voice"
                  disabled={currentLanguageVoices.length === 0}
                >
                  {currentLanguageVoices.map((voice, index) => (
                    <Option key={index} value={voices.indexOf(voice)}>
                      {getVoiceDisplayName(voice)}
                    </Option>
                  ))}
                </Select>
                {currentLanguageVoices.length === 0 && (
                  <div className="text-red-500 text-xs mt-1">
                    No voices available for this language
                  </div>
                )}
              </div>

              <Divider />

              {/* Speed Control */}
              <div>
                <label className="block mb-2 font-bold">
                  Speed: {formatRate(rate)}
                </label>
                <Slider
                  min={0.5}
                  max={2}
                  step={0.25}
                  value={rate}
                  onChange={handleRateChange}
                  marks={{
                    0.5: "0.5x",
                    1: "1x",
                    1.5: "1.5x",
                    2: "2x",
                  }}
                />
              </div>

              {/* Pitch Control */}
              <div>
                <label className="block mb-2 font-bold">
                  Pitch: {pitch.toFixed(1)}
                </label>
                <Slider
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={pitch}
                  onChange={handlePitchChange}
                  marks={{
                    0.5: "Low",
                    1: "Normal",
                    1.5: "High",
                    2: "Very High",
                  }}
                />
              </div>

              {/* Volume Control */}
              <div>
                <label className="block mb-2 font-bold">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={handleVolumeChange}
                  marks={{
                    0: "0%",
                    0.5: "50%",
                    1: "100%",
                  }}
                />
              </div>
            </Space>
          </div>
        )}

        {/* Status */}
        {(isPlaying || isPaused) && (
          <div
            className={`p-2 rounded text-center text-xs ${
              isPaused
                ? "bg-orange-50 text-orange-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            {isPaused ? "⏸️ Paused" : "🔊 Playing..."}
            {selectedLanguage && (
              <span className="ml-2">
                ({LANGUAGES[selectedLanguage] || selectedLanguage})
              </span>
            )}
          </div>
        )}
      </Space>
    </Card>
  );
};

export default TextToSpeech;
