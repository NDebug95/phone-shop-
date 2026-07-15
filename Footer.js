// Signature UI element for the shop: a battery-style gauge that turns the
// A/B/C condition grade into the same visual language phone buyers already
// use to judge a device — filled bars, like a charge indicator.

function gradeToBars(condition) {
  if (!condition) return 0;
  const letter = condition.trim().charAt(0).toUpperCase();
  if (letter === "A") return 4;
  if (letter === "B") return 3;
  if (letter === "C") return 2;
  return 1;
}

export default function GradeGauge({ condition, compact = false }) {
  if (!condition) return null;
  const filled = gradeToBars(condition);
  const letter = condition.trim().charAt(0).toUpperCase();

  return (
    <span className="grade-gauge" title={condition}>
      <span className="grade-gauge__bars">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`grade-gauge__bar${i < filled ? " is-filled" : ""}`}
          />
        ))}
      </span>
      <span className="grade-gauge__label">
        เกรด {letter}
        {!compact && <span className="text-muted font-normal"> · {condition.replace(/^[A-Z]\s*\(|\)$/g, "")}</span>}
      </span>
    </span>
  );
}
