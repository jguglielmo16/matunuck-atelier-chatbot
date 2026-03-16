"use client";
import { useState, useEffect, useRef } from "react";

const restaurantInfo = {
  name: "Matunuck Atelier",
  location: "South Kingstown, Rhode Island",
  hours: "Sunday through Thursday 11:30am–9pm, Friday and Saturday 11:30am–10pm. Open 7 days a week.",
  address: "151 Old Tower Hill Road, South Kingstown, RI 02879",
  phone: "(401) 238-8759",
  cuisine: "Contemporary fine dining — handcrafted pasta, fresh local seafood, farm to table",
  priceRange: "$$$-$$$$",
  parking: "Valet parking available upon arrival. Pull into the parking lot and valets will assist you.",
  reservationLink: "https://www.sevenrooms.com/explore/matunuckatelier/reservations/create/search",
  specialNotes: `
    ABOUT: Matunuck Atelier is the sophisticated sister restaurant to the legendary Matunuck Oyster Bar, opened by oyster farmer and restaurateur Perry Raso in January 2026. Located in the Wakefield business district of South Kingstown. The restaurant celebrates local foodways, global flavors, and the timeless art of culinary hospitality.

    CONCEPT: Farm to table and pond to plate. Menu features refined comfort food, handcrafted pasta made by artisan Gabi Napoli using time-honored family recipes, locally sourced fresh seafood, and seasonal produce.

    SIGNATURE OFFERINGS: Hand-crafted pasta, fresh local oysters, locally sourced seafood, inspired cocktails, global wine vintages, seasonal dishes. Open kitchen with a large window where guests can watch pasta and bread being made.

    CATERING: Full service catering available for weddings, corporate gatherings, and private celebrations. Contact the restaurant to inquire.

    GIFT CARDS: Available for purchase online and in restaurant.

    MARKET: A food market is coming soon as phase two — will feature fresh pasta, bread, oysters, cheese, and artisan food items.

    RESERVATIONS: Reservations strongly recommended. Book online via SevenRooms.

    CONNECTION TO MATUNUCK OYSTER BAR: Sister restaurant to the beloved Matunuck Oyster Bar, which was destroyed by fire in May 2025 and is reopening under a tent in spring at 650 Succotash Road, East Matunuck.

    ATMOSPHERE: Understated coastal sophistication. Elegant and artisanal in every detail. Designed for guests to linger over thoughtfully prepared dishes and conversation. Open kitchen allows guests to watch pasta and bread being made.

    EMPLOYMENT: Job opportunities available — visit the website for details.
  `
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Welcome to Matunuck Atelier! 🦪 I'm here to help you with:

- 📅 Reservations & booking
- 🍝 Menu & dish information
- 🚗 Hours, location & parking
- 🎉 Catering & private events
- 🎁 Gift cards

What can I help you with today?`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages, restaurantInfo }),
    });

    const data = await response.json();
    setMessages([...updatedMessages, { role: "assistant", content: data.message }]);
    setLoading(false);
  };

  return (
    <>
      <div style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px",
        zIndex: 9999,
        fontFamily: "Georgia, serif",
        width: isMobile ? "calc(100vw - 48px)" : "340px",
      }}>

        {isOpen && (
          <div style={{
            width: "100%",
            background: "#fff",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            border: "1px solid #e8e0d5",
            display: "flex",
            flexDirection: "column",
          }}>

            <div style={{
              background: "#2c3e2d",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "rgba(255,255,255,0.15)", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "18px"
              }}>🦪</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#f0ede8", fontSize: "14px", fontWeight: "bold" }}>
                  {restaurantInfo.name}
                </div>
                <div style={{ color: "rgba(240,237,232,0.65)", fontSize: "11px" }}>
                  Typically replies instantly
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{
                background: "none", border: "none", color: "#f0ede8",
                fontSize: "24px", cursor: "pointer", padding: "0 4px",
                lineHeight: 1, minWidth: "36px", minHeight: "36px"
              }}>×</button>
            </div>

            <div style={{
              overflowY: "auto",
              padding: "14px",
              background: "#faf7f2",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              height: isMobile ? "260px" : "300px",
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: "flex", gap: "8px", alignItems: "flex-end",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row"
                }}>
                  {msg.role === "assistant" && (
                    <div style={{
                      width: "26px", height: "26px", borderRadius: "50%",
                      background: "#2c3e2d", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "12px", flexShrink: 0
                    }}>🦪</div>
                  )}
                  <div style={{
                    background: msg.role === "user" ? "#2c3e2d" : "#fff",
                    color: msg.role === "user" ? "#f0ede8" : "#2c3e2d",
                    padding: "9px 13px",
                    borderRadius: msg.role === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                    maxWidth: "75%",
                    fontSize: isMobile ? "15px" : "13px",
                    lineHeight: "1.6",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    whiteSpace: "pre-line"
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    background: "#2c3e2d", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "12px"
                  }}>🦪</div>
                  <div style={{
                    background: "#fff", padding: "9px 13px",
                    borderRadius: "16px 16px 16px 2px",
                    fontSize: "13px", color: "#9a8f83"
                  }}>Typing...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{
              display: "flex",
              padding: isMobile ? "14px" : "12px",
              background: "#fff",
              borderTop: "1px solid #e8e0d5",
              gap: "8px",
              flexShrink: 0
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: isMobile ? "12px 16px" : "9px 14px",
                  borderRadius: "20px",
                  border: "1px solid #e8e0d5",
                  fontSize: isMobile ? "16px" : "13px",
                  outline: "none",
                  fontFamily: "Georgia, serif"
                }}
              />
              <button onClick={sendMessage} style={{
                background: "#2c3e2d", color: "#f0ede8", border: "none",
                borderRadius: "50%",
                width: isMobile ? "44px" : "36px",
                height: isMobile ? "44px" : "36px",
                cursor: "pointer", fontSize: "16px", flexShrink: 0
              }}>→</button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "#2c3e2d", border: "none", cursor: "pointer",
            fontSize: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            alignSelf: "flex-end", flexShrink: 0
          }}>
          {isOpen ? "×" : "🦪"}
        </button>

      </div>
    </>
  );
}
