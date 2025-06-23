import React, { useState } from "react";
import { motion } from "framer-motion";
import TextToSpeech from "../components/TextToSpeech";
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_METADATA,
  getAvailableLanguages,
  translateText,
} from "../translate";

const MultiLanguageDemo = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [demoText, setDemoText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  // Sample medical text in different languages
  const sampleTexts = {
    en: "Welcome to MediPal AI. This is a comprehensive medical analysis system that can help you understand your health reports and medical images. Upload your medical documents and get instant AI-powered insights.",
    hi: "मेडीपाल AI में आपका स्वागत है। यह एक व्यापक चिकित्सीय विश्लेषण प्रणाली है जो आपको अपनी स्वास्थ्य रिपोर्ट और चिकित्सीय छवियों को समझने में मदद कर सकती है। अपने चिकित्सीय दस्तावेज़ अपलोड करें और तुरंत AI-संचालित अंतर्दृष्टि प्राप्त करें।",
    bn: "মেডিপাল AI-এ স্বাগতম। এটি একটি বিস্তৃত চিকিৎসা বিশ্লেষণ সিস্টেম যা আপনাকে আপনার স্বাস্থ্য রিপোর্ট এবং চিকিৎসা ছবি বুঝতে সাহায্য কর সকতে পারে। আপনার চিকিৎসা নথি অপলोড করুন এবং তাৎক্ষণিক AI-চালিত অন্তর্দৃষ্টি পান।",
    te: "మెడిపాల్ AI కి స్వాగతం. ఇది మీ ఆరోగ్య నివేదికలు మరియు వైద్య చిత్రాలను అర్థం చేసుకోవడానికి మీకు సహాయపడే సమగ్ర వైద్య విశ్లేషణ వ్యవస్థ. మీ వైద్య పత్రాలను అప్‌లోడ్ చేసి తక్షణ AI-ఆధారిత అంతర్దృష్టులను పొందండి.",
    ta: "மெடிபால் AI க்கு வரவேற்கிறோம். இது உங்கள் சுகாதார அறிக்கைகள் மற்றும் மருத்துவ படங்களைப் புரிந்துகொள்ள உதவும் ஒரு விரிவான மருத்துவ பகுப்பாய்வு அமைப்பு. உங்கள் மருத்துவ ஆவணங்களை பதிவேற்றி உடனடி AI-ஆல் இயக்கப்படும் நுண்ணறிவுகளைப் பெறுங்கள்.",
    mr: "मेडिपाल AI मध्ये आपले स्वागत आहे. ही एक व्यापक वैद्यकीय विश्लेषण प्रणाली आहे जी आपल्याला आपल्या आरोग्य अहवाल आणि वैद्यकीय प्रतिमा समजून घेण्यास मदत करू शकते। आपले वैद्यकीय दस्तऐवज अपलोड करा आणि त्वरित AI-चालित अंतर्दृष्टी मिळवा।",
    gu: "મેડિપાલ AI માં આપનું સ્વાગત છે. આ એક વ્યાપક તબીબી વિશ્લેષણ સિસ્ટમ છે જે તમને તમારા સ્વાસ્થ્ય અહેવાલો અને તબીબી છબીઓ સમજવામાં મદદ કરી શકે છે. તમારા તબીબી દસ્તાવેજો અપલોડ કરો અને ત્વરિત AI-ચાલિત અંતર્દૃષ્ટિ મેળવો.",
    kn: "ಮೆಡಿಪಾಲ್ AI ಗೆ ಸುಸ್ವಾಗತ. ಇದು ನಿಮ್ಮ ಆರೋಗ್ಯ ವರದಿಗಳು ಮತ್ತು ವೈದ್ಯಕೀಯ ಚಿತ್ರಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡಬಹುದಾದ ಸಮಗ್ರ ವೈದ್ಯಕೀಯ ವಿಶ್ಲೇಷಣೆ ವ್ಯವಸ್ಥೆ. ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ತ್ವರಿತ AI-ಆಧಾರಿತ ಒಳನೋಟಗಳನ್ನು ಪಡೆಯಿರಿ.",
    ml: "മെഡിപാൽ AI-ലേക്ക് സ്വാഗതം. ഇത് നിങ്ങളുടെ ആരോഗ്യ റിപ്പോർട്ടുകളും മെഡിക്കൽ ചിത്രങ്ങളും മനസ്സിലാക്കാൻ സഹായിക്കാവുന്ന ഒരു സമഗ്ര മെഡിക്കൽ വിശകലന സിസ്റ്റമാണ്. നിങ്ങളുടെ മെഡിക്കൽ രേഖകൾ അപ്‌ലോഡ് ചെയ്ത് തൽക്ഷണ AI-ചാലിത ഉൾക്കാഴ്ചകൾ നേടുക.",
    pa: "ਮੇਡੀਪਾਲ AI ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਇਹ ਇੱਕ ਵਿਆਪਕ ਡਾਕਟਰੀ ਵਿਸ਼ਲੇਸ਼ਣ ਸਿਸਟਮ ਹੈ ਜੋ ਤੁਹਾਨੂੰ ਤੁਹਾਡੀਆਂ ਸਿਹਤ ਰਿਪੋਰਟਾਂ ਅਤੇ ਡਾਕਟਰੀ ਤਸਵੀਰਾਂ ਨੂੰ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ। ਆਪਣੇ ਡਾਕਟਰੀ ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ ਕਰੋ ਅਤੇ ਤੁਰੰਤ AI-ਚਾਲਿਤ ਸੂਝਾਂ ਪ੍ਰਾਪਤ ਕਰੋ।",
    or: "ମେଡିପାଲ AI ରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ଏହା ଏକ ସମ୍ପୂର୍ଣ୍ଣ ଚିକିତ୍ସା ବିଶ୍ଳେଷଣ ସିଷ୍ଟମ ଯାହା ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ରିପୋର୍ଟ ଏବଂ ଚିକିତ୍ସା ଛବିଗୁଡ଼ିକୁ ବୁଝିବାରେ ସାହାଯ୍ୟ କରିପାରେ। ଆପଣଙ୍କ ଚିକିତ୍ସା ଦଲିଲଗୁଡ଼ିକ ଅପଲୋଡ୍ କରନ୍ତୁ ଏବଂ ତତକ୍ଷଣାତ୍ AI-ଚାଳିତ ଅନ୍ତର୍ଦୃଷ୍ଟି ପାଆନ୍ତୁ।",
    as: "মেডিপাল AI-ত আপোনাক স্বাগতম। ই এটা বিস্তৃত চিকিৎসা বিশ্লেষণ ব্যৱস্থা যিয়ে আপোনাক আপোনাৰ স্বাস্থ্য প্ৰতিবেদন আৰু চিকিৎসা ছবিসমূহ বুজিবলৈ সহায় কৰিব পাৰে। আপোনাৰ চিকিৎসা নথিপত্ৰসমূহ আপল'ড কৰক আৰু তাৎক্ষণিক AI-চালিত অন্তৰ্দৃষ্টি লাভ কৰক।",
    ur: "میڈیپال AI میں آپ کا خیر مقدم ہے۔ یہ ایک جامع طبی تجزیہ نظام ہے جو آپ کو اپنی صحت کی رپورٹس اور طبی تصاویر کو سمجھنے میں مدد کر سکتا ہے۔ اپنے طبی دستاویزات اپ لوڈ کریں اور فوری AI-چلائی گئی بصیرت حاصل کریں۔",
    sa: "मेदिपाल AI मध्ये आपले स्वागत आहे। ही एक व्यापक वैद्यकीय विश्लेषण प्रणाली आहे जी आपल्याला आपल्या आरोग्य अहवाल आणि वैद्यकीय प्रतिमा समजून घेण्यास मदत करू शकते। आपले वैद्यकीय दस्तऐवज अपलोड करा आणि त्वरित AI-चालित अंतर्दृष्टी मिळवा।",
    ne: "मेडिपाल AI मा तपाईंको स्वागत छ। यो एक व्यापक चिकित्सा विश्लेषण प्रणाली हो जसले तपाईंलाई तपाईंको स्वास्थ्य रिपोर्ट र चिकित्सा छविहरू बुझ्न मद्दत गर्न सक्छ। तपाईंको चिकित्सा कागजातहरू अपलोड गर्नुहोस् र तत्काल AI-चालित अन्तर्दृष्टि प्राप्त गर्नुहोस्।",
    si: "මෙඩිපාල් AI වෙත සාදරයෙන් පිළිගනිමු. මෙය ඔබේ සෞඛ්‍ය වාර්තා සහ වෛද්‍ය රූප තේරුම් ගැනීමට උපකාර විය හැකි සවිස්තරාත්මක වෛද්‍ය විශ්ලේෂණ පද්ධතියකි. ඔබේ වෛද්‍ය ලේඛන උඩුගත කර ත්වරිත AI-ධාවිත අවබෝධය ලබා ගන්න.",
    my: "MediPal AI မှ ကြိုဆိုပါတယ်။ ဒါဟာ သင့်ရဲ့ ကျန်းမာရေး အစီရင်ခံစာတွေနဲ့ ဆေးဘက်ဆိုင်ရာ ပုံရိပ်တွေကို နားလည်ဖို့ ကူညီနိုင်တဲ့ ကျယ်ပြန့်တဲ့ ဆေးဘက်ဆိုင်ရာ ခွဲခြမ်းစိတ်ဖြာမှု စနစ်တစ်ခုပါ။ သင့်ရဲ့ ဆေးဘက်ဆိုင်ရာ စာရွက်စာတမ်းတွေကို အပ်လုဒ်လုပ်ပြီး ချက်ချင်း AI-မောင်းနှင်တဲ့ ထိုးထွင်းသိမြင်မှုတွေကို ရယူပါ။",
    th: "ยินดีต้อนรับสู่ MediPal AI นี่คือระบบวิเคราะห์ทางการแพทย์ที่ครอบคลุมซึ่งสามารถช่วยให้คุณเข้าใจรายงานสุขภาพและภาพทางการแพทย์ของคุณ อัปโหลดเอกสารทางการแพทย์ของคุณและรับข้อมูลเชิงลึกที่ขับเคลื่อนด้วย AI ทันที",
    km: "សូមស្វាគមន៍មកកាន់ MediPal AI។ នេះគឺជាប្រព័ន្ធវិភាគវេជ្ជសាស្ត្រដែលមានគ្របដណ្តប់ដែលអាចជួយអោយអ្នកយល់ដឹងអំពីរបាយការណ៍សុខភាព និងរូបភាពវេជ្ជសាស្ត្ររបស់អ្នក។ អាប់ឡូដឯកសារវេជ្ជសាស្ត្ររបស់អ្នក និងទទួលបានការយល់ដឹងដែលដំណើរការដោយ AI ភ្លាមៗ",
    lo: "ຍິນດີຕ້ອນຮັບສູ່ MediPal AI. ນີ້ແມ່ນລະບົບການວິເຄາະທາງການແພດທີ່ຄົບຖ້ວນທີ່ສາມາດຊ່ວຍໃຫ້ທ່ານເຂົ້າໃຈບົດລາຍງານສຸຂະພາບ ແລະຮູບພາບທາງການແພດຂອງທ່ານ. ອັບໂຫລດເອກະສານທາງການແພດຂອງທ່ານ ແລະຮັບຄວາມເຂົ້າໃຈທີ່ຂັບເຄື່ອນໂດຍ AI ທັນທີ",
  };

  const handleLanguageChange = async (newLanguage) => {
    setSelectedLanguage(newLanguage);

    // Get sample text for the selected language
    const text = sampleTexts[newLanguage] || sampleTexts.en;
    setDemoText(text);
    setTranslatedText(text);
  };

  const handleTranslate = async () => {
    if (!demoText) return;

    try {
      const translated = await translateText(demoText, selectedLanguage);
      setTranslatedText(translated);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText(demoText);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c2f] via-[#23284a] to-[#181c2f] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            🌐 Multi-Language Medical AI Demo
          </h1>
          <p className="text-xl text-cyan-200">
            Experience MediPal AI in {Object.keys(SUPPORTED_LANGUAGES).length}{" "}
            languages
          </p>
        </motion.div>

        {/* Language Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-cyan-400/30">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Select Language
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {getAvailableLanguages().map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${
                    selectedLanguage === lang.code
                      ? "bg-cyan-500 border-cyan-400 text-white"
                      : "bg-white/10 border-cyan-400/30 text-cyan-200 hover:bg-white/20"
                  }`}
                >
                  <div className="text-2xl mb-1">{lang.flag}</div>
                  <div className="text-sm font-medium">{lang.name}</div>
                  <div className="text-xs opacity-75">{lang.region}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Demo Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Text Input */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-cyan-400/30">
            <h3 className="text-xl font-bold mb-4">Input Text</h3>
            <textarea
              value={demoText}
              onChange={(e) => setDemoText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-32 p-3 bg-white/20 border border-cyan-400/30 rounded-lg text-white placeholder-cyan-300 resize-none"
            />
            <button
              onClick={handleTranslate}
              className="mt-3 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Translate
            </button>
          </div>

          {/* Translated Text */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-cyan-400/30">
            <h3 className="text-xl font-bold mb-4">
              {LANGUAGE_METADATA[selectedLanguage]?.name || selectedLanguage}{" "}
              Translation
            </h3>
            <div className="w-full h-32 p-3 bg-white/20 border border-cyan-400/30 rounded-lg text-white overflow-y-auto">
              {translatedText || "Translation will appear here..."}
            </div>

            {/* Text-to-Speech */}
            {translatedText && (
              <div className="mt-4">
                <TextToSpeech
                  text={translatedText}
                  autoPlay={false}
                  showControls={true}
                  className="bg-white/10 border border-cyan-400/30 rounded-lg p-3"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Language Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-cyan-400/30"
        >
          <h3 className="text-xl font-bold mb-4 text-center">
            Language Coverage
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-cyan-500/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-cyan-400">
                {Object.keys(SUPPORTED_LANGUAGES).length}
              </div>
              <div className="text-sm">Total Languages</div>
            </div>
            <div className="bg-green-500/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">20</div>
              <div className="text-sm">Asian Languages</div>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400">15</div>
              <div className="text-sm">Indian Languages</div>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-400">5</div>
              <div className="text-sm">Southeast Asian</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MultiLanguageDemo;
