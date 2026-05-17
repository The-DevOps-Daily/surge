import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const PAGE = "#09090b";
const SURFACE = "#0f0f12";
const LINE = "rgba(255,255,255,0.08)";
const INK_HIGH = "#fafafa";
const INK_MID = "#a1a1aa";
const INK_LOW = "#71717a";
const ACCENT = "#4ade80";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Your SaaS App";
  const subtitle = searchParams.get("subtitle") || "";
  const type = searchParams.get("type") || "default";

  const isBlog = type === "blog";
  const isDocs = type === "docs";
  const badgeLabel = isBlog ? "Blog" : isDocs ? "Docs" : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200",
          height: "630",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: PAGE,
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "-220px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "440px",
            background:
              "radial-gradient(ellipse at center, rgba(74,222,128,0.10) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {badgeLabel && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 16px",
              borderRadius: "9999px",
              background: SURFACE,
              border: `1px solid ${LINE}`,
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: ACCENT,
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                color: INK_MID,
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {badgeLabel}
            </span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 80px",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontSize: title.length > 50 ? "52px" : "68px",
              fontWeight: 600,
              color: INK_HIGH,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              margin: 0,
              maxWidth: "1000px",
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              style={{
                fontSize: "24px",
                color: INK_MID,
                marginTop: "20px",
                maxWidth: "820px",
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "44px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: INK_HIGH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: PAGE,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 2 22h20L12 2z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "20px",
              color: INK_LOW,
              fontWeight: 500,
            }}
          >
            Your SaaS App
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: LINE,
            display: "flex",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
