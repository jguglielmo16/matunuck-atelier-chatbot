export const metadata = {
  title: "Matunuck Atelier",
  description: "AI-powered restaurant assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#f5f0ea" }}>
        {children}
      </body>
    </html>
  );
}
