'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, MessageCircle, Eye, Heart } from 'lucide-react';

// Sample forum discussions
const discussions = [
  {
    id: 1,
    title: 'How to overcome nervousness during presentations?',
    author: 'Sarah Johnson',
    authorInitials: 'SJ',
    category: 'Tips & Tricks',
    replies: 23,
    views: 456,
    likes: 45,
    timeAgo: '2 hours ago',
    excerpt: "I've been struggling with nervousness during presentations. What techniques have worked for you?",
    isAnswered: true,
  },
  {
    id: 2,
    title: 'Best practices for impromptu speaking',
    author: 'Michael Chen',
    authorInitials: 'MC',
    category: 'Impromptu',
    replies: 15,
    views: 234,
    likes: 31,
    timeAgo: '5 hours ago',
    excerpt: 'Looking for strategies to improve my impromptu speaking skills. Any recommendations?',
    isAnswered: false,
  },
  {
    id: 3,
    title: 'Voice modulation techniques',
    author: 'Emily Rodriguez',
    authorInitials: 'ER',
    category: 'Technique',
    replies: 42,
    views: 789,
    likes: 67,
    timeAgo: '1 day ago',
    excerpt: 'How can I improve my voice modulation to keep the audience engaged?',
    isAnswered: true,
  },
  {
    id: 4,
    title: 'Dealing with difficult questions during Q&A',
    author: 'David Kim',
    authorInitials: 'DK',
    category: 'Q&A',
    replies: 8,
    views: 123,
    likes: 12,
    timeAgo: '3 hours ago',
    excerpt: "What's the best way to handle difficult or hostile questions during Q&A sessions?",
    isAnswered: false,
  },
  {
    id: 5,
    title: 'Body language tips for confident speaking',
    author: 'Lisa Wang',
    authorInitials: 'LW',
    category: 'Body Language',
    replies: 56,
    views: 1203,
    likes: 89,
    timeAgo: '2 days ago',
    excerpt: 'Share your best body language tips for appearing confident while speaking.',
    isAnswered: true,
  },
  {
    id: 6,
    title: 'Structuring a persuasive argument',
    author: 'James Wilson',
    authorInitials: 'JW',
    category: 'Debate',
    replies: 19,
    views: 345,
    likes: 28,
    timeAgo: '6 hours ago',
    excerpt: "I'm preparing for a debate. How should I structure my arguments effectively?",
    isAnswered: true,
  },
  {
    id: 7,
    title: 'Using pauses effectively in speech',
    author: 'Anna Martinez',
    authorInitials: 'AM',
    category: 'Technique',
    replies: 34,
    views: 567,
    likes: 52,
    timeAgo: '1 day ago',
    excerpt: 'The power of strategic pauses in public speaking. Discuss!',
    isAnswered: false,
  },
  {
    id: 8,
    title: 'Preparing for a TEDx talk',
    author: 'Robert Taylor',
    authorInitials: 'RT',
    category: 'Events',
    replies: 27,
    views: 890,
    likes: 76,
    timeAgo: '3 days ago',
    excerpt: 'Got selected for a TEDx talk! Any advice on preparation?',
    isAnswered: true,
  },
];

const categories = ['All', 'Tips & Tricks', 'Impromptu', 'Technique', 'Q&A', 'Body Language', 'Debate', 'Events'];

export default function DiscussPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredDiscussions = selectedCategory === 'All' 
    ? discussions 
    : discussions.filter(d => d.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Discussion Forum</h1>
          <p className="text-muted-foreground mt-2">
            Ask questions, share insights, and learn from the community
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Discussion
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Discussion List */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg hover:text-primary transition-colors">
                      {discussion.title}
                    </CardTitle>
                    {discussion.isAnswered && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        ✓ Answered
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {discussion.excerpt}
                  </CardDescription>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-primary/10">
                          {discussion.authorInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{discussion.author}</span>
                    </div>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {discussion.category}
                    </Badge>
                    <span>•</span>
                    <span>{discussion.timeAgo}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span>{discussion.replies} replies</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{discussion.views} views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  <span>{discussion.likes} likes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
