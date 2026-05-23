import svgPaths from "./svg-b6li6cy5eq";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgMuseoDelSeminarioConcilarDeNuevaCaceres from "figma:asset/7e1c7f532d36b4228e406be94ea6bead50fcb5f5.png";
import imgUniversityOfNuevaCaceresMuseum from "figma:asset/a886498c27d24d2519aaf6a4b6c42b4d3533cb3f.png";
import imgMuseoHayskulano from "figma:asset/24458c0696fc66fd9e6452218ee5f27c421f267e.png";
import imgPenafranciaMuseum from "figma:asset/dac963d66f8c518efde6d89dd656cdae3bc00798.png";
import imgJesseMRobredoMuseum from "figma:asset/06c2c50413bd0cd66401332508eb2c78fab87ba4.png";

function Component11() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Component 1">
          <path d="M12 6V12L16 14" id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.pace200} id="Vector_2" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(51,65,85,0.1)] content-stretch flex flex-col items-start p-[12px] relative rounded-[8px] shrink-0" data-name="Overlay">
      <Component11 />
    </div>
  );
}

function Margin13() {
  return (
    <div className="content-stretch flex flex-col items-start pl-0 pr-[16px] py-0 relative shrink-0" data-name="Margin">
      <Overlay />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[17.016px] w-full">
        <p className="leading-[28px]">Operating Hours</p>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(15,118,110,0.1)] content-stretch flex items-start px-[12.8px] py-[6.8px] relative rounded-[2.68435e+07px] shrink-0" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(15,118,110,0.2)] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px]" />
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0f766e] text-[11.438px] text-nowrap">
        <p className="leading-[16px]">Open daily</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[12px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <Heading3 />
      <OverlayBorder />
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <Margin13 />
      <Container45 />
    </div>
  );
}

function Container47() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-[22px] pt-[24px] px-[24px] relative w-full">
          <Container46 />
        </div>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col  font-normal justify-center leading-[22.75px] not-italic relative shrink-0 text-[#64748b] text-[12.906px] w-full">
        <p className="mb-0">Current hours, holiday schedules, and special opening</p>
        <p>times</p>
      </div>
    </div>
  );
}

function Component12() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[16px]" data-name="Component 1">
      <div className="absolute bottom-1/2 left-[20.83%] right-[20.83%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.67px_-7.14%]" style={{ "--stroke-0": "rgba(30, 41, 59, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 2">
            <path d="M0.666667 0.666667H10" id="Vector" stroke="var(--stroke-0, #1E293B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[20.83%] left-1/2 right-[20.83%] top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-14.29%]" style={{ "--stroke-0": "rgba(30, 41, 59, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 11">
            <path d={svgPaths.p3f0cc030} id="Vector" stroke="var(--stroke-0, #1E293B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Component12 />
    </div>
  );
}

function SvgMargin4() {
  return (
    <div className="content-stretch flex flex-col h-[16px] items-start pl-[8px] pr-0 py-0 relative shrink-0 w-[24px]" data-name="SVG:margin">
      <Svg2 />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white h-[40px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[12.8px] py-[8.8px] relative size-full">
          <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[12.797px] text-center text-nowrap">
            <p className="leading-[20px]">Check Hours</p>
          </div>
          <SvgMargin4 />
        </div>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start pb-[24px] pt-0 px-[24px] relative w-full">
          <Container48 />
          <Button3 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="absolute bg-white left-0 right-[832px] rounded-[12px] top-0" data-name="Background+Border+Shadow">
      <div className="content-stretch flex flex-col gap-[23.175px] items-start overflow-clip p-[0.8px] relative rounded-[inherit] w-full">
        <Container47 />
        <Container49 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_3px_3px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Component13() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Component 1">
          <path d={svgPaths.p6b45080} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2962b330} id="Vector_2" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 12H14" id="Vector_3" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(51,65,85,0.1)] content-stretch flex flex-col items-start p-[12px] relative rounded-[8px] shrink-0" data-name="Overlay">
      <Component13 />
    </div>
  );
}

function Margin14() {
  return (
    <div className="content-stretch flex flex-col items-start pl-0 pr-[16px] py-0 relative shrink-0" data-name="Margin">
      <Overlay1 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[16.594px] w-full">
        <p className="leading-[28px]">Featured Collections</p>
      </div>
    </div>
  );
}

function OverlayBorder1() {
  return (
    <div className="bg-[rgba(15,118,110,0.1)] content-stretch flex items-start px-[12.8px] py-[6.8px] relative rounded-[2.68435e+07px] shrink-0" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(15,118,110,0.2)] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px]" />
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0f766e] text-[10.875px] text-nowrap">
        <p className="leading-[16px]">Over 2,000 items</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[12px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <Heading6 />
      <OverlayBorder1 />
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <Margin14 />
      <Container50 />
    </div>
  );
}

