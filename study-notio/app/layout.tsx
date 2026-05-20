import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyNotio — AI Maths Tutoring",
  description: "Upload any maths content. Get a personalised study plan. Learn from an AI that actually teaches.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{__html: `
          window.addEventListener('pageshow', function(e) {
            if (e.persisted) window.location.reload();
          });
        `}} />
        {children}
      </body>
    </html>
  );
}