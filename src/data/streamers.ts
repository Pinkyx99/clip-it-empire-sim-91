import { StreamerData } from '../hooks/useGameData';
import ishowspeedImg from '../assets/ishowspeed.jpg';
import xqcImg from '../assets/xqc.jpg';
import kaicenatImg from '../assets/kaicenat.jpg';
import pokimaneImg from '../assets/pokimane.jpg';
import ninjaImg from '../assets/ninja.jpg';

export const STREAMERS: StreamerData[] = [
  {
    id: 'ishowspeed',
    name: 'ishowspeed',
    displayName: 'IShowSpeed',
    avatar: ishowspeedImg,
    followers: 15200000,
    category: 'Variety'
  },
  {
    id: 'xqc',
    name: 'xqc',
    displayName: 'xQc',
    avatar: xqcImg,
    followers: 11800000,
    category: 'Variety'
  },
  {
    id: 'kaicenat',
    name: 'kaicenat',
    displayName: 'Kai Cenat',
    avatar: kaicenatImg,
    followers: 9600000,
    category: 'Variety'
  },
  {
    id: 'pokimane',
    name: 'pokimane',
    displayName: 'Pokimane',
    avatar: pokimaneImg,
    followers: 8900000,
    category: 'Variety'
  },
  {
    id: 'ninja',
    name: 'ninja',
    displayName: 'Ninja',
    avatar: ninjaImg,
    followers: 18700000,
    category: 'Gaming'
  }
];

export const VIRAL_HASHTAGS = [
  '#viral', '#fyp', '#foryou', '#trending', '#funny', '#gaming', 
  '#stream', '#twitch', '#clips', '#reaction', '#memes', '#speedrun',
  '#clutch', '#poggers', '#epic', '#moments', '#highlights', '#live'
];

export const getRandomHashtags = (count: number = 3): string[] => {
  const shuffled = [...VIRAL_HASHTAGS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const generateClipTitle = (streamerName: string): string => {
  const actions = [
    'REACTS TO', 'GETS SCARED BY', 'LOSES IT AT', 'CAN\'T BELIEVE',
    'GOES CRAZY OVER', 'SHOCKED BY', 'FREAKS OUT AT', 'DESTROYS'
  ];
  
  const subjects = [
    'THIS INSANE MOMENT', 'VIRAL VIDEO', 'CRAZY DONATION', 'EPIC FAIL',
    'FUNNY CLIP', 'WEIRD CONTENT', 'AMAZING PLAY', 'SHOCKING NEWS',
    'HILARIOUS MEME', 'UNEXPECTED TWIST'
  ];
  
  const action = actions[Math.floor(Math.random() * actions.length)];
  const subject = subjects[Math.floor(Math.random() * subjects.length)];
  
  return `${streamerName.toUpperCase()} ${action} ${subject}!`;
};