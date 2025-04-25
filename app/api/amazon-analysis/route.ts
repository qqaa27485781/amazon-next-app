import { NextRequest, NextResponse } from 'next/server';

// RapidAPI configuration
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '5624ceaf2emshff53188e824ec22p1755a1jsn3d79ebc5ae25';
const RAPIDAPI_HOST = 'real-time-amazon-data.p.rapidapi.com';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { keyword, marketplace = 'us' } = body;

    // Validate input
    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }

    // Use search API to get products
    const searchOptions = {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
        // Add accept header to request JSON explicitly
        'accept': 'application/json'
      },
    };

    // Mock ASIN found in API results
    // In a real implementation, we would first call the search API to get the ASIN
    const mockAsin = 'B09SM24S8C';
    
    // Get product offers information
    console.log(`Fetching product offers for ASIN: ${mockAsin}`);
    const offersUrl = `https://${RAPIDAPI_HOST}/product-offers?asin=${mockAsin}&country=${marketplace.toUpperCase()}&limit=10&page=1`;
    
    try {
      console.log('API Request URL:', offersUrl);
      console.log('Request Headers:', JSON.stringify(searchOptions.headers, null, 2));
      
      const offersResponse = await fetch(offersUrl, searchOptions);
      
      console.log('API Response Status:', offersResponse.status);
      console.log('API Response Status Text:', offersResponse.statusText);
      
      const responseHeaders = Object.fromEntries(offersResponse.headers.entries());
      console.log('API Response Headers:', responseHeaders);
      
      // Check content type to ensure it's JSON
      const contentType = offersResponse.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      // Get response text first for debugging
      const responseText = await offersResponse.text();
      console.log('Response Text Preview (first 300 chars):', responseText.substring(0, 300));
      
      // Check if response is HTML
      if (responseText.trim().toLowerCase().startsWith('<!doctype') || 
          responseText.trim().toLowerCase().startsWith('<html') ||
          responseText.includes('<head>') ||
          responseText.includes('<body>')) {
        console.error('Received HTML instead of JSON. First 500 characters of response:', responseText.substring(0, 500));
        
        // Try to extract useful error information from HTML
        let errorMessage = 'API returned HTML instead of JSON';
        if (responseText.includes('<title>')) {
          const titleMatch = responseText.match(/<title>(.*?)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            errorMessage += ` - Title: ${titleMatch[1]}`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Check response status
      if (!offersResponse.ok) {
        throw new Error(`API responded with status: ${offersResponse.status} ${offersResponse.statusText}`);
      }
      
      // Try to parse JSON
      let offersData;
      try {
        offersData = JSON.parse(responseText);
        console.log('Parsed offersData structure:', Object.keys(offersData));
      } catch (parseError: unknown) {
        console.error('JSON Parse Error:', parseError);
        console.error('Invalid JSON content (first 100 chars):', responseText.substring(0, 100));
        throw new Error(`Failed to parse JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
      
      console.log('API response parsed successfully');
      
      // Check if API returned an error message in JSON format
      if (offersData.error || offersData.message) {
        console.error('API returned error in JSON:', offersData.error || offersData.message);
        throw new Error(`API Error: ${offersData.error || offersData.message}`);
      }
      
      // Extract competitor product information from API
      let topCompetitors = [];
      
      // Define competitor item interface
      interface Competitor {
        name: string;
        price: number;
        rating: number;
        reviewCount: number;
        rank: number;
      }
      
      // Ensure offersData.offers exists and is an array
      if (offersData.offers && Array.isArray(offersData.offers) && offersData.offers.length > 0) {
        topCompetitors = offersData.offers.slice(0, 5).map((offer: any, index: number) => ({
          name: offer.title || `Competitor ${index + 1}`,
          price: parseFloat(offer.price?.value || '0') || (100 + index * 20),
          rating: offer.rating?.rating || (4 + Math.random() * 0.9).toFixed(1),
          reviewCount: offer.rating?.count || 1000 + index * 5000,
          rank: index + 1
        }));
      }
      
      // If no competitor data, use mock data
      const finalCompetitors: Competitor[] = topCompetitors.length > 0 ? topCompetitors : [
        {
          name: `${keyword} Premium Model`,
          price: 129.99,
          rating: 4.7,
          reviewCount: 12450,
          rank: 1
        },
        {
          name: `${keyword} Standard Version`,
          price: 89.99,
          rating: 4.5,
          reviewCount: 8760,
          rank: 2
        },
        {
          name: `${keyword} Budget Option`,
          price: 59.99,
          rating: 4.2,
          reviewCount: 15620,
          rank: 3
        },
        {
          name: `${keyword} Plus`,
          price: 109.99,
          rating: 4.6,
          reviewCount: 6320,
          rank: 4
        },
        {
          name: `${keyword} Mini`,
          price: 69.99,
          rating: 4.3,
          reviewCount: 9540,
          rank: 5
        }
      ];
      
      // Create our response data structure
      const analysisResults = {
        keyword,
        marketplace,
        timestamp: new Date().toISOString(),
        results: {
          overview: {
            searchVolume: 124500,
            searchVolumeTrend: 12,
            averagePrice: finalCompetitors.length > 0 
              ? (finalCompetitors.reduce((sum: number, item: Competitor) => sum + item.price, 0) / finalCompetitors.length).toFixed(2)
              : 45.99,
            averagePriceTrend: -5,
            competitionLevel: finalCompetitors.length > 3 ? "high" : "medium",
            activeSellers: offersData.total_results || 747
          },
          keywordTrends: [
            { month: 'Jan', searchVolume: 4000, competition: 2400 },
            { month: 'Feb', searchVolume: 3000, competition: 1398 },
            { month: 'Mar', searchVolume: 2000, competition: 9800 },
            { month: 'Apr', searchVolume: 2780, competition: 3908 },
            { month: 'May', searchVolume: 1890, competition: 4800 },
            { month: 'Jun', searchVolume: 2390, competition: 3800 },
          ],
          relatedKeywords: [
            {
              keyword: keyword,
              searchVolume: 124500,
              competitionLevel: "high",
              costPerClick: 1.25,
              conversionRate: 3.2
            },
            {
              keyword: keyword + " premium",
              searchVolume: 98700,
              competitionLevel: "high",
              costPerClick: 1.18,
              conversionRate: 2.9
            },
            {
              keyword: keyword + " best",
              searchVolume: 156200,
              competitionLevel: "very high",
              costPerClick: 1.42,
              conversionRate: 3.5
            },
            {
              keyword: keyword + " cheap",
              searchVolume: 78300,
              competitionLevel: "medium", 
              costPerClick: 0.95,
              conversionRate: 4.1
            },
            {
              keyword: keyword + " review",
              searchVolume: 45600,
              competitionLevel: "low",
              costPerClick: 0.78,
              conversionRate: 3.8
            }
          ],
          topCompetitors: finalCompetitors,
          seasonalTrends: [
            { month: 'Jan', sales: 4000 },
            { month: 'Feb', sales: 3000 },
            { month: 'Mar', sales: 2000 },
            { month: 'Apr', sales: 2780 },
            { month: 'May', sales: 1890 },
            { month: 'Jun', sales: 2390 },
            { month: 'Jul', sales: 3490 },
            { month: 'Aug', sales: 4000 },
            { month: 'Sep', sales: 5000 },
            { month: 'Oct', sales: 6000 },
            { month: 'Nov', sales: 7000 },
            { month: 'Dec', sales: 9000 },
          ],
          marketInsights: {
            trends: [
              "Wireless noise cancellation technology is becoming mainstream, with consumers willing to pay more for better noise cancellation experience",
              "Bone conduction headphones are gaining popularity among sports and outdoor enthusiasts",
              "Long battery life has become an important factor for consumer choice",
              "Headphones supporting multi-device connections are favored by office professionals",
              "Waterproof headphones are seeing increased demand, especially among fitness enthusiasts"
            ],
            opportunities: [
              "Keywords for 'low-latency gaming headphones' have low competition but growing search volume",
              "There's a market gap for headphones in the $50-$80 price range, creating opportunities for high value-for-money products",
              "Multi-functional headphones (with integrated voice assistants, translation features) are seeing growing demand",
              "Headphones optimized for video conferencing are an emerging niche market",
              "Easy-to-operate wireless headphones for seniors have almost no competition"
            ]
          },
          // Add raw data from API so frontend can use more information
          apiData: {
            productOffers: offersData,
          }
        }
      };

      // Return results
      return NextResponse.json(analysisResults);
    } catch (apiError: unknown) {
      console.error('API request error:', apiError);
      
      // If API request fails, use mock data
      console.log('Using mock data as fallback due to error:', apiError instanceof Error ? apiError.message : 'Unknown error');
      
      // Create competitor data for mock data
      const mockCompetitors = [
        {
          name: `${keyword} Premium Model`,
          price: 129.99,
          rating: 4.7,
          reviewCount: 12450,
          rank: 1
        },
        {
          name: `${keyword} Standard Version`,
          price: 89.99,
          rating: 4.5,
          reviewCount: 8760,
          rank: 2
        },
        {
          name: `${keyword} Budget Option`,
          price: 59.99,
          rating: 4.2,
          reviewCount: 15620,
          rank: 3
        },
        {
          name: `${keyword} Plus`,
          price: 109.99,
          rating: 4.6,
          reviewCount: 6320,
          rank: 4
        },
        {
          name: `${keyword} Mini`,
          price: 69.99,
          rating: 4.3,
          reviewCount: 9540,
          rank: 5
        }
      ];
      
      // Example data (same as before)
      const mockData = {
        keyword,
        marketplace,
        timestamp: new Date().toISOString(),
        error: {
          message: apiError instanceof Error ? apiError.message : 'Unknown error',
          type: 'api_error',
          details: 'Used fallback data due to API failure'
        },
        results: {
          overview: {
            searchVolume: 124500,
            searchVolumeTrend: 12, // percentage change
            averagePrice: 45.99,
            averagePriceTrend: -5, // percentage change
            competitionLevel: "high",
            activeSellers: 747
          },
          keywordTrends: [
            { month: 'Jan', searchVolume: 4000, competition: 2400 },
            { month: 'Feb', searchVolume: 3000, competition: 1398 },
            { month: 'Mar', searchVolume: 2000, competition: 9800 },
            { month: 'Apr', searchVolume: 2780, competition: 3908 },
            { month: 'May', searchVolume: 1890, competition: 4800 },
            { month: 'Jun', searchVolume: 2390, competition: 3800 },
          ],
          relatedKeywords: [
            {
              keyword: "wireless headphones",
              searchVolume: 124500,
              competitionLevel: "high",
              costPerClick: 1.25,
              conversionRate: 3.2
            },
            {
              keyword: "bluetooth headphones",
              searchVolume: 98700,
              competitionLevel: "high",
              costPerClick: 1.18,
              conversionRate: 2.9
            },
            {
              keyword: "wireless earbuds",
              searchVolume: 156200,
              competitionLevel: "very high",
              costPerClick: 1.42,
              conversionRate: 3.5
            },
            {
              keyword: "noise cancelling headphones",
              searchVolume: 78300,
              competitionLevel: "medium",
              costPerClick: 0.95,
              conversionRate: 4.1
            },
            {
              keyword: "headphones with microphone",
              searchVolume: 45600,
              competitionLevel: "low",
              costPerClick: 0.78,
              conversionRate: 3.8
            }
          ],
          topCompetitors: mockCompetitors,
          seasonalTrends: [
            { month: 'Jan', sales: 4000 },
            { month: 'Feb', sales: 3000 },
            { month: 'Mar', sales: 2000 },
            { month: 'Apr', sales: 2780 },
            { month: 'May', sales: 1890 },
            { month: 'Jun', sales: 2390 },
            { month: 'Jul', sales: 3490 },
            { month: 'Aug', sales: 4000 },
            { month: 'Sep', sales: 5000 },
            { month: 'Oct', sales: 6000 },
            { month: 'Nov', sales: 7000 },
            { month: 'Dec', sales: 9000 },
          ],
          marketInsights: {
            trends: [
              "Wireless noise cancellation technology is becoming mainstream, with consumers willing to pay more for better noise cancellation experience",
              "Bone conduction headphones are gaining popularity among sports and outdoor enthusiasts",
              "Long battery life has become an important factor for consumer choice",
              "Headphones supporting multi-device connections are favored by office professionals",
              "Waterproof headphones are seeing increased demand, especially among fitness enthusiasts"
            ],
            opportunities: [
              "Keywords for 'low-latency gaming headphones' have low competition but growing search volume",
              "There's a market gap for headphones in the $50-$80 price range, creating opportunities for high value-for-money products",
              "Multi-functional headphones (with integrated voice assistants, translation features) are seeing growing demand",
              "Headphones optimized for video conferencing are an emerging niche market",
              "Easy-to-operate wireless headphones for seniors have almost no competition"
            ]
          }
        }
      };
      
      return NextResponse.json(mockData);
    }
  } catch (error: unknown) {
    console.error('Amazon API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze Amazon data', 
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 