'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

interface FeedbackFormProps {
  className?: string;
}

export default function FeedbackForm({ className }: FeedbackFormProps) {
  const t = useTranslations('AmazonAnalysis.feedback');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          rating,
          source: 'Amazon Analysis'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Feedback submission failed');
      }
      
      toast.success(t('successMessage'));
      
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
      setRating(5);
    } catch (error) {
      console.error('Feedback error:', error);
      toast.error(t('errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`border-blue-100 dark:border-blue-900 shadow-md ${className}`}>
      <CardHeader className="text-center pb-2 border-b border-blue-100 dark:border-blue-900">
        <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-400">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-blue-200 dark:border-blue-800"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-blue-200 dark:border-blue-800"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="message">{t('message')}</Label>
              <Textarea
                id="message"
                placeholder={t('messagePlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="min-h-[120px] border-blue-200 dark:border-blue-800"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>{t('rating')}</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                t('submit')
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 