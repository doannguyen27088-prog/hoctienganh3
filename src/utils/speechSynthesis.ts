let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function speakEnglish(text: string, callback?: () => void) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    
    // Choose beautiful female US English voice (gentle, clear, natural)
    const optimalVoice = voices.find(v => v.lang.includes('en-US') && v.name.toLowerCase().includes('google')) ||
                          voices.find(v => v.lang.includes('en-US') && v.name.toLowerCase().includes('zira')) ||
                          voices.find(v => v.lang.includes('en-US') && v.name.toLowerCase().includes('samantha')) ||
                          voices.find(v => v.lang.includes('en-US') && v.name.toLowerCase().includes('female')) ||
                          voices.find(v => v.lang.includes('en-US')) ||
                          voices.find(v => v.lang.startsWith('en')) || 
                          voices[0];

    if (optimalVoice) {
      utterance.voice = optimalVoice;
    }
    
    utterance.rate = 0.8; // Slow speed suited for children
    utterance.pitch = 1.15; // sweet high-pitched voice like Cô Lucy
    
    if (callback) {
      utterance.onend = () => callback();
      utterance.onerror = () => callback();
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    if (callback) callback();
  }
}

export function speakVietnamese(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    
    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    
    // Choose beautiful female Vietnamese voice (gentle, warm, natural)
    const optimalVoice = voices.find(v => v.lang.includes('vi-VN') && v.name.toLowerCase().includes('google')) ||
                          voices.find(v => v.lang.includes('vi-VN') && v.name.toLowerCase().includes('an')) ||
                          voices.find(v => v.lang.includes('vi-VN') && v.name.toLowerCase().includes('hue')) ||
                          voices.find(v => v.lang.includes('vi-VN') && v.name.toLowerCase().includes('lisa')) ||
                          voices.find(v => v.lang.includes('vi-VN')) ||
                          voices[0];

    if (optimalVoice) {
      utterance.voice = optimalVoice;
    }
    
    utterance.rate = 0.9; // clear, gentle speed for kids
    utterance.pitch = 1.15; // sweet tone matching Cô Lucy
    
    window.speechSynthesis.speak(utterance);
  }
}

