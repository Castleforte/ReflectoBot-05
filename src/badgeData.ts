import { Badge, Challenge, ReflectoBotProgress } from './types';

export const allBadges: Badge[] = [
  {
    id: 'calm_creator',
    name: 'Calm Creator',
    description: 'Save a drawing',
    icon: '/badges/CalmCreator.png',
    colorIcon: '/badges/CalmCreator.png',
    earned: false
  },
  {
    id: 'mood_mapper',
    name: 'Mood Mapper',
    description: 'Choose an emoji and write 25+ words about that feeling',
    icon: '/badges/MoodMapper.png',
    colorIcon: '/badges/MoodMapper.png',
    earned: false
  },
  {
    id: 'bounce_back',
    name: 'Bounce Back',
    description: 'Use undo 3 times',
    icon: '/badges/BounceBack.png',
    colorIcon: '/badges/BounceBack.png',
    earned: false
  },
  {
    id: 'reflecto_rookie',
    name: 'Reflecto Rookie',
    description: 'Send first chat message',
    icon: '/badges/ReflectoRookie.png',
    colorIcon: '/badges/ReflectoRookie.png',
    earned: false
  },
  {
    id: 'focus_finder',
    name: 'Focus Finder',
    description: 'Stay focused for 90 seconds',
    icon: '/badges/FocusFinder.png',
    colorIcon: '/badges/FocusFinder.png',
    earned: false
  },
  {
    id: 'goal_getter',
    name: 'Goal Getter',
    description: 'Complete 5 total challenges',
    icon: '/badges/GoalGetter.png',
    colorIcon: '/badges/GoalGetter.png',
    earned: false
  },
  {
    id: 'great_job',
    name: 'Great Job',
    description: 'Export a mood or chat PDF',
    icon: '/badges/GreatJob.png',
    colorIcon: '/badges/GreatJob.png',
    earned: false
  },
  {
    id: 'brave_voice',
    name: 'Brave Voice',
    description: 'Share an emotion using "because"',
    icon: '/badges/BraveVoice.png',
    colorIcon: '/badges/BraveVoice.png',
    earned: false
  },
  {
    id: 'what_if_explorer',
    name: 'What If Explorer',
    description: 'Answer 3 What If prompts',
    icon: '/badges/WhatIfExplorer.png',
    colorIcon: '/badges/WhatIfExplorer.png',
    earned: false
  },
  {
    id: 'truth_spotter',
    name: 'Truth Spotter',
    description: 'Send message containing "I realized"',
    icon: '/badges/TruthSpotter.png',
    colorIcon: '/badges/TruthSpotter.png',
    earned: false
  },
  {
    id: 'kind_heart',
    name: 'Kind Heart',
    description: 'Use love emoji and write 25+ words about love',
    icon: '/badges/KindHeart.png',
    colorIcon: '/badges/KindHeart.png',
    earned: false
  },
  {
    id: 'boost_buddy',
    name: 'Boost Buddy',
    description: 'Use "Read it to me" button',
    icon: '/badges/BoostBuddy.png',
    colorIcon: '/badges/BoostBuddy.png',
    earned: false
  },
  {
    id: 'stay_positive',
    name: 'Stay Positive',
    description: 'Select a happy emoji and write 15+ words about what makes you happy',
    icon: '/badges/StayPositive.png',
    colorIcon: '/badges/StayPositive.png',
    earned: false
  },
  {
    id: 'good_listener',
    name: 'Good Listener',
    description: 'Visit both Chat History and Mood History pages',
    icon: '/badges/GoodListener.png',
    colorIcon: '/badges/GoodListener.png',
    earned: false
  },
  {
    id: 'creative_spark',
    name: 'Creative Spark',
    description: 'Use 5+ colors in one drawing',
    icon: '/badges/CreativeSpark.png',
    colorIcon: '/badges/CreativeSpark.png',
    earned: false
  },
  {
    id: 'deep_thinker',
    name: 'Deep Thinker',
    description: 'Send chat message with 15+ words',
    icon: '/badges/DeepThinker.png',
    colorIcon: '/badges/DeepThinker.png',
    earned: false
  },
  {
    id: 'resilient',
    name: 'Resilient',
    description: 'Visit all 4 main sections in one session',
    icon: '/badges/Resilient.png',
    colorIcon: '/badges/Resilient.png',
    earned: false
  },
  {
    id: 'super_star',
    name: 'Super Star',
    description: 'Earn all 17 badges',
    icon: '/badges/SuperStar.png',
    colorIcon: '/badges/SuperStar.png',
    earned: false
  }
];

