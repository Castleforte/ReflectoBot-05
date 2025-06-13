export const moodData = [
  { 
    name: 'happy', 
    emoji: '😊',
    blueImage: '/Mood-Emojis_0000s_0007_happy-blue.png',
    colorImage: '/Mood-Emojis_0001s_0007_happy-color.png'
  },
  { 
    name: 'calm', 
    emoji: '😌',
    blueImage: '/Mood-Emojis_0000s_0006_apathetic-blue.png',
    colorImage: '/Mood-Emojis_0001s_0006_apathetic-color.png'
  },
  { 
    name: 'cool', 
    emoji: '😎',
    blueImage: '/Mood-Emojis_0000s_0005_cool-blue.png',
    colorImage: '/Mood-Emojis_0001s_0005_cool-color.png'
  },
  { 
    name: 'sad', 
    emoji: '😢',
    blueImage: '/Mood-Emojis_0000s_0004_sad-blue.png',
    colorImage: '/Mood-Emojis_0001s_0004_sad-color.png'
  },
  { 
    name: 'angry', 
    emoji: '😠',
    blueImage: '/Mood-Emojis_0000s_0003_mad-blue.png',
    colorImage: '/Mood-Emojis_0001s_0003_mad-color.png'
  },
  { 
    name: 'overwhelmed', 
    emoji: '😵‍💫',
    blueImage: '/Mood-Emojis_0000s_0002_stressed-blue.png',
    colorImage: '/Mood-Emojis_0001s_0002_stressed-color.png'
  },
  { 
    name: 'blank', 
    emoji: '😐',
    blueImage: '/Mood-Emojis_0000s_0001_confused-blue.png',
    colorImage: '/Mood-Emojis_0001s_0001_confused-color.png'
  },
  { 
    name: 'drained', 
    emoji: '😴',
    blueImage: '/Mood-Emojis_0000s_0000_worried-blue.png',
    colorImage: '/Mood-Emojis_0001s_0000_worried-color.png'
  },
  { 
    name: 'love', 
    emoji: '😍',
    blueImage: '/Mood-Emojis_0000s_0008_love-blue.png',
    colorImage: '/Mood-Emojis_0000s_0008_love-color.png'
  }
];

export const moodResponses: Record<string, string> = {
  happy: "Love to see that smile! What made your day so great?",
  calm: "Feeling at peace today? That's wonderful.",
  cool: "Feelin' chill, huh? Want to talk about what's keeping you cool?",
  sad: "I'm really sorry you're feeling down today. Want to talk about what's been going on?",
  angry: "Sounds like something upset you. Want to let it out?",
  overwhelmed: "If you're feeling swirly inside, I'm all ears.",
  blank: "Not sure how you feel? That's okay too. Let's figure it out together.",
  drained: "It's been a lot today, huh? You can tell me anything.",
  love: "Aww, feeling the love today! That's so wonderful to see!"
};

export const sentenceStarters: Record<string, string> = {
  happy: "I'm feeling happy today because...",
  calm: "I'm feeling calm because...",
  cool: "Today I'm feeling pretty chill because...",
  sad: "I'm feeling down today because...",
  angry: "I'm feeling angry today because...",
  overwhelmed: "I feel overwhelmed because...",
  blank: "I'm not sure how to describe how I feel but...",
  drained: "I feel really drained today because...",
  love: "I'm feeling so much love today because..."
};