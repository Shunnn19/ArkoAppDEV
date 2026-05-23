import { Homepage } from "./HomepageLandingPortalPart2";
import { Section3 } from "./HomepageLandingPortalPart3";
import { Footer } from "./HomepageLandingPortalPart4";
import { Section1 } from "./HomepageLandingPortalPart5";
import { Container24 } from "./HomepageLandingPortalPart6";

export default function HomepageLandingPortal() {
  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden"
      data-name="HOMEPAGE - Landing Portal"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(18, 18, 18) 0%, rgb(18, 18, 18) 100%)",
      }}
    >
      <Container24 />
      <Section3 />
      <Homepage />
      <Section1 />
      <Footer />
    </div>
  );
}