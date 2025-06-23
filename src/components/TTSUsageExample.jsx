import React, { useState } from "react";
import { Card, Space, Button, Input, Typography, Divider, Alert } from "antd";
import { SoundOutlined, InfoCircleOutlined } from "@ant-design/icons";
import TextToSpeech from "./TextToSpeech";

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

const TTSUsageExample = () => {
  const [text, setText] = useState("");

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Card>
        <Title level={3}>
          <SoundOutlined /> Text-to-Speech Usage Examples
        </Title>

        <Alert
          message="Multi-Language Support"
          description="The enhanced TextToSpeech component now supports automatic language detection and manual language selection for text in any language."
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: "16px" }}
        />

        <Divider />

        {/* Basic Usage */}
        <Card title="Basic Usage" size="small" style={{ marginBottom: "16px" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text>Enter any text in any language:</Text>
            <TextArea
              rows={3}
              placeholder="Type text in any language here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {text && (
              <TextToSpeech text={text} showControls={true} autoPlay={false} />
            )}
          </Space>
        </Card>

        <Divider />

        {/* Auto-play Example */}
        <Card
          title="Auto-play Example"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <TextToSpeech
            text="This text will automatically start speaking when the component loads."
            showControls={true}
            autoPlay={true}
          />
        </Card>

        <Divider />

        {/* Minimal Controls */}
        <Card
          title="Minimal Controls"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <TextToSpeech
            text="This example shows the component with minimal controls."
            showControls={true}
            autoPlay={false}
            className="minimal-tts"
          />
        </Card>

        <Divider />

        {/* Code Example */}
        <Card title="Code Example" size="small">
          <pre
            style={{
              backgroundColor: "#f5f5f5",
              padding: "12px",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {`import TextToSpeech from './components/TextToSpeech';

// Basic usage
<TextToSpeech 
  text="Your text here"
  showControls={true}
  autoPlay={false}
/>

// With callbacks
<TextToSpeech 
  text="Text in any language"
  onStart={() => console.log('Started speaking')}
  onEnd={() => console.log('Finished speaking')}
  onPause={() => console.log('Paused')}
  onResume={() => console.log('Resumed')}
/>

// Auto-play
<TextToSpeech 
  text="Auto-playing text"
  autoPlay={true}
  showControls={true}
/>`}
          </pre>
        </Card>
      </Card>
    </div>
  );
};

export default TTSUsageExample;
