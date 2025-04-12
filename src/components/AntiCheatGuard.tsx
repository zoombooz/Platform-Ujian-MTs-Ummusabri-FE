import { useEffect, useState } from "react";

interface ViolationLog {
  reason: string;
  count: number;
  timestamp: string;
}

interface AntiCheatGuardProps {
  maxViolations?: number;
  cooldownMs?: number;
  onViolationLimitReached?: () => void;
  logViolation?: (data: ViolationLog) => void;
}

const AntiCheatGuard: React.FC<AntiCheatGuardProps> = ({
  maxViolations = 3,
  cooldownMs = 3000,
  onViolationLimitReached,
  logViolation,
}) => {
  const [violations, setViolations] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [violationLocked, setViolationLocked] = useState(false);

  useEffect(() => {
    let cooldownTimer: NodeJS.Timeout;

    const triggerViolation = (reason: string) => {
      if (violationLocked) return;

      setViolationLocked(true);
      setWarning(reason);

      setViolations((prev) => {
        const updated = prev + 1;

        const logData: ViolationLog = {
          reason,
          count: updated,
          timestamp: new Date().toISOString(),
        };

        if (logViolation) logViolation(logData);

        if (updated >= maxViolations) {
          setTimeout(() => {
            onViolationLimitReached?.();
          }, 1000); // Give user a sec to read
        }

        return updated;
      });

      cooldownTimer = setTimeout(() => {
        setWarning(null);
        setViolationLocked(false);
      }, cooldownMs);
    };

    const onBlur = () => triggerViolation("Window or Tab Switch");
    const onVisibilityChange = () =>
      document.visibilityState !== "visible" && triggerViolation("Tab Hidden");

    const onKeyDown = (e: KeyboardEvent) => {
      const combo = `${e.ctrlKey ? "Ctrl+" : ""}${e.shiftKey ? "Shift+" : ""}${e.key}`;
      const blocked = ["Ctrl+t", "Ctrl+T", "Ctrl+Shift+T", "PrintScreen", "F12"];
      if (blocked.includes(combo) || e.key === "PrintScreen") {
        e.preventDefault();
        triggerViolation(`Blocked Key: ${combo}`);
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerViolation("Right Click");
    };

    const onCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerViolation(`${e.type.toUpperCase()} attempt`);
    };

    window.addEventListener("blur", onBlur);
    // document.addEventListener("visibilitychange", onVisibilityChange);
    // document.addEventListener("keydown", onKeyDown);
    // document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopyPaste);
    document.addEventListener("paste", onCopyPaste);

    return () => {
      clearTimeout(cooldownTimer);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopyPaste);
      document.removeEventListener("paste", onCopyPaste);
    };
  }, [cooldownMs, maxViolations, onViolationLimitReached, logViolation, violationLocked]);

  return warning ? (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
        padding: "20px",
      }}
    >
      ⚠ Anti-Cheat Warning: {warning} <br />
      {violations}/{maxViolations} violations
  
      <button
        onClick={() => {
          setWarning(null);
          setViolationLocked(false);
        }}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "18px",
          borderRadius: "8px",
          backgroundColor: "#ff4444",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Close Warning
      </button>
    </div>
  ) : null;
};

export default AntiCheatGuard;
