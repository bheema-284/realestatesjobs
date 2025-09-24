'use client';
import React from 'react';

export default function MarketingPage({ profile }) {
  // Dummy data for demonstration if profile.marketing is not provided
  const dummyMarketingData = [
    {
      id: 1,
      campaignName: 'Summer Sale 2025',
      platform: 'Google Ads, Facebook Ads',
      status: 'Active',
      budget: '$5,000',
      impressions: '1.2M',
      clicks: '50K',
      conversionRate: '4.5%',
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      description: 'Promotional campaign targeting new customers with discounts on summer products across various digital channels.',
    },
    {
      id: 2,
      campaignName: 'New Product Launch - Q3',
      platform: 'Email Marketing, Instagram',
      status: 'Scheduled',
      budget: '$2,500',
      impressions: 'N/A',
      clicks: 'N/A',
      conversionRate: 'N/A',
      startDate: '2025-09-15',
      endDate: '2025-10-15',
      description: 'Pre-launch and launch campaign for our new innovative gadget, focusing on early adopters and tech enthusiasts.',
    },
    {
      id: 3,
      campaignName: 'Brand Awareness Push',
      platform: 'LinkedIn, Content Marketing',
      status: 'Completed',
      budget: '$3,000',
      impressions: '800K',
      clicks: '15K',
      conversionRate: '1.2%',
      startDate: '2025-03-01',
      endDate: '2025-05-31',
      description: 'Long-term campaign focused on increasing brand recognition and thought leadership in the industry.',
    },
  ];

  const marketingData = profile.marketing && profile.marketing.length > 0 ? profile.marketing : dummyMarketingData;
   return (
    <div className="bg-gradient-to-br mt-5 from-red-50 to-pink-100 p-6 rounded-xl shadow-lg max-w-4xl mx-auto border border-red-200 font-inter">
      <h2 className="text-2xl font-bold text-red-800 mb-5 border-b pb-3 border-red-300">My Marketing Campaigns</h2>
      {marketingData.length > 0 ? (
        <ul className="space-y-6">
          {marketingData.map((campaign) => (
            <li key={campaign.id} className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-grow">
                <h4 className="font-bold text-xl text-gray-900 mb-1">{campaign.campaignName}</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Platform:</span> {campaign.platform}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`font-semibold ${campaign.status === 'Active' ? 'inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 mr-1' :
                      campaign.status === 'Scheduled' ? 'inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800 mr-1' :
                        'text-gray-600'
                    }`}>
                    {campaign.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Budget:</span> {campaign.budget}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Period:</span> {campaign.startDate} to {campaign.endDate}
                </p>
                {campaign.description && (
                  <p className="text-sm text-gray-800 mt-3 leading-relaxed">
                    {campaign.description}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 text-right md:text-left pt-2 md:pt-0">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Impressions:</span> {campaign.impressions}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Clicks:</span> {campaign.clicks}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Conversion Rate:</span> {campaign.conversionRate}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center py-8">No marketing campaigns available.</p>
      )}
    </div>
  );
}
