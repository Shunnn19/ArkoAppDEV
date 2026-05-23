import svgPaths from "./svg-b6li6cy5eq";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgGrandMuseumHallWithClassicalArchitecture from "figma:asset/77ad3737395f700aafd90baaefd436128d25cf21.png";
import imgArkoLogoNew from "figma:asset/6d52972413480d220b4361435979c33967332f76.png";

function GrandMuseumHallWithClassicalArchitecture() {
  return (
    <div className="basis-0 grow max-w-[1520.800048828125px] min-h-px min-w-px relative shrink-0 w-full" data-name="Grand Museum Hall with Classical Architecture">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute inset-0 w-full h-full object-cover" src={imgGrandMuseumHallWithClassicalArchitecture} />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col inset-0 items-start justify-center" data-name="Container">
      <GrandMuseumHallWithClassicalArchitecture />
      <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0.7)] inset-0 to-[rgba(0,0,0,0.4)] via-50% via-[rgba(0,0,0,0.5)]" data-name="Gradient" />
      <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.6)] inset-0 to-[rgba(0,0,0,0)] via-50% via-[rgba(0,0,0,0)]" data-name="Gradient" />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[13.234px] text-center text-nowrap text-white tracking-[0.35px]">
        <p className="leading-[20px]">Naga City Cultural Heritage Network</p>
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return (
    <div className="absolute backdrop-blur-sm backdrop-filter bg-[rgba(255,255,255,0.15)] content-stretch flex items-center left-[240.52px] px-[20.8px] py-[8.8px] rounded-[2.68435e+07px] top-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.25)] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px]" />
      <Container1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col  font-bold justify-center leading-[0] not-italic relative shrink-0 text-[69.328px] text-center text-white tracking-[-1.8px] w-full">
        <p className="leading-[79.2px]">Cultural Heritage</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7.2px] items-center left-0 right-0 top-[132.8px]" data-name="Heading 1">
      <div className="flex flex-col  font-bold justify-center leading-[0] not-italic relative shrink-0 text-[68.203px] text-center text-nowrap text-white tracking-[-1.8px]">
        <p className="leading-[79.2px]">{`Discover Naga's`}</p>
      </div>
      <Container2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 max-w-[768px] right-0 top-[323.1px]" data-name="Container">
      <div className="flex flex-col  font-light justify-center leading-[32.5px] not-italic relative shrink-0 text-[#e2e8f0] text-[17.656px] text-center text-nowrap">
        <p className="mb-0">Explore five magnificent museums showcasing the rich history, art, and culture of Naga City.</p>
        <p className="mb-0">From ancient artifacts to contemporary exhibitions, discover centuries of Bicolano heritage</p>
        <p>in one unified platform.</p>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Component 1">
          <path d={svgPaths.p27c543b0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2" />
          <path d={svgPaths.p2d59bff0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function OverlayOverlayBlur() {
  return (
    <div className="backdrop-blur-sm backdrop-filter bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col items-start p-[12px] relative rounded-[8px] shrink-0" data-name="Overlay+OverlayBlur">
      <Component />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] pt-0 px-0 relative shrink-0" data-name="Margin">
      <OverlayOverlayBlur />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col  font-bold justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-center text-nowrap text-white">
        <p className="leading-[36px]">5</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[2.4px] items-start pb-[1.6px] pt-0 px-0 relative shrink-0" data-name="Container">
      <Container4 />
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5dc] text-[13.016px] text-center text-nowrap">
        <p className="leading-[20px]">Museums</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <Margin />
      <Container5 />
    </div>
  );
}

function OverlayBorderOverlayBlur1() {
  return (
    <div className="backdrop-blur-[6px] backdrop-filter bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col items-start p-[24.8px] relative rounded-[12px] self-stretch shrink-0 w-[240px]" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container6 />
    </div>
  );
}

