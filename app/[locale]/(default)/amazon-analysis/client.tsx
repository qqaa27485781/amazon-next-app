'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslations } from 'next-intl';

// Example data, initial state
const initialData = {
  overview: {
    searchVolume: 0,
    searchVolumeTrend: 0,
    averagePrice: 0,
    averagePriceTrend: 0,
    competitionLevel: "",
    activeSellers: 0
  },
  keywordTrends: [],
  relatedKeywords: [] as Array<{
    keyword: string;
    searchVolume: number;
    competitionLevel: string;
    costPerClick: number;
    conversionRate: number;
  }>,
  topCompetitors: [],
  seasonalTrends: [],
  marketInsights: {
    trends: [],
    opportunities: []
  }
};

// 添加类型定义
interface RelatedKeyword {
  keyword: string;
  searchVolume: number;
  competitionLevel: string;
  costPerClick: number;
  conversionRate: number;
}

interface AnalysisResults {
  overview: {
    searchVolume: number;
    searchVolumeTrend: number;
    averagePrice: number;
    averagePriceTrend: number;
    competitionLevel: string;
    activeSellers: number;
  };
  keywordTrends: any[];
  relatedKeywords: RelatedKeyword[];
  topCompetitors: any[];
  seasonalTrends: any[];
  marketInsights: {
    trends: string[];
    opportunities: string[];
  };
}

