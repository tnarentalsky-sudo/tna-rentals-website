import "./globals.css";

export const metadata = {
  title: "TNA Rentals LLC - Reliable Car Rentals in Louisville, Kentucky",
  description: "Find reliable car rentals in Louisville, Kentucky with TNA Rentals LLC. 5-star service, transparent pricing, convenient pickup and delivery. Book now, pay later with no hidden fees.",
  keywords: "Louisville car rental, car rental Louisville Kentucky, TNA Rentals, TNA Rentals, Kentucky car rental, Louisville vacation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        <link rel="preconnect" href="https://tna-rentals-llc.hqrentals.app" />
        <link rel="preconnect" href="https://d352gpv2ubbopv.cloudfront.net" />
        <link rel="dns-prefetch" href="https://tna-rentals-llc.hqrentals.app" />
        <link rel="dns-prefetch" href="https://d352gpv2ubbopv.cloudfront.net" />
        <link rel="preload" href="https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations/assets/integrator" as="script" crossOrigin="anonymous" />

      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