function Component1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Component 1">
          <path d="M8 2V6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2" />
          <path d="M16 2V6" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2" />
          <path d={svgPaths.p32f12c00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2" />
          <path d="M3 10H21" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function OverlayOverlayBlur1() {
  return (
    <div className="backdrop-blur-sm backdrop-filter bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col items-start p-[12px] relative rounded-[8px] shrink-0" data-name="Overlay+OverlayBlur">
      <Component1 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] pt-0 px-0 relative shrink-0" data-name="Margin">
      <OverlayOverlayBlur1 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col  font-bold justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-center text-nowrap text-white">
        <p className="leading-[36px]">12</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[2.4px] items-start pb-[1.6px] pt-0 px-0 relative shrink-0" data-name="Container">
      <Container7 />
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5dc] text-[12.906px] text-center text-nowrap">
        <p className="leading-[20px]">Active Exhibitions</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <Margin1 />
      <Container8 />
    </div>
  );
}

function OverlayBorderOverlayBlur2() {
  return (
    <div className="backdrop-blur-[6px] backdrop-filter bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col items-start p-[24.8px] relative rounded-[12px] self-stretch shrink-0 w-[240px]" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container9 />
    </div>
  );
}

function Component2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Component 1">
          <path d="M12 6V12L16 14" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2" />
          <path d={svgPaths.pace200} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function OverlayOverlayBlur2() {
  return (
    <div className="backdrop-blur-sm backdrop-filter bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col items-start p-[12px] relative rounded-[8px] shrink-0" data-name="Overlay+OverlayBlur">
      <Component2 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] pt-0 px-0 relative shrink-0" data-name="Margin">
      <OverlayOverlayBlur2 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col  font-bold justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-center text-nowrap text-white">
        <p className="leading-[36px]">7</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[2.4px] items-start pb-[1.6px] pt-0 px-0 relative shrink-0" data-name="Container">
      <Container10 />
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5dc] text-[13.125px] text-center text-nowrap">
        <p className="leading-[20px]">Days Open</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <Margin2 />
      <Container11 />
    </div>
  );
}

function OverlayBorderOverlayBlur3() {
  return (
    <div className="backdrop-blur-[6px] backdrop-filter bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col items-start p-[24.8px] relative rounded-[12px] self-stretch shrink-0 w-[240px]" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container12 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex gap-[24px] items-start justify-center left-0 max-w-[768px] right-0 top-[494px]" data-name="Container">
      <OverlayBorderOverlayBlur1 />
      <OverlayBorderOverlayBlur2 />
      <OverlayBorderOverlayBlur3 />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[671.1px] max-w-[896px] relative shrink-0 w-[768px]" data-name="Container">
      <OverlayBorderOverlayBlur />
      <Heading />
      <Container3 />
      <Container13 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[1280px] px-[32px] py-[80px] relative shrink-0" data-name="Container">
      <Container14 />
    </div>
  );
}

function Section() {
  return (
    <div className="content-stretch flex items-center justify-center min-h-screen relative shrink-0 w-full" data-name="Section">
      <Container />
      <Container15 />
    </div>
  );
}

function Main() {
  return (
    <div className="absolute content-stretch flex flex-col h-[3923px] items-start left-0 right-0 top-0" data-name="Main">
      <Section />
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start pl-0 pr-[12px] py-0 relative shrink-0 w-[52px]" data-name="Margin">
      <div className="relative shrink-0 size-[40px]" data-name="image 138">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgArkoLogoNew} />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[16.875px] text-nowrap">
        <p className="leading-[28px]">Naga City Historical Museums</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col  font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[11.25px] text-nowrap">
        <p className="leading-[16px]">Cultural Heritage Network</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Heading4 />
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Margin3 />
      <Container17 />
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-0 pr-[24px] py-0 relative shrink-0" data-name="Link:margin">
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[0px] text-nowrap">
        <p className="leading-[20px] text-[13.563px]">Home</p>
      </div>
    </div>
  );
}

function LinkMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pl-0 pr-[24px] py-0 relative shrink-0" data-name="Link:margin">
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[0px] text-nowrap">
        <p className="leading-[20px] text-[13.016px]">Exhibitions</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[0px] text-nowrap">
        <p className="leading-[20px] text-[12.688px]">Visit</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Nav">
      <LinkMargin />
      <LinkMargin1 />
      <Link />
    </div>
  );
}

function NavMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-0 pr-[24px] py-0 relative shrink-0" data-name="Nav:margin">
      <Nav />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bottom-[8.8px] content-stretch flex flex-col items-start left-[36.8px] overflow-clip pl-0 pr-[86.88px] py-0 top-[8.8px]" data-name="Container">
      <div className="flex flex-col  font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12.578px] text-nowrap">
        <p className="leading-[normal]">Search collections...</p>
      </div>
    </div>
  );
}

function Container20() {
  return <div className="absolute bottom-[8.8px] left-[36.8px] top-[8.8px] w-[206.4px]" data-name="Container" />;
}

function Input() {
  return (
    <div className="bg-[#f8fafc] h-[36px] overflow-clip relative rounded-[6px] shrink-0 w-[256px]" data-name="Input">
      <Container19 />
      <Container20 />
    </div>
  );
}

function Component3() {
  return (
    <div className="absolute left-[12px] size-[16px] top-1/2 translate-y-[-50%]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Component 1">
          <path d="M14 14L11.1067 11.1067" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p107a080} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Input />
      <Component3 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-start pl-0 pr-[24px] py-0 relative shrink-0" data-name="Margin">
      <Container21 />
    </div>
  );
}

function Container22() {
  const navigate = useNavigate();
  return (
    <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end gap-3 pr-6" data-name="Container">
      <button
        onClick={() => navigate('/register')}
        className="border-2 border-[#334155] text-[#334155] bg-transparent px-5 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#334155] hover:text-white"
      >
        Login
      </button>
      <button
        onClick={() => navigate('/register')}
        className="border-2 border-[#334155] text-[#334155] bg-transparent px-5 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#334155] hover:text-white"
      >
        Register
      </button>
      <button
        onClick={() => navigate('/visitor-scheduling')}
        className="border-2 border-[#334155] text-[#334155] bg-transparent px-5 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#334155] hover:text-white"
      >
        Schedule a Visit
      </button>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex gap-[166.42px] h-[64px] items-center relative shrink-0 w-full" data-name="Container">
      <Container18 />
      <Container22 />
    </div>
  );
}

function Header() {
  return (
    <div className="backdrop-blur-sm backdrop-filter bg-[rgba(255,255,255,0.95)] pointer-events-auto sticky top-0" data-name="Header">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-[0.8px] pt-0 px-[152.4px] relative rounded-[inherit] w-full">
        <Container23 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0px_0px_0.8px] border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-white h-[4041px] min-h-[595.2000122070312px] relative shrink-0 w-full" data-name="Background">
      <Main />
      <div className="absolute h-[4041px] inset-[0_0.2px_0_0] pointer-events-none">
        <Header />
      </div>
    </div>
  );
}

