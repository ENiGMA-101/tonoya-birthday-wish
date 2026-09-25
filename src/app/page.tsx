import BirthdaySite from "@/components/birthday/BirthdaySite";
import birthday from "@/config/birthdayConfig";

export default function Page() {
  return (
    <>
      <noscript>
        <main
          style={{
            padding: "24vh 24px",
            textAlign: "center",
            color: "#f4ead8",
            background: "#070504",
            fontFamily: "Georgia, serif",
          }}
        >
          <h1>
            {birthday.ui.happyBirthday.bn}, {birthday.nickname.bn}
          </h1>
          <p>{birthday.name.bn}</p>
          <p>{birthday.birthDateDisplay.bn}</p>
        </main>
      </noscript>
      <BirthdaySite />
    </>
  );
}
