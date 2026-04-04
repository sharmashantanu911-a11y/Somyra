import { Award, Briefcase, Mic, Search, TrendingUp, Users } from 'lucide-react';

export const goalOptions = [
  { id: 'get-inbound-clients', title: 'Get inbound clients', description: 'Attract ideal clients without cold outreach', icon: Briefcase },
  { id: 'build-thought-leadership', title: 'Build thought leadership', description: 'Become the go-to expert in my field', icon: Award },
  { id: 'land-speaking-media', title: 'Land speaking or media', description: 'Podcasts stages and press opportunities', icon: Mic },
  { id: 'attract-investors', title: 'Attract investors or partners', description: 'Raise funding or find co-founders', icon: TrendingUp },
  { id: 'grow-network', title: 'Grow my professional network', description: 'Connect with the right people in my industry', icon: Users },
  { id: 'land-new-job', title: 'Land a new job or role', description: 'Get noticed by recruiters and hiring managers', icon: Search }
] as const;

export const struggleOptions = [
  'Low profile views',
  'No inbound leads',
  'Not attracting recruiters',
  'Content feels generic',
  "Don't know what to post",
  'Headline feels weak',
  'About section is a mess',
  'Experience is just a list of tasks'
];

export const commonRoles = ['Product Designer', 'Marketing Manager', 'Software Engineer', 'Founder', 'Sales Executive', 'Content Creator'];
export const commonIndustries = ['B2B SaaS', 'Fintech', 'Healthtech', 'E-commerce', 'Web3', 'Artificial Intelligence'];
export const commonFocusAreas = ['Growth Strategy', 'User Experience', 'Scale-up Operations', 'Brand Identity', 'Technical Architecture'];
export const commonAudiences = ['Founders', 'CTOs', 'Marketing Directors', 'Venture Capitalists', 'HR Managers'];
