import MoodApp from "@/components/MoodApp";

export default function Home() {
  return (
    <main className="wrap">
      <header className="header">
        <p className="date">오늘의 마음 체크인</p>
        <h1 className="title">지금 마음에 가까운 말을 골라보세요</h1>
        <p className="subtitle">
          짧게 고르고 적어두면, 오늘의 마음을 편지처럼 정리해드릴게요.
        </p>
      </header>

      <MoodApp />
    </main>
  );
}
