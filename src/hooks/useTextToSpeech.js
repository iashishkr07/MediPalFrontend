import { useState, useEffect, useRef, useCallback } from "react";

const useTextToSpeech = (options = {}) => {
  const {
    autoPlay = false,
    voice = null,
    rate = 1,
    pitch = 1,
    volume = 1,
    lang = "en-US",
  } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(voice);
  const utteranceRef = useRef(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      if (!selectedVoice && availableVoices.length > 0) {
        // Set default voice (prefer English)
        const englishVoice =
          availableVoices.find(
            (voice) => voice.lang.startsWith("en") && voice.default
          ) ||
          availableVoices.find((voice) => voice.lang.startsWith("en")) ||
          availableVoices[0];

        setSelectedVoice(englishVoice);
      }
    };

    // SpeechSynthesis voices are loaded asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, [selectedVoice]);

  const speak = useCallback(
    (text, customOptions = {}) => {
      if (!text || !selectedVoice) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.rate = customOptions.rate || rate;
      utterance.pitch = customOptions.pitch || pitch;
      utterance.volume = customOptions.volume || volume;
      utterance.lang = customOptions.lang || lang;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [selectedVoice, rate, pitch, volume, lang]
  );

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const setVoice = useCallback((voice) => {
    setSelectedVoice(voice);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && utteranceRef.current) {
      setTimeout(() => speak(utteranceRef.current.text), 500);
    }
  }, [autoPlay, speak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isPlaying,
    isPaused,
    voices,
    selectedVoice,
    setVoice,
    utterance: utteranceRef.current,
  };
};

export default useTextToSpeech;
