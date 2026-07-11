"use client";

import dynamic from "next/dynamic";

const SafeHeroText = dynamic(() => import("./HeroText"), {
  ssr: false,
});

export default SafeHeroText;