export function Container24() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden" data-name="Container">
      <div className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img alt="" className="w-full h-full object-cover" src={imgGrandMuseumHallWithClassicalArchitecture} />
          <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0.7)] inset-0 to-[rgba(0,0,0,0.4)] via-50% via-[rgba(0,0,0,0.5)]" />
          <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.6)] inset-0 to-[rgba(0,0,0,0)] via-50% via-[rgba(0,0,0,0)]" />
        </div>

        <header className="absolute top-0 left-0 right-0 z-20 backdrop-blur-sm bg-white/95 border-b border-[#e2e8f0] shadow-sm">
          <div className="max-w-[1536px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-[152.4px] h-16">
            <div className="flex items-center gap-3">
              <img alt="" className="w-10 h-10 rounded-lg object-cover" src={imgArkoLogoNew} />
              <div className="hidden sm:block">
                <p className="font-semibold text-[#1e293b] text-[14px] leading-[18px]">Naga City Historical Museums</p>
                <p className="text-[#64748b] text-[11px] leading-[14px]">Cultural Heritage Network</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/register')}
                className="hidden sm:inline-block text-[12px] font-medium text-[#334155] border-2 border-[#334155] bg-transparent px-4 py-1.5 rounded-lg hover:bg-[#334155] hover:text-white transition-all">
                Login
              </button>
              <button onClick={() => navigate('/register')}
                className="hidden sm:inline-block text-[12px] font-medium text-[#334155] border-2 border-[#334155] bg-transparent px-4 py-1.5 rounded-lg hover:bg-[#334155] hover:text-white transition-all">
                Register
              </button>
              <button onClick={() => navigate('/visitor-scheduling')}
                className="hidden sm:inline-block text-[12px] font-medium text-[#334155] border-2 border-[#334155] bg-transparent px-4 py-1.5 rounded-lg hover:bg-[#334155] hover:text-white transition-all">
                Schedule a Visit
              </button>
              <div className="sm:hidden flex items-center gap-2">
                <button onClick={() => navigate('/register')}
                  className="text-[11px] font-medium text-[#334155] border border-[#334155] bg-transparent px-3 py-1 rounded-lg">
                  Login
                </button>
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5" aria-label="Toggle menu">
                  <svg className="w-5 h-5 text-[#334155]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {menuOpen && (
            <div className="sm:hidden border-t border-[#e2e8f0] bg-white px-4 sm:px-6 py-4 space-y-2">
              <button onClick={() => navigate('/register')}
                className="w-full text-[13px] font-medium text-[#334155] border border-[#334155] bg-transparent py-2 rounded-lg">
                Register
              </button>
              <button onClick={() => navigate('/visitor-scheduling')}
                className="w-full text-[13px] font-medium text-[#334155] border border-[#334155] bg-transparent py-2 rounded-lg">
                Schedule a Visit
              </button>
            </div>
          )}
        </header>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24 mt-16">
          <div className="flex flex-col items-center text-center">
            <div className="backdrop-blur-sm bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.25)] px-5 py-2 rounded-full mb-6 sm:mb-8">
              <span className="font-semibold text-white text-[11px] sm:text-[13px] tracking-[0.35px]">Naga City Cultural Heritage Network</span>
            </div>
            <h1 className="font-bold text-white text-[32px] sm:text-[48px] lg:text-[69px] leading-[1.1] sm:leading-[1.15] lg:leading-[79px] tracking-[-1.8px] mb-2">
              Discover Naga&apos;s
            </h1>
            <h1 className="font-bold text-white text-[32px] sm:text-[48px] lg:text-[69px] leading-[1.1] sm:leading-[1.15] lg:leading-[79px] tracking-[-1.8px] mb-6 sm:mb-8">
              Cultural Heritage
            </h1>
            <p className="text-[#e2e8f0] text-[14px] sm:text-[16px] lg:text-[18px] leading-[24px] sm:leading-[28px] lg:leading-[32px] max-w-[768px] font-light">
              Explore five magnificent museums showcasing the rich history, art, and culture of Naga City.
              From ancient artifacts to contemporary exhibitions, discover centuries of Bicolano heritage
              in one unified platform.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 lg:mt-12">
            <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-xl px-8 sm:px-10 py-5 sm:py-6 flex flex-col items-center w-full sm:w-auto">
              <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm rounded-lg p-3 mb-3">
                <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-bold text-white text-[26px] sm:text-[30px] leading-none">5</span>
              <span className="font-semibold text-[#d1d5dc] text-[12px] sm:text-[13px] mt-1">Museums</span>
            </div>
            <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-xl px-8 sm:px-10 py-5 sm:py-6 flex flex-col items-center w-full sm:w-auto">
              <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm rounded-lg p-3 mb-3">
                <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" />
                </svg>
              </div>
              <span className="font-bold text-white text-[26px] sm:text-[30px] leading-none">12</span>
              <span className="font-semibold text-[#d1d5dc] text-[12px] sm:text-[13px] mt-1">Active Exhibitions</span>
            </div>
            <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-xl px-8 sm:px-10 py-5 sm:py-6 flex flex-col items-center w-full sm:w-auto">
              <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-sm rounded-lg p-3 mb-3">
                <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V12L16 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
                </svg>
              </div>
              <span className="font-bold text-white text-[26px] sm:text-[30px] leading-none">7</span>
              <span className="font-semibold text-[#d1d5dc] text-[12px] sm:text-[13px] mt-1">Days Open</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}