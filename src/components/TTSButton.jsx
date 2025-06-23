import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import { SoundOutlined, PauseOutlined, StopOutlined } from "@ant-design/icons";
import useTextToSpeech from "../hooks/useTextToSpeech";

const TTSButton = ({
  text,
  size = "middle",
  type = "default",
  icon = <SoundOutlined />,
  children = "Listen",
  className = "",
  tooltip = "Listen to this text",
  onStart,
  onEnd,
  onPause,
  onResume,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { speak, pause, resume, stop, isPlaying, isPaused } = useTextToSpeech();

  const handleClick = () => {
    if (!text) return;

    if (isPlaying) {
      if (isPaused) {
        resume();
        onResume?.();
      } else {
        pause();
        onPause?.();
      }
    } else {
      speak(text);
      onStart?.();
    }
  };

  const handleStop = (e) => {
    e.stopPropagation();
    stop();
    onEnd?.();
  };

  const getButtonIcon = () => {
    if (isPlaying) {
      return isPaused ? <SoundOutlined /> : <PauseOutlined />;
    }
    return icon;
  };

  const getButtonText = () => {
    if (isPlaying) {
      return isPaused ? "Resume" : "Pause";
    }
    return children;
  };

  const getTooltipText = () => {
    if (isPlaying) {
      return isPaused ? "Resume playback" : "Pause playback";
    }
    return tooltip;
  };

  return (
    <div
      className={`inline-flex items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip title={getTooltipText()}>
        <Button
          type={type}
          size={size}
          icon={getButtonIcon()}
          onClick={handleClick}
          disabled={!text}
          loading={isPlaying && !isPaused}
          {...props}
        >
          {getButtonText()}
        </Button>
      </Tooltip>

      {(isPlaying || isPaused) && isHovered && (
        <Tooltip title="Stop playback">
          <Button
            type="text"
            size={size}
            icon={<StopOutlined />}
            onClick={handleStop}
            className="ml-1"
            danger
          />
        </Tooltip>
      )}
    </div>
  );
};

export default TTSButton;
