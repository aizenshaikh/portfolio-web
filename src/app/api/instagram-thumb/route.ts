import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  // Only allow Instagram URLs (prevent SSRF)
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("instagram.com")) {
      return NextResponse.json({ error: "Not an Instagram URL" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    // Use Meta's own crawler UA — Instagram returns og tags to this
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Instagram fetch failed" }, { status: 502 });
    }

    const html = await res.text();

    // Try multiple extraction patterns
    const patterns = [
      /<meta\s+property="og:image"\s+content="([^"]+)"/,
      /<meta\s+content="([^"]+)"\s+property="og:image"/,
      /"thumbnail_url":"([^"]+)"/,
      /"display_url":"([^"]+)"/,
    ];

    for (const pat of patterns) {
      const m = html.match(pat);
      if (m) {
        const thumbUrl = m[1]
          .replace(/\\u0026/g, "&")
          .replace(/&amp;/g, "&")
          .replace(/\\\//g, "/");
        return NextResponse.json(
          { thumbUrl },
          { headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } }
        );
      }
    }

    return NextResponse.json({ error: "No thumbnail found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
