const express = require('express');
const router = express.Router();

// Rule-based responses for agriculture assistant
const getRuleBasedResponse = (message, language = 'en') => {
  const lowerMessage = message.toLowerCase();
  
  // Market price queries
  if (lowerMessage.includes('price') || lowerMessage.includes('rate') || lowerMessage.includes('market') || lowerMessage.includes('mandi') || lowerMessage.includes('भाव') || lowerMessage.includes('कीमत')) {
    const responses = {
      en: 'Current market prices are available in the Market section. You can check real-time prices for crops like Wheat, Rice, Cotton, Maize, Tomato, Onion, and Potato. Prices vary by location and market.',
      hi: 'वर्तमान बाजार भाव मार्केट सेक्शन में उपलब्ध हैं। आप गेहूं, चावल, कपास, मक्का, टमाटर, प्याज और आलू जैसी फसलों के वास्तविक समय कीमतें देख सकते हैं। कीमतें स्थान और बाजार के अनुसार अलग-अलग होती हैं।',
      pa: 'ਵਰਤਮਾਨ ਬਾਜ਼ਾਰ ਦਰਾਂ ਮਾਰਕੀਟ ਸੈਕਸ਼ਨ ਵਿੱਚ ਉਪਲਬਧ ਹਨ। ਤੁਸੀਂ ਕਣਕ, ਚਾਵਲ, ਕਪਾਹ, ਮੱਕੀ, ਟਮਾਟਰ, ਪਿਆਜ਼ ਅਤੇ ਆਲੂ ਵਰਗੀਆਂ ਫਸਲਾਂ ਦੀਆਂ ਅਸਲ ਸਮੇਂ ਕੀਮਤਾਂ ਦੇਖ ਸਕਦੇ ਹੋ। ਕੀਮਤਾਂ ਥਾਂ ਅਤੇ ਬਾਜ਼ਾਰ ਦੇ ਅਨੁਸਾਰ ਵੱਖਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।',
      te: 'ప్రస్తుత మార్కెట్ ధరలు మార్కెట్ విభాగంలో అందుబాటులో ఉన్నాయి. మీరు గోధుం, వరి, పత్తి, మొక్కజోళ్లు, టమాటాలు, ఉల్లిపాయలు మరియు బంగాలదుంగలు వంటి పంటల యొక్క వాస్తవ-కాలిక ధరలను తనిఖీ చేయవచ్చు. ధరలు స్థానం మరియు మార్కెట్ను బట్టి మారుతూ ఉంటాయి।',
      mr: 'वर्तमान बाजार भाव बाजार विभागात उपलब्ध आहेत. तुम्ही गहू, तांदूळ, कापूस, मका, टोमॅटो, कांदे आणि बटाटे यासारख्या पिकांचे वास्तविक वेळ भाव पाहू शकता. भाव स्थान आणि बाजारानुसार वेगळे असतात।'
    };
    return responses[language] || responses.en;
  }

  // Crop selling queries
  if (lowerMessage.includes('sell') || lowerMessage.includes('selling') || lowerMessage.includes('sale') || lowerMessage.includes('bech') || lowerMessage.includes('बेचना') || lowerMessage.includes('विक्री') || lowerMessage.includes('విక్రయించు')) {
    const responses = {
      en: 'To sell your crops, go to the Sell Request section. Fill in the crop name, quantity, expected price, and location. Your request will be reviewed by admin and forwarded to businesses. You can track the status in My Requests.',
      hi: 'अपनी फसलें बेचने के लिए, सेल रिक्वेस्ट सेक्शन पर जाएं। फसल का नाम, मात्रा, अपेक्षित मूल्य और स्थान भरें। आपका अनुरोध एडमिन द्वारा समीक्षा किया जाएगा और व्यवसायियों को भेजा जाएगा। आप मेरे अनुरोध में स्थिति ट्रैक कर सकते हैं।',
      pa: 'ਆਪਣੀਆਂ ਫਸਲਾਂ ਵੇਚਣ ਲਈ, ਸੈੱਲ ਰਿਕਵੇਸਟ ਸੈਕਸ਼ਨ ਤੇ ਜਾਓ। ਫਸਲ ਦਾ ਨਾਮ, ਮਾਤਰਾ, ਉਮੀਦ ਦੀ ਕੀਮਤ ਅਤੇ ਸਥਾਨ ਭਰੋ। ਤੁਹਾਡਾ ਬੇਦਾ ਪ੍ਰਸ਼ਾਸ਼ਕ ਦੁਆਰਾ ਸਮੀਖਿਆ ਜਾਵੇਗਾ ਅਤੇ ਕਾਰੋਬਾਰੀਆਂ ਨੂੰ ਭੇਜਿਆ ਜਾਵੇਗਾ। ਤੁਸੀਂ ਮੇਰੇ ਬੇਦਾਂ ਵਿੱਚ ਸਥਿਤੀ ਟ੍ਰੈਕ ਕਰ ਸਕਦੇ ਹੋ।',
      te: 'మీ పంటలను అమ్మకం కోసం, సెల్ రిక్వెస్ట్ విభాగానికి వెళ్ళండి. పంట పేరు, పరిమాణం, ఆశించిన ధర మరియు స్థానాన్ని నింపండి. మీ అభ్యర్థన నిర్వాహకుడి ద్వారా సమీక్షించబడుతుంది మరియు వ్యాపారులకు అంపివేయబడుతుంది. మీరు నా అభ్యర్థనలలో స్థితిని ట్రాక్ చేయవచ్చు।',
      mr: 'आपले पीक विकण्यासाठी, विक्री विनंती विभागात जा. पीकाचे नाव, प्रमाण, अपेक्षित किंमत आणि स्थान भरा. तुमची विनंती प्रशासकाकडून तपासली जाईल आणि व्यवसायीकडे पाठविली जाईल. तुम्ही माझ्या विनंत्यांमध्ये स्थिती ट्रॅक करू शकता.'
    };
    return responses[language] || responses.en;
  }

  // Order status queries
  if (lowerMessage.includes('order') || lowerMessage.includes('status') || lowerMessage.includes('request') || lowerMessage.includes('avastha') || lowerMessage.includes('स्थिति') || lowerMessage.includes('స్థితి')) {
    const responses = {
      en: 'You can check your sell request status in the My Requests section. Status stages are: Pending, Approved by Admin, Sent to Business, Accepted by Business, Rejected, or Completed. Each status update will be shown with remarks from admin or business.',
      hi: 'आप मेरे अनुरोध सेक्शन में अपने बेचने के अनुरोध की स्थिति जांच सकते हैं। स्थिति चरण हैं: लंबित, एडमिन द्वारा स्वीकृत, व्यवसाय को भेजा गया, व्यवसाय द्वारा स्वीकृत, अस्वीकृत, या पूर्ण। प्रत्येक स्थिति अपडेट एडमिन या व्यवसाय से टिप्पणियों के साथ दिखाया जाएगा।',
      pa: 'ਤੁਸੀਂ ਮੇਰੇ ਬੇਦਾਂ ਸੈਕਸ਼ਨ ਵਿੱਚ ਆਪਣੇ ਵੇਚਣ ਦੀ ਬੇਦਦੀ ਦੀ ਸਥਿਤੀ ਦੇਖ ਸਕਦੇ ਹੋ। ਸਥਿਤੀ ਦੇ ਪੜਾਅ ਹਨ: ਬਾਕੀ, ਪ੍ਰਸ਼ਾਸਕ ਵੱਲੋਂ ਮਨਜ਼ੂਰ, ਕਾਰੋਬਾਰੀ ਨੂੰ ਭੇਜਿਆ, ਕਾਰੋਬਾਰੀ ਵੱਲੋਂ ਮਨਜ਼ੂਰ, ਅਸਵੀਕਾਰ, ਜਾਂ ਪੂਰਾ। ਹਰੇਕ ਸਥਿਤੀ ਅਪਡੇਟ ਪ੍ਰਸ਼ਾਸਕ ਜਾਂ ਕਾਰੋਬਾਰੀ ਤੋਂ ਟਿੱਪਣੀਆਂ ਨਾਲ ਦਿਖਾਇਆ ਜਾਵੇਗਾ।',
      te: 'మీరు నా అభ్యర్థనల విభాగంలో మీ అమ్మకం అభ్యర్థన స్థితిని తనిఖీ చేయవచ్చు. స్థితి దశలు: పెండింగ్, నిర్వాహకుడిచే ఆమోదించబడింది, వ్యాపారానికి పంపబడింది, వ్యాపారి చే ఆమోదించబడింది, తిరస్కరించబడింది, లేదా పూర్తి అయింది. ప్రతి స్థితి నవీకరణ నిర్వాహకుడి లేదా వ్యాపారి నుండి వ్యాఖ్యలతో చూపబడుతుంది.',
      mr: 'तुम्ही माझ्या विनंत्या विभागात तुमच्या विक्री विनंतीची स्थिती तपासू शकता. स्थितीचे टप्पे आहेत: प्रलंबित, प्रशासकाकडून मंजूर, व्यवसायाकडे पाठविले, व्यवसायाकडून मंजूर, नकारले, किंवा पूर्ण. प्रत्येक स्थिती अपडेट प्रशासक किंवा व्यवसायीकडून टिप्पण्यांसह दाखवला जाईल.'
    };
    return responses[language] || responses.en;
  }

  // Weather queries
  if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('temperature') || lowerMessage.includes('mausam') || lowerMessage.includes('बारिश') || lowerMessage.includes('వాతావరణం') || lowerMessage.includes('వర్షం')) {
    const responses = {
      en: 'Weather information is available in the Weather section. You can check current temperature, humidity, wind speed, and rainfall forecasts for your location. This helps in planning farming activities like irrigation and harvesting.',
      hi: 'मौसम की जानकारी वेदर सेक्शन में उपलब्ध है। आप अपने स्थान के लिए वर्तमान तापमान, नमी, हवा की गति और वर्षा पूर्वानुमान देख सकते हैं। यह सिंचाई और कटाई जैसी खेती गतिविधियों की योजना बनाने में मदद करता है।',
      pa: 'ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ ਮੌਸਮ ਸੈਕਸ਼ਨ ਵਿੱਚ ਉਪਲਬਧ ਹੈ। ਤੁਸੀਂ ਆਪਣੇ ਖੇਤਰ ਲਈ ਮੌਜੂਦਾ ਤਾਪਮਾਨ, ਨਮੀ, ਹਵਾ ਦੀ ਗਤੀ ਅਤੇ ਮੀਂਹਦਾਂ ਦੀ ਭਵਿੱਖੀ ਦੇਖ ਸਕਦੇ ਹੋ। ਇਹ ਸਿੰਚਾਈ ਅਤੇ ਕਟਾਈ ਵਰਗੀਆਂ ਖੇਤੀ ਗਤੀਵਿਧੀਆਂ ਦੀ ਯੋਜਨਾ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।',
      te: 'వాతావరణ సమాచారం వెదర్ విభాగంలో అందుబాటులో ఉంది. మీరు మీ స్థానానికి ప్రస్తుత ఉష్ణోగ్రత, ఆర్ద్రత, గాలి వేగం మరియు వర్షం అంచనాలను తనిఖీ చేయవచ్చు. ఇది నీటిపాతు మరియు పంట సంగ్రహం వంటి వ్యవసాయ కార్యకలాపాలను ప్రణాళిక చేయడంలో సహాయపడుతుంది.',
      mr: 'हवामानाची माहिती हवामान विभागात उपलब्ध आहे. तुम्ही तुमच्या ठिकाण्याचे वर्तमान तापमान, आर्द्रता, वाऱ्याची गती आणि पावसाचे अंदाज पाहू शकता. हे सिंचन आणि कापणी यासारख्या शेती क्रियांमध्ये योजना आखण्यास मदत करते.'
    };
    return responses[language] || responses.en;
  }

  // Crop disease/quality queries
  if (lowerMessage.includes('disease') || lowerMessage.includes('pest') || lowerMessage.includes('quality') || lowerMessage.includes('rog') || lowerMessage.includes('बीमारी') || lowerMessage.includes('कीट') || lowerMessage.includes('వ్యాధి') || lowerMessage.includes('నాణేలు')) {
    const responses = {
      en: 'For crop disease and quality assessment, use our ML prediction features. You can upload crop images or input crop parameters to get disease detection and quality scores. The system helps identify common issues and suggests appropriate treatments.',
      hi: 'फसल रोग और गुणवत्ता आकलन के लिए, हमारी एमएल पूर्वानुमान सुविधाओं का उपयोग करें। आप फसल की छवियां अपलोड कर सकते हैं या फसल पैरामीटर इनपुट करके रोग पहचान और गुणवत्ता स्कोर प्राप्त कर सकते हैं। सिस्टम सामान्य समस्याओं की पहचान करने और उपचार का सुझाव देने में मदद करता है।',
      pa: 'ਫਸਲ ਦੀ ਬਿਮਾਰੀ ਅਤੇ ਗੁਣਵੱਤਾ ਮੁਲਾਂਕਣ ਲਈ, ਸਾਡੀ ਐਮਐਲ ਭਵਿੱਖਿਆ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਤੁਸੀਂ ਫਸਲ ਦੀਆਂ ਤਸਵੀਰਾਂ ਅੱਪਲੋਡ ਕਰ ਸਕਦੇ ਹੋ ਜਾਂ ਫਸਲ ਦੇ ਮਾਪਦੰਡ ਇਨਪੁੱਟ ਕਰਕੇ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ ਅਤੇ ਗੁਣਵੱਤਾ ਸਕੋਰ ਪ੍ਰਾਪਤ ਕਰ ਸਕਦੇ ਹੋ। ਸਿਸਟਮ ਆਮ ਸਮੱਸਿਆਵਾਂ ਦੀ ਪਛਾਣ ਕਰਨ ਅਤੇ ਉਚਿਤ ਇਲਾਜ ਦਾ ਸੁਝਾਅ ਦੇਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।',
      te: 'పంట వ్యాధి మరియు నాణ్యత అంచన కోసం, మా యంత్రిక అభ్యాస అంచన ఫీచర్లను ఉపయోగించండి. మీరు పంట చిత్రాలను అప్‌లోడ్ చేయవచ్చు లేదా పంట పారామీటర్లను ఇన్‌పుట్ చేసి వ్యాధి గుర్తింపు మరియు నాణ్యత స్కోర్‌లను పొందవచ్చు. సిస్టమ్ సాధారణ సమస్యలను గుర్తించడంలో మరియు సరైన చికిత్సలను సూచించడంలో సహాయపడుతుంది.',
      mr: 'पीक रोग आणि गुणवत्ता मूल्यांकनासाठी, आमचे एमएल अंदाज वैशिष्ट्ये वापरा. तुम्ही पीकाचे प्रतिमा अपलोड करू शकता किंवा पीक मापदंड इनपुट करून रोग ओळख आणि गुणवत्ता गुण मिळवू शकता. प्रणाली सामान्य समस्यांची ओळख करण्यास आणि योग्य उपचार सूचना देण्यास मदत करते.'
    };
    return responses[language] || responses.en;
  }

  // Admin/business workflow queries
  if (lowerMessage.includes('admin') || lowerMessage.includes('business') || lowerMessage.includes('approval') || lowerMessage.includes('verification') || lowerMessage.includes('kyc')) {
    const responses = {
      en: 'For admin and business workflows: Admins can verify users, approve sell requests, and monitor system analytics. Businesses can place bids on crop listings, manage logistics, and process payments. Each role has specific permissions and dashboard access.',
      hi: 'एडमिन और बिजनेस वर्कफ़्लो के लिए: एडमिन उपयोगकर्ताओं को सत्यापित कर सकते हैं, बेचने के अनुरोधों को मंजूरी दे सकते हैं, और सिस्टम एनालिटिक्स की निगरानी कर सकते हैं। व्यवसायी फसल लिस्टिंग पर बोली लगा सकते हैं, लॉजिस्टिक्स प्रबंधित कर सकते हैं, और भुगतान प्रक्रिया कर सकते हैं। प्रत्येक भूमिका के विशिष्ट अनुमति और डैशबोर्ड एक्सेस हैं।',
      pa: 'ਪ੍ਰਸ਼ਾਸਕ ਅਤੇ ਕਾਰੋਬਾਰ ਵਰਕਫਲੋਅ ਲਈ: ਪ੍ਰਸ਼ਾਸਕ ਉਪਭੋਗਤਾਵਾਂ ਨੂੰ ਤਸਦੀਕ ਕਰ ਸਕਦੇ ਹਨ, ਵੇਚਣ ਦੀਆਂ ਬੇਦਾਂ ਨੂੰ ਮਨਜ਼ੂਰ ਕਰ ਸਕਦੇ ਹਨ, ਅਤੇ ਸਿਸਟਮ ਵਿਸ਼ਲੇਸ਼ਣ ਦੀ ਨਿਗਰਾਨੀ ਕਰ ਸਕਦੇ ਹਨ। ਕਾਰੋਬਾਰੀ ਫਸਲ ਸੂਚੀਆਂ ਤੇ ਬੋਲੀ ਲਗਾ ਸਕਦੇ ਹਨ, ਲਾਜਿਸਟਿਕਸ ਦਾ ਪ੍ਰਬੰਧ ਕਰ ਸਕਦੇ ਹਨ, ਅਤੇ ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ ਕਰ ਸਕਦੇ ਹਨ। ਹਰੇਕ ਭੂਮਿਕਾ ਦੀਆਂ ਖਾਸ ਆਗਿਆਂ ਅਤੇ ਡੈਸ਼ਬੋਰਡ ਪਹੁੰਚ ਹਨ।',
      te: 'నిర్వాహకుడు మరియు వ్యాపార కార్యప్రవాహాల కోసం: నిర్వాహకులు వినియోగదారులను ధృవీకరించవచ్చు, అమ్మకం అభ్యర్థనలను ఆమోదించవచ్చు, మరియు సిస్టమ్ విశ్లేషణాలను పర్యవేక్షించవచ్చు. వ్యాపారులు పంట జాబితాలపై బిడ్డింగ్ చేయవచ్చు, లాజిస్టిక్స్‌ను నిర్వహించవచ్చు, మరియు చెల్లింపులను ప్రాసెస్ చేయవచ్చు. ప్రతి పాత్రకు నిర్దిష్ట అనుమతులు మరియు డాష్‌బోర్డ్ యాక్సెస్ ఉన్నాయి.',
      mr: 'प्रशासक आणि व्यवसाय कार्यप्रवाहासाठी: प्रशासक वापरकर्ते सत्यापित करू शकतात, विक्री विनंत्यांना मंजूर करू शकतात आणि प्रणाली विश्लेषणाचे निरीक्षण करू शकतात. व्यवसायी पीक यादीवरी बोली घालू शकतात, लॉजिस्टिक्स व्यवस्थापित करू शकतात आणि भरवाळा प्रक्रिया करू शकतात. प्रत्येक भूमिकेचे विशिष्ट अनुमती आणि डॅशबोर्ड प्रवेश आहे.'
    };
    return responses[language] || responses.en;
  }

  // Default response
  const responses = {
    en: 'I can help you with market prices, crop selling, order status, weather information, and crop quality assessment. Please specify what you need assistance with.',
    hi: 'मैं आपको बाजार कीमतों, फसल बेचने, ऑर्डर स्थिति, मौसम जानकारी, और फसल गुणवत्ता आकलन में मदद कर सकता हूं। कृपया बताएं कि आपको किस में सहायता चाहिए।',
    pa: 'ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਬਾਜ਼ਾਰ ਕੀਮਤਾਂ, ਫਸਲ ਵੇਚਣ, ਆਰਡਰ ਸਥਿਤੀ, ਮੌਸਮ ਜਾਣਕਾਰੀ, ਅਤੇ ਫਸਲ ਗੁਣਵੱਤਾ ਮੁਲਾਂਕਣ ਵਿੱਚ ਕਰ ਸਕਦਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਤੁਹਾਨੂੰ ਕਿਸ ਵਿੱਚ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ।',
    te: 'నేను మీకు మార్కెట్ ధరలు, పంటల అమ్మకం, ఆర్డర్ స్థితి, వాతావరణ సమాచారం, మరియు పంట నాణ్యత అంచనలో సహాయం చేయగలను. దయచిసి మీకు ఏమిలో సహాయం అవసరం అని తెలియజేయండి.',
    mr: 'मी तुम्हाला बाजार भाव, पीक विक्री, ऑर्डर स्थिती, हवामान माहिती आणि पीक गुणवत्ता मूल्यांकनात मदत करू शकतो. कृपया सांगा तुम्हाला कोणत्या मध्ये सहायता हवी आहे.'
  };
  return responses[language] || responses.en;
};

// POST /api/chat/ask - Handle chat queries
router.post('/ask', async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message is too long (max 1000 characters)'
      });
    }

    // Get rule-based response
    const reply = getRuleBasedResponse(message.trim(), language);

    // Return response
    res.json({
      success: true,
      reply: reply,
      language: language,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Chat API',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
