import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Space,
  Typography,
  Divider,
  message,
  Select,
} from "antd";
import {
  SoundOutlined,
  FileTextOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import TextToSpeech from "../components/TextToSpeech";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

const TextToSpeechDemo = () => {
  const [customText, setCustomText] = useState("");
  const [selectedExample, setSelectedExample] = useState("");

  const examples = {
    welcome: {
      title: "Welcome Message (English)",
      text: "Welcome to our medical application. This text-to-speech feature helps make medical information more accessible to everyone, including those with visual impairments or reading difficulties.",
    },
    medical: {
      title: "Medical Instructions (English)",
      text: "Please take your medication as prescribed by your doctor. Take one tablet twice daily with food. Do not skip doses and complete the full course of treatment. Contact your healthcare provider if you experience any side effects.",
    },
    appointment: {
      title: "Appointment Reminder (English)",
      text: "This is a reminder for your medical appointment scheduled for tomorrow at 2:00 PM. Please arrive 15 minutes early to complete any necessary paperwork. Don't forget to bring your ID and insurance card.",
    },
    health: {
      title: "Health Tips (English)",
      text: "Maintain a healthy lifestyle by eating a balanced diet, exercising regularly, getting adequate sleep, and managing stress. Regular check-ups with your healthcare provider are important for preventive care.",
    },
    spanish: {
      title: "Medical Instructions (Spanish)",
      text: "Por favor tome su medicamento según lo recetado por su médico. Tome una tableta dos veces al día con comida. No omita dosis y complete el tratamiento completo. Contacte a su proveedor de atención médica si experimenta efectos secundarios.",
    },
    french: {
      title: "Health Tips (French)",
      text: "Maintenez un mode de vie sain en mangeant une alimentation équilibrée, en faisant de l'exercice régulièrement, en dormant suffisamment et en gérant le stress. Les examens réguliers avec votre fournisseur de soins de santé sont importants pour les soins préventifs.",
    },
    german: {
      title: "Appointment Reminder (German)",
      text: "Dies ist eine Erinnerung an Ihren Arzttermin, der für morgen um 14:00 Uhr geplant ist. Bitte kommen Sie 15 Minuten früher, um alle notwendigen Unterlagen auszufüllen. Vergessen Sie nicht, Ihren Ausweis und Ihre Versicherungskarte mitzubringen.",
    },
    japanese: {
      title: "Welcome Message (Japanese)",
      text: "医療アプリケーションへようこそ。このテキスト読み上げ機能により、視覚障害者や読書困難のある方を含むすべての人にとって医療情報がよりアクセスしやすくなります。",
    },
    chinese: {
      title: "Health Tips (Chinese)",
      text: "通过均衡饮食、定期锻炼、充足睡眠和管理压力来保持健康的生活方式。定期与您的医疗保健提供者进行体检对预防保健很重要。",
    },
    hindi: {
      title: "Medical Instructions (Hindi)",
      text: "कृपया अपने डॉक्टर द्वारा निर्धारित अनुसार अपनी दवा लें। भोजन के साथ दिन में दो बार एक गोली लें। खुराक न छोड़ें और पूरा उपचार पूरा करें। यदि आपको कोई दुष्प्रभाव होता है तो अपने स्वास्थ्य देखभाल प्रदाता से संपर्क करें।",
    },
    arabic: {
      title: "Appointment Reminder (Arabic)",
      text: "هذا تذكير بموعدك الطبي المقرر غداً الساعة 2:00 مساءً. يرجى الوصول قبل 15 دقيقة لإكمال أي أوراق ضرورية. لا تنسى إحضار هويتك وبطاقة التأمين.",
    },
  };

  const handleExampleSelect = (key) => {
    setSelectedExample(key);
    setCustomText(examples[key].text);
  };

  const handleSpeakCustom = () => {
    if (!customText.trim()) {
      message.warning("Please enter some text to speak");
      return;
    }
    // The TextToSpeech component will handle the speaking
  };

  const handleClear = () => {
    setCustomText("");
    setSelectedExample("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="mb-6">
        <div className="text-center mb-6">
          <SoundOutlined
            style={{ fontSize: "48px", color: "#1890ff", marginBottom: "16px" }}
          />
          <Title level={2}>Multi-Language Text-to-Speech Demo</Title>
          <Paragraph>
            Experience our advanced text-to-speech functionality with automatic
            language detection, voice selection, speed control, and customizable
            settings. Perfect for making medical information more accessible in
            multiple languages.
          </Paragraph>
        </div>
      </Card>

      {/* Example Texts */}
      <Card title="Multi-Language Examples" className="mb-6">
        <Space wrap>
          {Object.entries(examples).map(([key, example]) => (
            <Button
              key={key}
              type={selectedExample === key ? "primary" : "default"}
              icon={<FileTextOutlined />}
              onClick={() => handleExampleSelect(key)}
            >
              {example.title}
            </Button>
          ))}
        </Space>

        {selectedExample && (
          <div className="mt-4">
            <Card size="small" style={{ backgroundColor: "#f6ffed" }}>
              <Text strong>{examples[selectedExample].title}:</Text>
              <Paragraph className="mt-2">
                {examples[selectedExample].text}
              </Paragraph>
            </Card>
          </div>
        )}
      </Card>

      {/* Custom Text Input */}
      <Card title="Custom Text (Any Language)" className="mb-6">
        <Space direction="vertical" style={{ width: "100%" }}>
          <TextArea
            rows={6}
            placeholder="Enter your own text in any language here to convert to speech..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            showCount
            maxLength={1000}
          />
          <Space>
            <Button
              type="primary"
              icon={<SoundOutlined />}
              onClick={handleSpeakCustom}
              disabled={!customText.trim()}
            >
              Play
            </Button>
            <Button onClick={handleClear}>Clear</Button>
          </Space>
        </Space>
      </Card>

      {/* Text-to-Speech Controls */}
      {customText && (
        <Card title="Text-to-Speech Controls" className="mb-6">
          <TextToSpeech
            text={customText}
            onStart={() => message.success("Started speaking")}
            onEnd={() => message.info("Finished speaking")}
            onPause={() => message.info("Paused")}
            onResume={() => message.info("Resumed")}
          />
        </Card>
      )}

      {/* Features Overview */}
      <Card title="Enhanced Features" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Title level={4}>🌍 Multi-Language Support</Title>
            <Paragraph>
              Automatic language detection and support for text in any language.
              The system will automatically select the appropriate voice for the
              detected language.
            </Paragraph>
          </div>
          <div>
            <Title level={4}>🎙️ Voice Selection</Title>
            <Paragraph>
              Choose from multiple voices and languages available on your
              system. Perfect for different preferences and accessibility needs.
            </Paragraph>
          </div>
          <div>
            <Title level={4}>⚡ Speed Control</Title>
            <Paragraph>
              Adjust speech speed from 0.5x (slow) to 2x (very fast). Great for
              learning or quick listening.
            </Paragraph>
          </div>
          <div>
            <Title level={4}>🎵 Pitch & Volume</Title>
            <Paragraph>
              Customize pitch and volume levels to suit your hearing preferences
              and environmental conditions.
            </Paragraph>
          </div>
          <div>
            <Title level={4}>⏯️ Playback Controls</Title>
            <Paragraph>
              Play, pause, resume, and stop functionality with visual feedback
              and status indicators.
            </Paragraph>
          </div>
          <div>
            <Title level={4}>🔍 Language Detection</Title>
            <Paragraph>
              Automatically detects the language of your text and selects the
              most appropriate voice, or manually override the selection.
            </Paragraph>
          </div>
        </div>
      </Card>

      {/* Accessibility Information */}
      <Card title="Accessibility Benefits" className="mb-6">
        <div className="space-y-4">
          <div>
            <Title level={4}>👁️ Visual Impairments</Title>
            <Paragraph>
              Text-to-speech makes medical information accessible to users with
              visual impairments, allowing them to "read" medical reports and
              instructions independently.
            </Paragraph>
          </div>
          <div>
            <Title level={4}>📚 Reading Difficulties</Title>
            <Paragraph>
              Helps users with dyslexia or other reading difficulties by
              converting complex medical text into clear, audible speech.
            </Paragraph>
          </div>
          <div>
            <Title level={4}>🌍 Multilingual Support</Title>
            <Paragraph>
              Support for multiple languages and accents makes medical
              information accessible to diverse populations and non-native
              speakers.
            </Paragraph>
          </div>
          <div>
            <Title level={4}>🎧 Hands-Free Operation</Title>
            <Paragraph>
              Allows users to listen to medical information while performing
              other tasks, perfect for busy healthcare environments.
            </Paragraph>
          </div>
          <div>
            <Title level={4}>🔤 Language Learning</Title>
            <Paragraph>
              Helps users learn medical terminology in different languages by
              providing accurate pronunciation and speech patterns.
            </Paragraph>
          </div>
        </div>
      </Card>

      {/* Technical Information */}
      <Card title="Technical Information" className="mb-6">
        <div className="space-y-4">
          <div>
            <Title level={4}>🔧 How It Works</Title>
            <Paragraph>
              The component uses the Web Speech API's SpeechSynthesis interface
              to convert text to speech. It automatically detects the language
              of the input text using character pattern recognition and selects
              an appropriate voice from the available system voices.
            </Paragraph>
          </div>
          <div>
            <Title level={4}>🌐 Supported Languages</Title>
            <Paragraph>
              Supports all languages that have voices installed on your
              operating system. Common languages include English, Spanish,
              French, German, Italian, Portuguese, Russian, Japanese, Korean,
              Chinese, Hindi, Arabic, and many more.
            </Paragraph>
          </div>
          <div>
            <Title level={4}>💻 Browser Compatibility</Title>
            <Paragraph>
              Works in all modern browsers that support the Web Speech API,
              including Chrome, Firefox, Safari, and Edge. Voice availability
              depends on your operating system and browser configuration.
            </Paragraph>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TextToSpeechDemo;
