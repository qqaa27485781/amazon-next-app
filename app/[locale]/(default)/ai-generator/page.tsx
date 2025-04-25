import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function AIGeneratorPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = await getTranslations('AIGenerator');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-gradient-radial from-orange-200 to-transparent dark:from-orange-900"></div>
        <div className="container relative z-10">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="rounded-full"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
            {t('description')}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
              {t('badges.free')}
            </Badge>
            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
              {t('badges.aiPowered')}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              {t('badges.noRegistration')}
            </Badge>
            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
              {t('badges.unlimited')}
            </Badge>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section className="pb-16 md:pb-24">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="bg-card border rounded-lg shadow-lg p-6">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center">
                <span className="mr-2">{t('generator.title')}</span>
                <Image src="/icons/wand.svg" alt="Magic Wand" width={24} height={24} />
              </h2>
              
              {/* Input Area */}
              <div className="mb-6">
                <div className="bg-muted/50 rounded-lg p-4 mb-2">
                  <textarea 
                    className="w-full bg-transparent border-none focus:outline-none resize-none p-2 min-h-[120px]"
                    placeholder={t('generator.placeholder')}
                  ></textarea>
                  <div className="text-xs text-muted-foreground text-right">
                    {t('generator.tip')}
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="outline" size="sm" className="rounded-full">
                  {t('generator.options.aspect')}
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  {t('generator.options.style')}
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  {t('generator.options.color')}
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  {t('generator.options.lighting')}
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  {t('generator.options.composition')}
                </Button>
              </div>

              {/* Additional Options */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="high-quality" className="rounded" />
                  <label htmlFor="high-quality" className="text-sm">{t('generator.settings.highQuality')}</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remove-background" className="rounded" />
                  <label htmlFor="remove-background" className="text-sm">{t('generator.settings.removeBackground')}</label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="outline">
                  {t('generator.actions.clear')}
                </Button>
                <Button variant="outline">
                  {t('generator.actions.random')}
                </Button>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                  {t('generator.actions.generate')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8">{t('inspiration.title')}</h2>
          <p className="text-center text-lg mb-16 max-w-3xl mx-auto">
            {t('inspiration.description')}
          </p>
          
          {/* 这里可以添加示例展示区 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg overflow-hidden">
              <div className="aspect-square bg-muted"></div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{t('inspiration.example')}</p>
              </div>
            </div>
            <div className="bg-card rounded-lg overflow-hidden">
              <div className="aspect-square bg-muted"></div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{t('inspiration.example')}</p>
              </div>
            </div>
            <div className="bg-card rounded-lg overflow-hidden">
              <div className="aspect-square bg-muted"></div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{t('inspiration.example')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 