function Container52() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-[22px] pt-[24px] px-[24px] relative w-full">
          <Container51 />
        </div>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col  font-normal justify-center leading-[22.75px] not-italic relative shrink-0 text-[#64748b] text-[13.016px] w-full">
        <p className="mb-0">Curated highlights from our most treasured artifacts</p>
        <p>and artworks</p>
      </div>
    </div>
  );
}

function Component14() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[16px]" data-name="Component 1">
      <div className="absolute bottom-1/2 left-[20.83%] right-[20.83%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.67px_-7.14%]" style={{ "--stroke-0": "rgba(30, 41, 59, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 2">
            <path d="M0.666667 0.666667H10" id="Vector" stroke="var(--stroke-0, #1E293B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[20.83%] left-1/2 right-[20.83%] top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-14.29%]" style={{ "--stroke-0": "rgba(30, 41, 59, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 11">
            <path d={svgPaths.p3f0cc030} id="Vector" stroke="var(--stroke-0, #1E293B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Component14 />
    </div>
  );
}

function SvgMargin5() {
  return (
    <div className="content-stretch flex flex-col h-[16px] items-start pl-[8px] pr-0 py-0 relative shrink-0 w-[24px]" data-name="SVG:margin">
      <Svg3 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-white h-[40px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[12.8px] py-[8.8px] relative size-full">
          <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[12.797px] text-center text-nowrap">
            <p className="leading-[20px]">Browse Collections</p>
          </div>
          <SvgMargin5 />
        </div>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start pb-[24px] pt-0 px-[24px] relative w-full">
          <Container53 />
          <Button4 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="absolute bg-white left-[416px] right-[416px] rounded-[12px] top-0" data-name="Background+Border+Shadow">
      <div className="content-stretch flex flex-col gap-[23.175px] items-start overflow-clip p-[0.8px] relative rounded-[inherit] w-full">
        <Container52 />
        <Container54 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_3px_3px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Component15() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Component 1">
          <path d={svgPaths.p27c543b0} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2d59bff0} id="Vector_2" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="bg-[rgba(51,65,85,0.1)] content-stretch flex flex-col items-start p-[12px] relative rounded-[8px] shrink-0" data-name="Overlay">
      <Component15 />
    </div>
  );
}

function Margin15() {
  return (
    <div className="content-stretch flex flex-col items-start pl-0 pr-[16px] py-0 relative shrink-0" data-name="Margin">
      <Overlay2 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[16.734px] w-full">
        <p className="leading-[28px]">Museum Locations</p>
      </div>
    </div>
  );
}

function OverlayBorder2() {
  return (
    <div className="bg-[rgba(15,118,110,0.1)] content-stretch flex items-start px-[12.8px] py-[6.8px] relative rounded-[2.68435e+07px] shrink-0" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(15,118,110,0.2)] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px]" />
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0f766e] text-[11.25px] text-nowrap">
        <p className="leading-[16px]">Downtown area</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[12px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <Heading7 />
      <OverlayBorder2 />
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <Margin15 />
      <Container55 />
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-[22px] pt-[24px] px-[24px] relative w-full">
          <Container56 />
        </div>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col  font-normal justify-center leading-[22.75px] not-italic relative shrink-0 text-[#64748b] text-[13.125px] w-full">
        <p className="mb-0">Interactive map showing all museum locations and</p>
        <p>transportation</p>
      </div>
    </div>
  );
}

function Component16() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[16px]" data-name="Component 1">
      <div className="absolute bottom-1/2 left-[20.83%] right-[20.83%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.67px_-7.14%]" style={{ "--stroke-0": "rgba(30, 41, 59, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 2">
            <path d="M0.666667 0.666667H10" id="Vector" stroke="var(--stroke-0, #1E293B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[20.83%] left-1/2 right-[20.83%] top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-14.29%]" style={{ "--stroke-0": "rgba(30, 41, 59, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 11">
            <path d={svgPaths.p3f0cc030} id="Vector" stroke="var(--stroke-0, #1E293B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Component16 />
    </div>
  );
}

function SvgMargin6() {
  return (
    <div className="content-stretch flex flex-col h-[16px] items-start pl-[8px] pr-0 py-0 relative shrink-0 w-[24px]" data-name="SVG:margin">
      <Svg4 />
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white h-[40px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[12.8px] py-[8.8px] relative size-full">
          <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[13.234px] text-center text-nowrap">
            <p className="leading-[20px]">View Map</p>
          </div>
          <SvgMargin6 />
        </div>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start pb-[24px] pt-0 px-[24px] relative w-full">
          <Container58 />
          <Button5 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div className="absolute bg-white left-[832px] right-0 rounded-[12px] top-0" data-name="Background+Border+Shadow">
      <div className="content-stretch flex flex-col gap-[23.175px] items-start overflow-clip p-[0.8px] relative rounded-[inherit] w-full">
        <Container57 />
        <Container59 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_3px_3px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute h-[581.38px] left-[32px] right-[32px] top-[226.85px]" data-name="Container">
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
      <BackgroundBorderShadow2 />
    </div>
  );
}

function Margin16() {
  return (
    <div className="content-stretch flex flex-col h-[8px] items-start pl-0 pr-[12px] py-0 relative shrink-0 w-[20px]" data-name="Margin">
      <div className="bg-[#334155] rounded-[2.68435e+07px] shrink-0 size-[8px]" data-name="Background" />
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col  font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#334155] text-[12.469px] text-center text-nowrap">
        <p className="leading-[20px]">Quick Access</p>
      </div>
    </div>
  );
}

function OverlayBorderShadow() {
  return (
    <div className="absolute bg-[rgba(51,65,85,0.1)] left-[532.06px] rounded-[2.68435e+07px] top-0" data-name="Overlay+Border+Shadow">
      <div className="content-stretch flex items-center overflow-clip px-[24.8px] py-[12.8px] relative rounded-[inherit]">
        <Margin16 />
        <Container61 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(51,65,85,0.2)] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-[272px] max-w-[672px] right-[272px] top-[133px]" data-name="Container">
      <div className="flex flex-col  font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[16.734px] text-center text-nowrap">
        <p className="leading-[29.25px]">Everything you need to plan and enhance your museum experience</p>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-[77.6px]" data-name="Heading 2">
      <div className="flex flex-col  font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[34.453px] text-center text-nowrap">
        <p className="leading-[40px]">Quick Information Access</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="absolute h-[162.85px] left-[32px] right-[32px] top-0" data-name="Container">
      <div className="absolute bg-[rgba(51,65,85,0.05)] blur-[32px] filter left-1/2 rounded-[2.68435e+07px] size-[128px] top-[32px] translate-x-[-50%]" data-name="Overlay+Blur" />
      <div className="absolute bg-[rgba(15,118,110,0.05)] blur-[20px] filter left-1/2 rounded-[2.68435e+07px] size-[96px] top-[48px] translate-x-[-50%]" data-name="Overlay+Blur" />
      <OverlayBorderShadow />
      <Container62 />
      <Heading1 />
    </div>
  );
}

function Container64() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const navigate = useNavigate();
  
  const upcomingEvents = [
    { id: 1, title: "Colonial Architecture Exhibition", museum: "Museo del Seminario Conciliar", date: "January 15-28, 2026", time: "9:00 AM - 5:00 PM", description: "Explore the architectural heritage of Spanish colonial period through restored artifacts, original blueprints, and 3D reconstructions of historical buildings in Naga City.", image: imgMuseoDelSeminarioConcilarDeNuevaCaceres },
    { id: 2, title: "Bicolano Manuscript Workshop", museum: "University of Nueva Caceres Museum", date: "January 20, 2026", time: "2:00 PM - 4:30 PM", description: "Interactive workshop on ancient Bikol writing systems and manuscript preservation techniques. Learn to identify historical documents and understand their cultural significance.", image: imgUniversityOfNuevaCaceresMuseum },
    { id: 3, title: "Heritage Film Screening: Naga Stories", museum: "Museo Hayskulano", date: "January 22, 2026", time: "6:00 PM - 8:00 PM", description: "Documentary screening showcasing oral histories and personal narratives from Naga City residents, followed by panel discussion with local historians and filmmakers.", image: imgMuseoHayskulano },
    { id: 4, title: "Devotional Art & INA Collection", museum: "Peñafrancia Museum", date: "January 25 - February 10, 2026", time: "8:00 AM - 6:00 PM", description: "Special exhibition featuring devotional artworks, religious artifacts, and the history of the Peñafrancia devotion in the Bicol region spanning three centuries.", image: imgPenafranciaMuseum },
    { id: 5, title: "Good Governance Legacy Talk", museum: "Jesse M. Robredo Museum", date: "February 1, 2026", time: "3:00 PM - 5:00 PM", description: "Commemorative lecture series on leadership and public service, featuring testimonials and interactive exhibits on local governance and community development.", image: imgJesseMRobredoMuseum }
  ];

  const timelineMilestones = [
    { year: "1595", title: "Foundation of Nueva Caceres", description: "Spanish colonial government established, marking the beginning of documented history in the region that would later house numerous museums.", icon: "🏛️" },
    { year: "1868", title: "Seminary Establishment", description: "Seminario Conciliar de Nueva Caceres founded, eventually becoming home to one of the region's most important historical collections.", icon: "⛪" },
    { year: "1948", title: "UNC Museum Origins", description: "University of Nueva Caceres established, beginning its tradition of preserving Bicolano cultural artifacts and academic heritage.", icon: "🎓" },
    { year: "1985", title: "Peñafrancia Museum", description: "Dedicated museum established to preserve and showcase the rich devotional history and artifacts of Our Lady of Peñafrancia.", icon: "✨" },
    { year: "2014", title: "Jesse M. Robredo Museum", description: "Museum inaugurated to honor Secretary Jesse Robredo's legacy of good governance, transparency, and public service.", icon: "🕊️" },
    { year: "2020s", title: "Digital Heritage Network", description: "Launch of unified digital platform connecting all Naga City museums, making cultural heritage accessible to global audiences.", icon: "🌐" }
  ];

  return (
    <div className="h-auto max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <div className="relative w-full mb-16" data-name="EventsSection">
        <div className="absolute bg-[rgba(172,0,0,0.03)] blur-[32px] filter left-1/2 rounded-full size-[128px] top-[32px] translate-x-[-50%]" />
        <div className="absolute bg-[rgba(172,0,0,0.05)] blur-[20px] filter left-1/2 rounded-full size-[96px] top-[48px] translate-x-[-50%]" />
        <div className="relative text-center mb-12 pt-16">
          <div className="inline-flex items-center gap-2 bg-[rgba(172,0,0,0.1)] px-6 py-3 rounded-full mb-6">
            <div className="bg-[#AC0000] rounded-full size-[8px]" />
            <div className="font-semibold text-[#AC0000] text-[13px]">Upcoming Events</div>
          </div>
          <h2 className="font-bold text-[#1e293b] text-[34px] leading-[40px] mb-4">Experience History in Action</h2>
          <p className="text-[#64748b] text-[16px] leading-[29px] max-w-[672px] mx-auto">Join us for exhibitions, workshops, and cultural programs across Naga's museums</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
          {upcomingEvents.map((event) => (
            <div key={event.id} onClick={() => setSelectedEvent(event)} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm hover:shadow-lg hover:border-[#334155] transition-all duration-300 cursor-pointer group overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 bg-[#334155] text-white px-3 py-1 rounded-full text-xs font-semibold">{event.date.split(',')[0]}</div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#1e293b] text-[16px] leading-[22px] mb-2 group-hover:text-[#334155] transition-colors">{event.title}</h3>
                <div className="flex items-center gap-2 text-[#64748b] text-[13px] mb-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="line-clamp-1">{event.museum}</span>
                </div>
                <p className="text-[#64748b] text-[13px] leading-[20px] line-clamp-2">{event.description}</p>
                <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex items-center justify-between">
                  <span className="text-[#334155] text-[12px] font-semibold">Click for details</span>
                  <svg className="w-4 h-4 text-[#334155] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="relative w-full mt-20 pb-16" data-name="TimelineSection">
        <div className="relative text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[rgba(172,0,0,0.1)] px-6 py-3 rounded-full mb-6">
            <div className="bg-[#AC0000] rounded-full size-[8px]" />
            <div className="font-semibold text-[#AC0000] text-[13px]">Heritage Timeline</div>
          </div>
          <h2 className="font-bold text-[#1e293b] text-[34px] leading-[40px] mb-4">Journey Through Museum History</h2>
          <p className="text-[#64748b] text-[16px] leading-[29px] max-w-[672px] mx-auto">Discover the milestones that shaped Naga City's museum network</p>
        </div>
        <div className="relative max-w-[1100px] mx-auto px-8">
          <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#334155] via-[#475569]/50 to-[#475569]/20 transform -translate-x-1/2 hidden md:block" />
          <div className="space-y-12">
            {timelineMilestones.map((milestone, index) => (
              <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="flex-1 md:text-right md:pr-8" style={index % 2 === 0 ? {} : { textAlign: 'left', paddingRight: 0, paddingLeft: '2rem' }}>
                  <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm hover:shadow-md hover:border-[#334155] transition-all duration-300 p-6 group">
                    <div className="text-[#AC0000] font-bold text-[24px] mb-2">{milestone.year}</div>
                    <h3 className="font-bold text-[#1e293b] text-[18px] leading-[24px] mb-2 group-hover:text-[#334155] transition-colors">{milestone.title}</h3>
                    <p className="text-[#64748b] text-[14px] leading-[22px]">{milestone.description}</p>
                  </div>
                </div>
                <div className="relative flex-shrink-0 hidden md:block">
                  <div className="w-16 h-16 bg-white rounded-full border-4 border-[#334155] flex items-center justify-center text-2xl shadow-lg z-10 relative">{milestone.icon}</div>
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan & Schedule Your Visit CTA */}
      <div className="relative w-full mt-20 pb-8 mb-8">
        <div className="bg-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
          <div className="relative px-6 sm:px-10 md:px-12 py-10 sm:py-14 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 75% 50%, #AC0000 0%, transparent 55%)' }} />
            <div className="relative flex-1 text-center md:text-left">
              <h2 className=" font-bold text-white text-[22px] sm:text-[28px] md:text-[34px] leading-[28px] sm:leading-[34px] md:leading-[40px] mb-3 sm:mb-4">
                Plan &amp; Schedule Your Visit
              </h2>
              <p className=" text-[rgba(255,255,255,0.8)] text-[14px] sm:text-[16.6px] leading-[24px] sm:leading-[29.25px] max-w-[520px]">
                Browse live time slots across all galleries, book your group visit, track your reservation, and manage your schedule — all in one place.
              </p>
            </div>
            <div className="relative flex-shrink-0 w-full md:w-auto">
              <button
                onClick={() => navigate('/visitor-scheduling')}
                className="bg-[#AC0000] hover:bg-[#8b0000] text-white  font-semibold text-[13px] sm:text-[14px] h-11 sm:h-12 px-8 sm:px-10 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto"
              >
                Schedule a Visit
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-64 overflow-hidden rounded-t-2xl">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8">
              <div className="inline-flex items-center gap-2 bg-[#AC0000]/10 px-4 py-2 rounded-full mb-4">
                <svg className="w-4 h-4 text-[#AC0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-[#AC0000] font-semibold text-[13px]">{selectedEvent.date}</span>
              </div>
              <h2 className="font-bold text-[#1e293b] text-[28px] leading-[36px] mb-3">{selectedEvent.title}</h2>
              <div className="flex items-center gap-2 text-[#64748b] text-[15px] mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="font-semibold">{selectedEvent.museum}</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748b] text-[15px] mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{selectedEvent.time}</span>
              </div>
              <div className="border-t border-[#e2e8f0] pt-6 mb-6">
                <h3 className="font-bold text-[#1e293b] text-[16px] mb-3">About This Event</h3>
                <p className="text-[#64748b] text-[15px] leading-[24px]">{selectedEvent.description}</p>
              </div>
              <div className="flex justify-center">
                <button onClick={() => setSelectedEvent(null)} className="bg-[#334155] hover:bg-[#475569] text-white font-semibold py-3 px-8 rounded-lg transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Section1() {
  return (
    <div className="relative bg-white content-stretch flex flex-col h-auto items-center w-full px-4 sm:px-8 lg:px-[120.4px] py-6 sm:py-[60px] lg:py-[80px] overflow-hidden" data-name="Section">
      <Container64 />
    </div>
  );
}