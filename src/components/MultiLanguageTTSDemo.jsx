import React, { useState, useEffect } from "react";
import {
  Card,
  Space,
  Button,
  Input,
  Select,
  Typography,
  Divider,
  Alert,
  Tag,
  Switch,
} from "antd";
import {
  GlobalOutlined,
  SoundOutlined,
  KeyboardOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import TextToSpeech from "./TextToSpeech";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const MultiLanguageTTSDemo = () => {
  const [selectedText, setSelectedText] = useState("");
  const [customText, setCustomText] = useState("");
  const [highlightText, setHighlightText] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Enhanced sample texts with more languages
  const sampleTexts = {
    en: "Hello! Welcome to our multi-language text-to-speech system. This is a demonstration of how the system can speak in different languages with natural-sounding voices.",
    es: "¡Hola! Bienvenido a nuestro sistema de texto a voz multilingüe. Esta es una demostración de cómo el sistema puede hablar en diferentes idiomas con voces que suenan naturales.",
    fr: "Bonjour ! Bienvenue dans notre système de synthèse vocale multilingue. Ceci est une démonstration de la façon dont le système peut parler dans différentes langues avec des voix naturelles.",
    de: "Hallo! Willkommen bei unserem mehrsprachigen Text-zu-Sprache-System. Dies ist eine Demonstration, wie das System in verschiedenen Sprachen mit natürlich klingenden Stimmen sprechen kann.",
    it: "Ciao! Benvenuto nel nostro sistema di sintesi vocale multilingue. Questa è una dimostrazione di come il sistema può parlare in diverse lingue con voci che suonano naturali.",
    pt: "Olá! Bem-vindo ao nosso sistema de texto para fala multilíngue. Esta é uma demonstração de como o sistema pode falar em diferentes idiomas com vozes que soam naturais.",
    ru: "Привет! Добро пожаловать в нашу многоязычную систему преобразования текста в речь. Это демонстрация того, как система может говорить на разных языках с естественно звучащими голосами.",
    ja: "こんにちは！多言語テキスト読み上げシステムへようこそ。これは、システムが異なる言語で自然に聞こえる声で話すことができる方法のデモンストレーションです。",
    ko: "안녕하세요! 다국어 텍스트 음성 변환 시스템에 오신 것을 환영합니다. 이것은 시스템이 다양한 언어로 자연스럽게 들리는 목소리로 말할 수 있는 방법의 시연입니다.",
    zh: "你好！欢迎使用我们的多语言文本转语音系统。这是系统如何用不同语言以自然的声音说话的演示。",
    hi: "नमस्ते! हमारे बहुभाषी टेक्स्ट-टू-स्पीच सिस्टम में आपका स्वागत है। यह एक प्रदर्शन है कि सिस्टम विभिन्न भाषाओं में प्राकृतिक आवाज़ में कैसे बोल सकता है।",
    ar: "مرحباً! مرحباً بك في نظام تحويل النص إلى كلام متعدد اللغات. هذه مظاهرة لكيفية تحدث النظام بلغات مختلفة بأصوات طبيعية.",
    th: "สวัสดี! ยินดีต้อนรับสู่ระบบแปลงข้อความเป็นเสียงพูดหลายภาษา นี่คือการสาธิตวิธีการที่ระบบสามารถพูดในภาษาต่างๆ ด้วยเสียงที่ฟังดูเป็นธรรมชาติ",
    vi: "Xin chào! Chào mừng bạn đến với hệ thống chuyển đổi văn bản thành giọng nói đa ngôn ngữ. Đây là một cuộc trình diễn về cách hệ thống có thể nói bằng các ngôn ngữ khác nhau với giọng nói tự nhiên.",
    tr: "Merhaba! Çok dilli metin-konuşma sistemimize hoş geldiniz. Bu, sistemin farklı dillerde doğal seslerle nasıl konuşabileceğinin bir gösterimidir.",
    nl: "Hallo! Welkom bij ons meertalige tekst-naar-spraak systeem. Dit is een demonstratie van hoe het systeem in verschillende talen kan spreken met natuurlijk klinkende stemmen.",
    pl: "Cześć! Witamy w naszym wielojęzycznym systemie tekstu na mowę. To jest demonstracja tego, jak system może mówić w różnych językach z naturalnie brzmiącymi głosami.",
    sv: "Hej! Välkommen till vårt flerspråkiga text-till-tal system. Detta är en demonstration av hur systemet kan tala på olika språk med naturligt låtande röster.",
    da: "Hej! Velkommen til vores flersprogede tekst-til-tale system. Dette er en demonstration af, hvordan systemet kan tale på forskellige sprog med naturligt lyttende stemmer.",
    no: "Hei! Velkommen til vårt flerspråklige tekst-til-tale system. Dette er en demonstrasjon av hvordan systemet kan snakke på forskjellige språk med naturlig hørende stemmer.",
    fi: "Hei! Tervetuloa monikieliseen tekstistä puheeksi -järjestelmäämme. Tämä on esittely siitä, miten järjestelmä voi puhua eri kielillä luonnollisesti kuulostavilla äänillä.",
    cs: "Ahoj! Vítejte v našem vícejazyčném systému převodu textu na řeč. Toto je demonstrace toho, jak může systém mluvit v různých jazycích s přirozeně znějícími hlasy.",
    sk: "Ahoj! Vitajte v našom viacjazyčnom systéme prevodu textu na reč. Toto je demonštrácia toho, ako môže systém hovoriť v rôznych jazykoch s prirodzene znejúcimi hlasmi.",
    hu: "Szia! Üdvözöljük a többnyelvű szöveg-beszéd rendszerünkben. Ez egy bemutató arról, hogyan tud a rendszer különböző nyelveken természetes hangú hangokkal beszélni.",
    ro: "Bună! Bine ați venit la sistemul nostru multilingv text-la-vorbire. Aceasta este o demonstrație a modului în care sistemul poate vorbi în diferite limbi cu voci care sună natural.",
    bg: "Здравейте! Добре дошли в нашия многоезичен текст-към-реч система. Това е демонстрация на това как системата може да говори на различни езици с естествено звучащи гласове.",
    hr: "Pozdrav! Dobrodošli u naš višejezični sustav za pretvorbu teksta u govor. Ovo je demonstracija kako sustav može govoriti na različitim jezicima s prirodno zvučnim glasovima.",
    sr: "Здраво! Добро пожаловали у наш вишејезични систем за претварање текста у говор. Ово је демонстрација како систем може да говори на различитим језицима са природно звучаним гласовима.",
    sl: "Pozdravljeni! Dobrodošli v naš večjezični sistem za pretvorbo besedila v govor. To je demonstracija, kako lahko sistem govori v različnih jezikih z naravno zvenečimi glasovi.",
    et: "Tere! Teretulemast meie mitmekeelsesse tekst-kõne süsteemi. See on demonstreerimine, kuidas süsteem võib erinevates keeltes kõnelda looduslikult kõlavate häältedega.",
    lv: "Sveiki! Laipni lūdzam mūsu daudzvalodu teksta runāšanas sistēmā. Šī ir demonstrācija, kā sistēma var runāt dažādās valodās ar dabīgi skanējošām balsīm.",
    lt: "Sveiki! Sveiki atvykę į mūsų daugiakalbę tekstą į kalbą sistemą. Tai yra demonstracija, kaip sistema gali kalbėti įvairiomis kalbomis su natūraliai skambančiais balsais.",
    mt: "Bonġu! Merħba fis-sistema tagħna multilingwi tat-test għall-kitba. Din hija dimostrazzjoni ta 'kif is-sistema tista' titkellem f'lingwi differenti b'vokijiet li jisimgħu naturali.",
    el: "Γεια σας! Καλώς ήρθατε στο πολύγλωσσο σύστημα μετατροπής κειμένου σε ομιλία μας. Αυτή είναι μια επίδειξη του πώς το σύστημα μπορεί να μιλάει σε διαφορετικές γλώσσες με φυσικά ακούγοντες φωνές.",
    he: "שלום! ברוכים הבאים למערכת הטקסט-לדיבור הרב-לשונית שלנו. זו הדגמה של איך המערכת יכולה לדבר בשפות שונות עם קולות שנשמעים טבעיים.",
    id: "Halo! Selamat datang di sistem text-to-speech multibahasa kami. Ini adalah demonstrasi bagaimana sistem dapat berbicara dalam berbagai bahasa dengan suara yang terdengar alami.",
    ms: "Halo! Selamat datang ke sistem teks-ke-ucapan berbilang bahasa kami. Ini adalah demonstrasi bagaimana sistem boleh bercakap dalam pelbagai bahasa dengan suara yang kedengaran semula jadi.",
    tl: "Kamusta! Maligayang pagdating sa aming multi-language text-to-speech system. Ito ay isang demonstrasyon kung paano ang sistema ay maaaring magsalita sa iba't ibang wika na may natural na tunog na mga boses.",
    bn: "হ্যালো! আমাদের বহুভাষিক টেক্সট-টু-স্পিচ সিস্টেমে স্বাগতম। এটি একটি প্রদর্শনী যে কীভাবে সিস্টেমটি বিভিন্ন ভাষায় প্রাকৃতিক শোনা কণ্ঠে কথা বলতে পারে।",
    ur: "ہیلو! ہمارے ملٹی لینگویج ٹیکسٹ-ٹو-سپیچ سسٹم میں خوش آمدید۔ یہ ایک مظاہرہ ہے کہ سسٹم مختلف زبانوں میں قدرتی آوازوں کے ساتھ کیسے بول سکتا ہے۔",
    fa: "سلام! به سیستم چندزبانه متن به گفتار ما خوش آمدید. این یک نمایش از چگونگی صحبت کردن سیستم در زبان‌های مختلف با صداهای طبیعی است.",
    sw: "Hujambo! Karibu kwenye mfumo wetu wa maandishi-hadi-kusema wa lugha nyingi. Hii ni onyesho la jinsi mfumo unaweza kusema katika lugha tofauti na sauti zinazosikika kiasili.",
    af: "Hallo! Welkom by ons veeltalige teks-tot-spraak stelsel. Dit is 'n demonstrasie van hoe die stelsel in verskillende tale kan praat met natuurlik klinkende stemme.",
    zu: "Sawubona! Wamukelekile kuhlelo lethu lokuguqula umbhalo ube yinkulumo yezilimi eziningi. Lokhu kukhombisa indlela uhlelo olungakhuluma ngayo ngezilimi ezahlukene ngezwi elizwakala ngokwemvelo.",
    xh: "Molo! Wamkelekile kwinkqubo yethu yokuguqula umbhalo ube yinkulumo yezilimi ezininzi. Oku kukubonisa indlela inkqubo enokuthetha ngayo ngezilimi ezahlukeneyo ngezwi elizwakala ngokwendalo.",
    st: "Lumela! Rea u amohela ho sisteme ya rona ya ho fetola mongolo ho puo ya dipuo tse ngata. Sena ke pontsho ya hore na sisteme e ka bua joang ka dipuo tse fapaneng ka mantswe a utlwahalang ka tlhaho.",
    tn: "Dumela! Rea u amohela mo sisteme ya rona ya go fetola mongwalo go puo ya dipolelo tse di le mmalwa. Se ke pontsho ya gore na sisteme e ka bua jang ka dipolelo tse di farologaneng ka mantswe a a utlwahalang ka tlhago.",
    ss: "Sawubona! Wamukelekile kuhlelo lethu lokuguqula umbhalo ube yinkulumo yezilimi eziningi. Lokhu kukhombisa indlela uhlelo olungakhuluma ngayo ngezilimi ezahlukene ngezwi elizwakala ngokwemvelo.",
    ve: "Ndi masiari! Ni khou ni takalela kha tshumelo yashu ya u shandukisa ndemelelo kha luambo lwa nyambo dza fhiofhi. Hezwi ndi tshifanyiso tsha uri na tshumelo i nga amba hani kha nyambo dza fhambanaho na manwele a a pfa nga ndeme.",
    ts: "Avuxeni! Ni amukeriwa eka xivandla xa hina xa ku cinca xivuriso eka rito ra tindzimi to hambanahambana. Leswi i xikombiso xa ndlela xivandla lexi nga vulavula ngayo hi tindzimi to hambanahambana hi manwi ya ku twa hi ndlela ya ximunhu.",
    nr: "Sawubona! Wamukelekile kuhlelo lethu lokuguqula umbhalo ube yinkulumo yezilimi eziningi. Lokhu kukhombisa indlela uhlelo olungakhuluma ngayo ngezilimi ezahlukene ngezwi elizwakala ngokwemvelo.",
    nd: "Sawubona! Wamukelekile kuhlelo lethu lokuguqula umbhalo ube yinkulumo yezilimi eziningi. Lokhu kukhombisa indlela uhlelo olungakhuluma ngayo ngezilimi ezahlukene ngezwi elizwakala ngokwemvelo.",
  };

  // Language metadata with flags and descriptions
  const languageMetadata = {
    en: { flag: "🇺🇸", name: "English", region: "Global" },
    es: { flag: "🇪🇸", name: "Spanish", region: "Spain/Latin America" },
    fr: { flag: "🇫🇷", name: "French", region: "France/Global" },
    de: { flag: "🇩🇪", name: "German", region: "Germany/Austria/Switzerland" },
    it: { flag: "🇮🇹", name: "Italian", region: "Italy" },
    pt: { flag: "🇵🇹", name: "Portuguese", region: "Portugal/Brazil" },
    ru: { flag: "🇷🇺", name: "Russian", region: "Russia/CIS" },
    ja: { flag: "🇯🇵", name: "Japanese", region: "Japan" },
    ko: { flag: "🇰🇷", name: "Korean", region: "South Korea" },
    zh: { flag: "🇨🇳", name: "Chinese", region: "China" },
    hi: { flag: "🇮🇳", name: "Hindi", region: "India" },
    ar: { flag: "🇸🇦", name: "Arabic", region: "Middle East" },
    th: { flag: "🇹🇭", name: "Thai", region: "Thailand" },
    vi: { flag: "🇻🇳", name: "Vietnamese", region: "Vietnam" },
    tr: { flag: "🇹🇷", name: "Turkish", region: "Turkey" },
    nl: { flag: "🇳🇱", name: "Dutch", region: "Netherlands" },
    pl: { flag: "🇵🇱", name: "Polish", region: "Poland" },
    sv: { flag: "🇸🇪", name: "Swedish", region: "Sweden" },
    da: { flag: "🇩🇰", name: "Danish", region: "Denmark" },
    no: { flag: "🇳🇴", name: "Norwegian", region: "Norway" },
    fi: { flag: "🇫🇮", name: "Finnish", region: "Finland" },
    cs: { flag: "🇨🇿", name: "Czech", region: "Czech Republic" },
    sk: { flag: "🇸🇰", name: "Slovak", region: "Slovakia" },
    hu: { flag: "🇭🇺", name: "Hungarian", region: "Hungary" },
    ro: { flag: "🇷🇴", name: "Romanian", region: "Romania" },
    bg: { flag: "🇧🇬", name: "Bulgarian", region: "Bulgaria" },
    hr: { flag: "🇭🇷", name: "Croatian", region: "Croatia" },
    sr: { flag: "🇷🇸", name: "Serbian", region: "Serbia" },
    sl: { flag: "🇸🇮", name: "Slovenian", region: "Slovenia" },
    et: { flag: "🇪🇪", name: "Estonian", region: "Estonia" },
    lv: { flag: "🇱🇻", name: "Latvian", region: "Latvia" },
    lt: { flag: "🇱🇹", name: "Lithuanian", region: "Lithuania" },
    mt: { flag: "🇲🇹", name: "Maltese", region: "Malta" },
    el: { flag: "🇬🇷", name: "Greek", region: "Greece" },
    he: { flag: "🇮🇱", name: "Hebrew", region: "Israel" },
    id: { flag: "🇮🇩", name: "Indonesian", region: "Indonesia" },
    ms: { flag: "🇲🇾", name: "Malay", region: "Malaysia" },
    tl: { flag: "🇵🇭", name: "Filipino", region: "Philippines" },
    bn: { flag: "🇧🇩", name: "Bengali", region: "Bangladesh" },
    ur: { flag: "🇵🇰", name: "Urdu", region: "Pakistan" },
    fa: { flag: "🇮🇷", name: "Persian", region: "Iran" },
    sw: { flag: "🇹🇿", name: "Swahili", region: "East Africa" },
    af: { flag: "🇿🇦", name: "Afrikaans", region: "South Africa" },
    zu: { flag: "🇿🇦", name: "Zulu", region: "South Africa" },
    xh: { flag: "🇿🇦", name: "Xhosa", region: "South Africa" },
    st: { flag: "🇱🇸", name: "Southern Sotho", region: "Lesotho" },
    tn: { flag: "🇧🇼", name: "Tswana", region: "Botswana" },
    ss: { flag: "🇸🇿", name: "Swati", region: "Eswatini" },
    ve: { flag: "🇿🇦", name: "Venda", region: "South Africa" },
    ts: { flag: "🇿🇦", name: "Tsonga", region: "South Africa" },
    nr: { flag: "🇿🇦", name: "Southern Ndebele", region: "South Africa" },
    nd: { flag: "🇿🇼", name: "Northern Ndebele", region: "Zimbabwe" },
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      )
        return;

      switch (event.key.toLowerCase()) {
        case " ":
          event.preventDefault();
          // Toggle play/pause
          break;
        case "escape":
          event.preventDefault();
          // Stop
          break;
        case "h":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setShowKeyboardShortcuts(!showKeyboardShortcuts);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [showKeyboardShortcuts]);

  const handleSampleSelect = (languageCode) => {
    setSelectedText(sampleTexts[languageCode] || "");
  };

  const handleCustomTextChange = (e) => {
    setCustomText(e.target.value);
  };

  const clearText = () => {
    setSelectedText("");
    setCustomText("");
  };

  const getCurrentText = () => selectedText || customText;

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <Card>
        <Title level={2}>
          <GlobalOutlined /> Multi-Language Text-to-Speech Demo
        </Title>

        <Paragraph>
          This enhanced demo showcases the improved TextToSpeech component with
          text highlighting, progress tracking, user preference saving, and
          support for 50+ languages. The system automatically detects the
          language of the text and selects an appropriate voice.
        </Paragraph>

        {/* Feature Alert */}
        <Alert
          message="New Features Available!"
          description="Text highlighting, progress tracking, preference saving, and keyboard shortcuts (Ctrl+H to show/hide shortcuts)"
          type="info"
          showIcon
          style={{ marginBottom: "16px" }}
        />

        <Divider />

        {/* Sample Texts Section */}
        <Card
          title={
            <Space>
              <span>Sample Texts</span>
              <Tag color="blue">
                {Object.keys(sampleTexts).length} Languages
              </Tag>
            </Space>
          }
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <strong>Choose a sample text:</strong>
            </div>
            <Select
              style={{ width: "300px" }}
              placeholder="Select a language"
              onChange={handleSampleSelect}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {Object.entries(languageMetadata).map(([code, meta]) => (
                <Option key={code} value={code}>
                  {meta.flag} {meta.name} ({code.toUpperCase()}) - {meta.region}
                </Option>
              ))}
            </Select>

            {selectedText && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f0f8ff",
                  borderRadius: "6px",
                  border: "1px solid #d6e4ff",
                  marginTop: "8px",
                }}
              >
                <strong>Selected text:</strong>
                <div style={{ marginTop: "8px", lineHeight: "1.5" }}>
                  {selectedText}
                </div>
              </div>
            )}
          </Space>
        </Card>

        {/* Custom Text Section */}
        <Card title="Custom Text" size="small" style={{ marginBottom: "16px" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <strong>Or enter your own text:</strong>
            </div>
            <TextArea
              rows={4}
              placeholder="Enter text in any language you want to hear..."
              value={customText}
              onChange={handleCustomTextChange}
              style={{ width: "100%" }}
            />
          </Space>
        </Card>

        {/* Options Section */}
        <Card title="Options" size="small" style={{ marginBottom: "16px" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <strong>Text Highlighting:</strong>
              <Switch
                checked={highlightText}
                onChange={setHighlightText}
                style={{ marginLeft: "8px" }}
              />
              <span
                style={{ marginLeft: "8px", fontSize: "12px", color: "#666" }}
              >
                Highlight words as they're being spoken
              </span>
            </div>
          </Space>
        </Card>

        {/* Clear Button */}
        <div style={{ marginBottom: "16px" }}>
          <Button onClick={clearText} type="default">
            Clear All Text
          </Button>
        </div>

        {/* Text-to-Speech Component */}
        {getCurrentText() && (
          <Card
            title={
              <>
                <SoundOutlined /> Text-to-Speech Controls
              </>
            }
            size="small"
          >
            <TextToSpeech
              text={getCurrentText()}
              showControls={true}
              autoPlay={false}
              highlightText={highlightText}
              showProgress={true}
            />
          </Card>
        )}

        {/* Keyboard Shortcuts */}
        {showKeyboardShortcuts && (
          <Card
            title="Keyboard Shortcuts"
            size="small"
            style={{ marginTop: "16px" }}
          >
            <Space direction="vertical">
              <div>
                <strong>Space:</strong> Play/Pause
              </div>
              <div>
                <strong>Escape:</strong> Stop
              </div>
              <div>
                <strong>Ctrl+H:</strong> Show/Hide this help
              </div>
            </Space>
          </Card>
        )}

        {/* Instructions */}
        <Card title="How to Use" size="small" style={{ marginTop: "16px" }}>
          <Space direction="vertical">
            <Paragraph>
              <strong>1.</strong> Choose a sample text from the dropdown above,
              or enter your own text in the text area.
            </Paragraph>
            <Paragraph>
              <strong>2.</strong> The system will automatically detect the
              language of your text and select an appropriate voice.
            </Paragraph>
            <Paragraph>
              <strong>3.</strong> Click the "Play" button to hear the text
              spoken in the detected language.
            </Paragraph>
            <Paragraph>
              <strong>4.</strong> Use the "Settings" button to manually select a
              different language or voice, adjust speed, pitch, and volume.
            </Paragraph>
            <Paragraph>
              <strong>5.</strong> Enable text highlighting to see words
              highlighted as they're spoken.
            </Paragraph>
            <Paragraph>
              <strong>6.</strong> Your preferences (language, speed, pitch,
              volume) will be saved automatically.
            </Paragraph>
            <Paragraph>
              <strong>Note:</strong> The available voices depend on your
              operating system and browser. Some languages may not have voices
              available on your system.
            </Paragraph>
          </Space>
        </Card>
      </Card>
    </div>
  );
};

export default MultiLanguageTTSDemo;
