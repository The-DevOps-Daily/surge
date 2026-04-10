import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Your SaaS App";
  const subtitle = searchParams.get("subtitle") || "";
  const type = searchParams.get("type") || "default";

  const isBlog = type === "blog";

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
          background: "#0a0a0f",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gradient accent */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background:
              "radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Bottom gradient accent */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "0",
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse at center, rgba(20,184,166,0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Blog badge */}
        {isBlog && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "9999px",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#34d399",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                color: "#34d399",
                fontWeight: 500,
              }}
            >
              Blog
            </span>
          </div>
        )}

        {/* Title */}
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
              fontSize: title.length > 50 ? "48px" : "64px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
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
                color: "#9ca3af",
                marginTop: "16px",
                maxWidth: "800px",
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #10b981, #14b8a6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            S
          </div>
          <span
            style={{
              fontSize: "20px",
              color: "#6b7280",
              fontWeight: 500,
            }}
          >
            Your SaaS App
          </span>
        </div>

        {/* Top border gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #10b981, #14b8a6, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
