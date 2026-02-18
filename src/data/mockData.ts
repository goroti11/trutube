import { User, Video, Comment, Category, MembershipTier } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'MusicVerse', slug: 'music' },
  { id: '2', name: 'GameVerse', slug: 'gaming' },
  { id: '3', name: 'LearnVerse', slug: 'education' },
  { id: '4', name: 'LifeVerse', slug: 'lifestyle' },
  { id: '5', name: 'CultureVerse', slug: 'culture' }
];

export const users: User[] = [
  {
    id: '1',
    username: 'alexbeats',
    displayName: 'Alex Beats',
    avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Music producer and beat maker',
    userStatus: 'creator',
    subscriberCount: 84000,
    uploadFrequency: 3,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    username: 'techtalker',
    displayName: 'TechTalker',
    avatarUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Tech enthusiast and podcast host',
    userStatus: 'creator',
    subscriberCount: 244000,
    uploadFrequency: 2,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    username: 'filmcrew',
    displayName: 'FilmCrew',
    avatarUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Behind the scenes content creator',
    userStatus: 'creator',
    subscriberCount: 158000,
    uploadFrequency: 4,
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    username: 'dopefreeStyle',
    displayName: 'DopeFreestyle',
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Hip hop artist',
    userStatus: 'supporter',
    subscriberCount: 50000,
    uploadFrequency: 1,
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const trendingVideos: Video[] = [];

export const recommendedVideos: Video[] = [];

export const comments: Comment[] = [];

export const membershipTiers: MembershipTier[] = [];