export const challengeDetails: Challenge[] = [
  {
    id: 'calm_creator_challenge',
    title: 'Calm Creator Challenge',
    description: 'Create and save a drawing that expresses how you\'re feeling.\nLet your creativity flow and capture your emotions on canvas!',
    badgeId: 'calm_creator'
  },
  {
    id: 'mood_mapper_challenge',
    title: 'Mood Mapper Challenge',
    description: 'Choose an emoji and write at least 25 words about that feeling.\nExpress yourself and explore your emotions!',
    badgeId: 'mood_mapper'
  },
  {
    id: 'bounce_back_challenge',
    title: 'Bounce Back Challenge',
    description: 'Practice resilience by using the undo button while drawing.\nMistakes are just stepping stones to something better!',
    badgeId: 'bounce_back'
  },
  {
    id: 'reflecto_rookie_challenge',
    title: 'Reflecto Rookie Challenge',
    description: 'Start your journey by sending your first message to ReflectoBot.\nShare what\'s on your mind - I\'m here to listen!',
    badgeId: 'reflecto_rookie'
  },
  {
    id: 'focus_finder_challenge',
    title: 'Focus Finder Challenge',
    description: 'Stay focused in one section for 90 seconds with meaningful engagement.\nFocus is your secret weapon for success!',
    badgeId: 'focus_finder'
  },
  {
    id: 'great_job_challenge',
    title: 'Great Job Challenge',
    description: 'Save your progress by downloading your chat or mood history.\nYour journey deserves to be remembered!',
    badgeId: 'great_job'
  },
  {
    id: 'brave_voice_challenge',
    title: 'Brave Voice Challenge',
    description: 'Share how you\'re feeling and explain why using the word "because".\nYour voice matters!',
    badgeId: 'brave_voice'
  },
  {
    id: 'what_if_explorer_challenge',
    title: 'What If Explorer Challenge',
    description: 'Explore your imagination by answering 3 different What If prompts.\nLet your creativity run wild!',
    badgeId: 'what_if_explorer'
  },
  {
    id: 'truth_spotter_challenge',
    title: 'Truth Spotter Challenge',
    description: 'Share a moment of insight by using "I realized" in a message.\nSelf-discovery is a beautiful thing!',
    badgeId: 'truth_spotter'
  },
  {
    id: 'kind_heart_challenge',
    title: 'Kind Heart Challenge',
    description: 'Express love and kindness by selecting the love emoji and writing at least 25 words about love or what you love most in life.\nSpread the love wherever you go!',
    badgeId: 'kind_heart'
  },
  {
    id: 'boost_buddy_challenge',
    title: 'Boost Buddy Challenge',
    description: 'Use the "Read it to me" feature in the What If section.\nSometimes hearing things out loud helps us think differently!',
    badgeId: 'boost_buddy'
  },
  {
    id: 'stay_positive_challenge',
    title: 'Stay Positive Challenge',
    description: 'Find something that makes you happy today, select the happy emoji, and write at least 15 words about what makes you happy.\nPositivity is a superpower!',
    badgeId: 'stay_positive'
  },
  {
    id: 'good_listener_challenge',
    title: 'Good Listener Challenge',
    description: 'Reflect on your journey by visiting both your Chat History and Mood History pages.\nLooking back helps you move forward!',
    badgeId: 'good_listener'
  },
  {
    id: 'creative_spark_challenge',
    title: 'Creative Spark Challenge',
    description: 'Create a colorful drawing using at least 5 different colors.\nLet your creativity shine!',
    badgeId: 'creative_spark'
  },
  {
    id: 'deep_thinker_challenge',
    title: 'Deep Thinker Challenge',
    description: 'Share a thoughtful message with ReflectoBot using at least 15 words.\nWhat\'s really on your mind?',
    badgeId: 'deep_thinker'
  },
  {
    id: 'resilient_challenge',
    title: 'Resilient Challenge',
    description: 'Show your commitment by visiting all four main sections in one session.\nConsistency is the key to growth!',
    badgeId: 'resilient'
  }
];

// Badge queue - ONLY actual challenges, NO reward badges
export const badgeQueue = [
  'calm_creator',      // Challenge 1
  'mood_mapper',       // Challenge 2
  'bounce_back',       // Challenge 3
  'reflecto_rookie',   // Challenge 4
  'focus_finder',      // Challenge 5 ✅ MOVED HERE
  'great_job',         // Challenge 6
  'brave_voice',       // Challenge 7
  'what_if_explorer',  // Challenge 8
  'truth_spotter',     // Challenge 9
  'kind_heart',        // Challenge 10
  'boost_buddy',       // Challenge 11
  'stay_positive',     // Challenge 12
  'good_listener',     // Challenge 13 ✅ UPDATED
  'creative_spark',    // Challenge 14
  'deep_thinker',      // Challenge 15
  'resilient'          // Challenge 16
  // ❌ goal_getter and super_star are NOT in the queue - they are reward badges
];