import {
  Body,
  CodeBlock,
  Container,
  dracula,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface FeedbackEmailProps {
  tune?: ReturnType<import("../../ForzaTune").ForzaTune["toJSON"]> | null;
  feedbackString: string;
}

const baseUrl = import.meta.env.BASE_URL ? `https://${import.meta.env.BASE_URL}` : "";

export const FeedbackEmail = ({ tune, feedbackString }: FeedbackEmailProps) => {
  return (
    <Html lang="en">
      <Head />
      <Body style={main}>
        <Preview>ForzaTunerBox Feedback</Preview>
        <Container style={container}>
          <Section style={header}>
            <Img src={`${baseUrl}/public/FT.png`} width="40" height="40" alt="ForzaTunerBox" />
          </Section>
          <Section style={section}>
            <Text style={text}>{feedbackString}</Text>

            {tune && (
              <CodeBlock theme={dracula} language={"json"} code={JSON.stringify(tune, null, 2)}></CodeBlock>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const container = {
  margin: "0 auto",
  width: "648px",
  maxWidth: "100%",
  position: "relative" as const,
};

const header = {
  width: "100%",
  backgroundColor: "#191919",
  margin: "0 auto",
  paddingBottom: "30px",
  zIndex: "999",
};

const section = {
  margin: "0",
  background: "#fff",
  padding: "0 24px",
};

const text = {
  fontSize: "16px",
};

const main = {
  fontFamily: '"Google Sans",Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
  backgroundColor: "#505050",
  margin: "0",
};
