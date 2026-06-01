import { ImageResponse } from "next/og";

export const alt = "DawnDesk desktop productivity suite";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#090909",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "radial-gradient(circle, rgba(255,196,0,0.36), rgba(255,196,0,0.08) 34%, transparent 64%)",
            height: 520,
            left: 330,
            position: "absolute",
            top: -60,
            width: 540,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: 72, position: "relative", width: "100%" }}>
          <div style={{ color: "#ffc400", fontSize: 28, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase" }}>
            DawnDesk
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 820 }}>
            <div style={{ fontSize: 86, fontWeight: 900, lineHeight: 1.02 }}>Your workflow.</div>
            <div style={{ color: "#ffc400", fontSize: 86, fontWeight: 900, lineHeight: 1.02 }}>All in one place.</div>
          </div>
          <div style={{ color: "rgba(255,255,255,0.74)", fontSize: 30, lineHeight: 1.45, maxWidth: 760 }}>
            Projects, notes, prompts, creative editing, documentation, and support workflows in one focused desktop app.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