export default function AmazonAnalysisClient() {
  const t = useTranslations('AmazonAnalysis');
  
  // States
  const [keyword, setKeyword] = useState('');
  const [marketplace, setMarketplace] = useState('us');
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Analysis results
  const [results, setResults] = useState<AnalysisResults>(initialData);
  
  // Handle keyword input change
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  
  // Handle quick keyword click
  const handleQuickKeyword = (quickKeyword: string) => {
    setKeyword(quickKeyword);
  };
  
  // Handle marketplace selection change
  const handleMarketplaceChange = (value: string) => {
    setMarketplace(value);
  };
  
  // Handle analyze button click
  const handleAnalyze = async () => {
    if (!keyword.trim()) {
      toast.error("Please enter a keyword for analysis");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/amazon-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, marketplace }),
      });
      
      if (!response.ok) {
        throw new Error('Analysis request failed');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Update state with proper type casting
      setResults(data.results as AnalysisResults);
      setHasResults(true);
      toast.success(`Completed analysis for "${keyword}"`);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Convert competition level text
  const getCompetitionLevelText = (level: string) => {
    const levelKey = level.replace(/\s+/g, '').toLowerCase();
    if (levelKey === 'veryhigh') return t('results.competitionLevels.veryHigh');
    if (levelKey === 'high') return t('results.competitionLevels.high');
    if (levelKey === 'medium') return t('results.competitionLevels.medium');
    if (levelKey === 'low') return t('results.competitionLevels.low');
    if (levelKey === 'verylow') return t('results.competitionLevels.veryLow');
    return level;
  };

  return (
    <>
      {/* Search Area */}
      <section className="pb-8 pt-6 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/50 dark:to-background">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <Card className="border border-blue-100 dark:border-blue-900 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-400">{t('search.title')}</CardTitle>
                <CardDescription>{t('search.description')}</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input 
                      type="text" 
                      placeholder={t('search.placeholder')} 
                      className="w-full border-blue-200 dark:border-blue-800 focus-visible:ring-blue-500"
                      value={keyword}
                      onChange={handleKeywordChange}
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <Select 
                      defaultValue={marketplace}
                      onValueChange={handleMarketplaceChange}
                    >
                      <SelectTrigger className="border-blue-200 dark:border-blue-800">
                        <SelectValue placeholder={t('search.selectMarket')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">{t('search.markets.us')}</SelectItem>
                        <SelectItem value="uk">{t('search.markets.uk')}</SelectItem>
                        <SelectItem value="de">{t('search.markets.de')}</SelectItem>
                        <SelectItem value="ca">{t('search.markets.ca')}</SelectItem>
                        <SelectItem value="jp">{t('search.markets.jp')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Button 
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md"
                      onClick={handleAnalyze}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('search.analyzing')}
                        </>
                      ) : t('search.analyze')}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <p className="text-sm text-muted-foreground mr-2 pt-1">{t('search.popularSearches')}</p>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-800"
                    onClick={() => handleQuickKeyword(t('search.keywords.wireless'))}
                  >
                    {t('search.keywords.wireless')}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-800"
                    onClick={() => handleQuickKeyword(t('search.keywords.electronics'))}
                  >
                    {t('search.keywords.electronics')}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-800"
                    onClick={() => handleQuickKeyword(t('search.keywords.smarthome'))}
                  >
                    {t('search.keywords.smarthome')}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-800"
                    onClick={() => handleQuickKeyword(t('search.keywords.phonecase'))}
                  >
                    {t('search.keywords.phonecase')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Analysis Results */}
      {(isLoading || hasResults) && (
        <section className="pb-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-blue-100 dark:border-blue-900">
                  <Loader2 className="h-16 w-16 animate-spin text-blue-600 mb-6" />
                  <p className="text-lg text-muted-foreground">{t('results.analyzing')} "<span className="font-semibold text-blue-600 dark:text-blue-400">{keyword}</span>" 的Amazon市场数据...</p>
                </div>
              ) : (
                <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-6 rounded-lg overflow-hidden p-1 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-blue-900">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 rounded-md">{t('results.tabs.overview')}</TabsTrigger>
                    <TabsTrigger value="keywords" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 rounded-md">{t('results.tabs.keywords')}</TabsTrigger>
                    <TabsTrigger value="competitors" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 rounded-md">{t('results.tabs.competitors')}</TabsTrigger>
                    <TabsTrigger value="trends" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 rounded-md">{t('results.tabs.trends')}</TabsTrigger>
                  </TabsList>
                  
                  {/* Overview Tab */}
                  <TabsContent value="overview">
                    <Card className="border border-blue-100 dark:border-blue-900 shadow-md">
                      <CardHeader className="pb-2 border-b border-blue-100 dark:border-blue-900">
                        <CardTitle className="text-xl text-blue-700 dark:text-blue-400">{t('results.overview.title')}</CardTitle>
                        <CardDescription>{t('results.overview.description')} "<span className="font-medium">{keyword}</span>"</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <Card className="bg-blue-50/50 dark:bg-slate-900 border border-blue-100 dark:border-blue-900">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">{t('results.overview.searchVolume')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{results.overview.searchVolume.toLocaleString()}</div>
                              <p className="text-xs text-muted-foreground">
                                {results.overview.searchVolumeTrend > 0 ? (
                                  <span className="text-green-500">↑ {results.overview.searchVolumeTrend}%</span>
                                ) : (
                                  <span className="text-red-500">↓ {Math.abs(results.overview.searchVolumeTrend)}%</span>
                                )} {t('results.overview.vsLastMonth')}
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="bg-blue-50/50 dark:bg-slate-900 border border-blue-100 dark:border-blue-900">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">{t('results.overview.averagePrice')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">${results.overview.averagePrice}</div>
                              <p className="text-xs text-muted-foreground">
                                {results.overview.averagePriceTrend > 0 ? (
                                  <span className="text-green-500">↑ {results.overview.averagePriceTrend}%</span>
                                ) : (
                                  <span className="text-red-500">↓ {Math.abs(results.overview.averagePriceTrend)}%</span>
                                )} {t('results.overview.vsLastMonth')}
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="bg-blue-50/50 dark:bg-slate-900 border border-blue-100 dark:border-blue-900">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">{t('results.overview.competitionLevel')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{getCompetitionLevelText(results.overview.competitionLevel)}</div>
                              <p className="text-xs text-muted-foreground">
                                {results.overview.activeSellers} {t('results.overview.activeSellers')}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="h-80 w-full bg-white dark:bg-slate-900 p-4 rounded-lg border border-blue-50 dark:border-blue-950">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={results.keywordTrends}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                              <YAxis tick={{ fill: '#6b7280' }} />
                              <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                              <Legend wrapperStyle={{ paddingTop: '10px' }} />
                              <Line 
                                type="monotone" 
                                dataKey="searchVolume" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                name="搜索量" 
                                dot={{ r: 4, fill: '#3b82f6' }}
                                activeDot={{ r: 6, fill: '#2563eb' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="competition" 
                                stroke="#ec4899" 
                                strokeWidth={2}
                                name="竞争度" 
                                dot={{ r: 4, fill: '#ec4899' }}
                                activeDot={{ r: 6, fill: '#d946ef' }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Keywords Analysis Tab */}
                  <TabsContent value="keywords">
                    <Card className="border border-blue-100 dark:border-blue-900 shadow-md">
                      <CardHeader className="pb-2 border-b border-blue-100 dark:border-blue-900">
                        <CardTitle className="text-xl text-blue-700 dark:text-blue-400">{t('results.keywords.title')}</CardTitle>
                        <CardDescription>{t('results.keywords.description')}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-blue-100 dark:border-blue-900">
                                <th className="text-left py-3 px-2 font-medium text-blue-700 dark:text-blue-400">{t('results.keywords.table.keyword')}</th>
                                <th className="text-right py-3 px-2 font-medium text-blue-700 dark:text-blue-400">{t('results.keywords.table.searchVolume')}</th>
                                <th className="text-right py-3 px-2 font-medium text-blue-700 dark:text-blue-400">{t('results.keywords.table.competitionLevel')}</th>
                                <th className="text-right py-3 px-2 font-medium text-blue-700 dark:text-blue-400">{t('results.keywords.table.costPerClick')}</th>
                                <th className="text-right py-3 px-2 font-medium text-blue-700 dark:text-blue-400">{t('results.keywords.table.conversionRate')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results.relatedKeywords.map((kw, index) => (
                                <tr key={index} className="border-b border-blue-50 dark:border-blue-950 hover:bg-blue-50/50 dark:hover:bg-blue-950/50">
                                  <td className="py-3 px-2 font-medium">{kw.keyword}</td>
                                  <td className="text-right py-3 px-2">{kw.searchVolume.toLocaleString()}</td>
                                  <td className="text-right py-3 px-2">
                                    <Badge className={
                                      kw.competitionLevel === 'very high' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 hover:bg-red-200' :
                                      kw.competitionLevel === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 hover:bg-orange-200' :
                                      kw.competitionLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 hover:bg-yellow-200' :
                                      'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 hover:bg-green-200'
                                    }>
                                      {getCompetitionLevelText(kw.competitionLevel)}
                                    </Badge>
                                  </td>
                                  <td className="text-right py-3 px-2">${kw.costPerClick}</td>
                                  <td className="text-right py-3 px-2">{kw.conversionRate}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Competitors Analysis Tab */}
                  <TabsContent value="competitors">
                    <Card className="border border-blue-100 dark:border-blue-900 shadow-md">
                      <CardHeader className="pb-2 border-b border-blue-100 dark:border-blue-900">
                        <CardTitle className="text-xl text-blue-700 dark:text-blue-400">{t('results.competitors.title')}</CardTitle>
                        <CardDescription>{t('results.competitors.description')}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {results.topCompetitors && results.topCompetitors.length > 0 ? (
                          <>
                            <div className="h-80 w-full mb-8 bg-white dark:bg-slate-900 p-4 rounded-lg border border-blue-50 dark:border-blue-950">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={results.topCompetitors}
                                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                                  <YAxis yAxisId="right" orientation="right" stroke="#ec4899" />
                                  <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                  <Bar yAxisId="left" dataKey="reviewCount" fill="#3b82f6" name={t('results.competitors.reviewCount')} radius={[4, 4, 0, 0]} />
                                  <Bar yAxisId="right" dataKey="price" fill="#ec4899" name={t('results.competitors.price')} radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                            
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-blue-100 dark:border-blue-900">
                                    <th className="text-left py-3 px-2 font-medium text-blue-700 dark:text-blue-400">{t('results.competitors.table.product')}</th>
                                    <th className="text-right py-3 px-2 font-medium text-blue-700 dark:text-blue-400">{t('results.competitors.table.price')}</th>
                                    <th className="text-right py-3 px-2 font-medium text-blue-700 dark:text-blue-400">{t('results.competitors.table.rating')}</th>
                                    <th className="text-right py-3 px-2 font-medium text-blue-700 dark:text-blue-400">{t('results.competitors.table.reviewCount')}</th>
                                    <th className="text-right py-3 px-2 font-medium text-blue-700 dark:text-blue-400">{t('results.competitors.table.rank')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {results.topCompetitors.map((comp, index) => (
                                    <tr key={index} className="border-b border-blue-50 dark:border-blue-950 hover:bg-blue-50/50 dark:hover:bg-blue-950/50">
                                      <td className="py-3 px-2 font-medium">{comp.name}</td>
                                      <td className="text-right py-3 px-2">${comp.price.toFixed(2)}</td>
                                      <td className="text-right py-3 px-2">
                                        <span className="flex items-center justify-end">
                                          <span className="text-yellow-500 mr-1">★</span> {comp.rating}
                                        </span>
                                      </td>
                                      <td className="text-right py-3 px-2">{comp.reviewCount.toLocaleString()}</td>
                                      <td className="text-right py-3 px-2">
                                        <Badge variant="outline" className="border-blue-200 dark:border-blue-800">
                                          #{comp.rank}
                                        </Badge>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-12 bg-blue-50/50 dark:bg-slate-900 rounded-lg">
                            <p className="text-lg text-muted-foreground text-center mb-4">{t('results.competitors.noData')}</p>
                            <p className="text-sm text-muted-foreground text-center">
                              {t('results.competitors.tryDifferent')}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Trends Insights Tab */}
                  <TabsContent value="trends">
                    <Card className="border border-blue-100 dark:border-blue-900 shadow-md">
                      <CardHeader className="pb-2 border-b border-blue-100 dark:border-blue-900">
                        <CardTitle className="text-xl text-blue-700 dark:text-blue-400">{t('results.trends.title')}</CardTitle>
                        <CardDescription>{t('results.trends.description')}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="mb-8">
                          <h3 className="font-semibold mb-3 text-blue-700 dark:text-blue-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            {t('results.trends.hotTrends')}
                          </h3>
                          <ul className="list-disc pl-5 space-y-2 bg-white dark:bg-slate-900 p-4 rounded-lg border border-blue-50 dark:border-blue-950">
                            {results.marketInsights.trends.map((trend, index) => (
                              <li key={index} className="text-gray-700 dark:text-gray-300">{trend}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mb-8">
                          <h3 className="font-semibold mb-3 text-blue-700 dark:text-blue-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd" />
                            </svg>
                            {t('results.trends.seasonalTrends')}
                          </h3>
                          <div className="h-60 w-full bg-white dark:bg-slate-900 p-4 rounded-lg border border-blue-50 dark:border-blue-950">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={results.seasonalTrends}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                                <YAxis tick={{ fill: '#6b7280' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Line 
                                  type="monotone" 
                                  dataKey="sales" 
                                  stroke="#3b82f6" 
                                  strokeWidth={2} 
                                  name={t('results.trends.sales')}
                                  dot={{ r: 4, fill: '#3b82f6' }}
                                  activeDot={{ r: 6, fill: '#2563eb' }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          <p className="text-sm text-muted-foreground mt-3 italic">
                            {t('results.trends.seasonalNote')}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-3 text-blue-700 dark:text-blue-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                            </svg>
                            {t('results.trends.opportunities')}
                          </h3>
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-5 rounded-lg border border-blue-100 dark:border-blue-900">
                            <ul className="list-disc pl-5 space-y-2">
                              {results.marketInsights.opportunities.map((opp, index) => (
                                <li key={index} className="text-gray-700 dark:text-gray-300">{opp}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
} 