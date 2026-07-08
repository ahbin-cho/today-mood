import MoodApp from "@/components/MoodApp";
import { Wrap, Header, DateText, Title, Subtitle } from "@/components/ui/shell";

export default function Home() {
  return (
    <Wrap>
      <Header>
        <DateText>오늘의 마음 체크인</DateText>
        <Title>지금 마음에 가까운 말을 골라보세요</Title>
        <Subtitle>
          짧게 고르고 적어두면, 오늘의 마음을 편지처럼 정리해드릴게요.
        </Subtitle>
      </Header>

      <MoodApp />
    </Wrap>
  );
}
