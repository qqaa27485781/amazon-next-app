import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getTranslations } from 'next-intl/server';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AmazonAnalysisClient from './amazon-analysis/client';
import { locales, localeNames } from "@/i18n/locale";
import Link from 'next/link';
import { MdLanguage } from "react-icons/md";

// Example data, will be replaced by API data
const mockData = {
  keywordTrends: [
    { month: 'Jan', searchVolume: 4000, competition: 2400 },
    { month: 'Feb', searchVolume: 3000, competition: 1398 },
    { month: 'Mar', searchVolume: 2000, competition: 9800 },
    { month: 'Apr', searchVolume: 2780, competition: 3908 },
    { month: 'May', searchVolume: 1890, competition: 4800 },
    { month: 'Jun', searchVolume: 2390, competition: 3800 },
  ],
  competitorProducts: [
    { name: 'Competitor A', sales: 4000, rating: 4.5, price: 29.99 },
    { name: 'Competitor B', sales: 3000, rating: 4.2, price: 24.99 },
    { name: 'Competitor C', sales: 2000, rating: 4.8, price: 39.99 },
    { name: 'Competitor D', sales: 2780, rating: 3.9, price: 19.99 },
    { name: 'Competitor E', sales: 1890, rating: 4.1, price: 34.99 },
  ]
};

export default async function HomePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  // Internationalization can be added later
  const defaultTitle = "Amazon Real-time Data Analysis";
  const defaultDescription = "Analyze Amazon product keywords and market trends to gain valuable market insights";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Language Indicator */}
      <div className="absolute top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-md shadow-md">
        <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <MdLanguage className="text-xl" />
          <span>{localeNames["en"]}</span>
        </div>
      </div>
      
      {/* Top Section */}
      <section className="py-12 md:py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-gradient-radial from-blue-200 to-transparent dark:from-blue-900"></div>
        <div className="container relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            {defaultTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
            {defaultDescription}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              Real-time Analysis
            </Badge>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              Keyword Research
            </Badge>
            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
              Market Insights
            </Badge>
            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
              Competitor Analysis
            </Badge>
          </div>
        </div>
      </section>

      {/* Client component wrapping the rest of the content */}
      <AmazonAnalysisClient />
    </div>
  );
}

// The metadata can be kept if needed
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}`;
  }

  return {
    title: "Amazon Real-time Data Analysis",
    description: "Analyze Amazon product keywords and market trends to gain valuable market insights",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
