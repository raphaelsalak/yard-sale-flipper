export async function GET(request: Request){
    return new Response('hi')
}
export async function POST(req: Request) {
    const body = await req.json()
    const token = process.env.MY_API_TOKEN;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'X-EBAY-C-ENDUSERCTX': 'affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>'
    };
  const response = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${body.search}&limit=5`, { headers });
  const data = await response.json()

  return Response.json(data)
}