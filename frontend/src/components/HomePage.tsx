// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export const HomePage = () => {
//   const { accessToken } = useAuth();

//   return (
//     <div style={{ padding: "40px", textAlign: "center" }}>
//       <h1>Welcome to Lead Tracker App</h1>
//       <p style={{ fontSize: "1.2rem", color: "#666" }}>
//         Manage, track, and convert your sales leads effectively.
//       </p>

//       <br />
//       <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
//         {accessToken ? (
//           <Link to="/dashboard">
//             <button type="button">Go to Dashboard</button>
//           </Link>
//         ) : (
//           <>
//             <Link to="/login">
//               <button type="button">Login</button>
//             </Link>
//             <Link to="/register">
//               <button type="button">Register</button>
//             </Link>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

"use client"

import { AuroraText } from "./ui/aurora-text";
import { TypingAnimation } from "./ui/typing-animation";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";

import { useTheme } from "next-themes"
import { LineShadowText } from "./ui/line-shadow-text";
import { HyperText } from "./ui/hyper-text";
import { HomePipeline } from "./personal-ui/HomePipeline";
import { VideoCard } from "./personal-ui/VideoCard";
import { CardFeatures } from "./personal-ui/CardFeatures";
import { HowItWorksCard } from "./personal-ui/HowItWorksCard";


import { Link } from "react-router-dom";

export const HomePage = () => {
    const theme = useTheme();
    const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";

    return (
        <article className="flex flex-col gap-24 py-6 max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="flex flex-col items-center text-center pt-8 pb-4 space-y-8">
                {/* Monochrome Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground shadow-sm">
                    <span className="inline-block h-2 w-2 rounded-full bg-foreground animate-pulse" />
                    <span>Simple Lead Management for Growing Teams</span>
                </div>

                {/* Primary SEO H1 Heading */}
                <div className="space-y-4 max-w-4xl">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-foreground text-balance leading-tight">
                        Turn Every Lead into an <AuroraText>Opportunity...</AuroraText>
                    </h1>

                    <div className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
                        <TypingAnimation className="leading-relaxed">
                            Capture, organize, and track your leads from one simple dashboard - so your team always knows who to follow up with and what to do next.
                        </TypingAnimation>
                    </div>
                </div>

                {/* Call to Action Controls */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <Link to="/register">
                        <InteractiveHoverButton>Get Started Free</InteractiveHoverButton>
                    </Link>
                    <VideoCard />
                </div>

                {/* No Complicated Setup Banner */}
                <div className="pt-12 space-y-3">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground">
                        No complicated{" "}
                        <LineShadowText className="italic" shadowColor={shadowColor}>
                            setup
                        </LineShadowText>
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        <HyperText as="span">Track leads effortlessly. Built for modern teams</HyperText>
                    </p>
                </div>
            </section>

            {/* Dashboard & Pipeline Preview Section */}
            <section className="flex flex-col items-center text-center space-y-8 py-8 border-y border-border/60">
                <div className="max-w-3xl space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-4xl text-foreground">
                        Everything Your Leads Need. In One Place.
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        Stay on top of your sales pipeline with a clear view of your leads, follow-ups, and progress.
                    </p>
                </div>

                {/* Pipeline Architecture Visual */}
                <div className="w-full flex justify-center py-4">
                    <HomePipeline />
                </div>

                {/* Pipeline Stages Explanation */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl w-full pt-4 text-xs sm:text-sm">
                    <div className="p-3 rounded-lg border border-border bg-card">
                        <span className="font-bold block text-foreground">1. New</span>
                        <span className="text-muted-foreground text-xs">Capture incoming leads</span>
                    </div>
                    <div className="p-3 rounded-lg border border-border bg-card">
                        <span className="font-bold block text-foreground">2. Contacted</span>
                        <span className="text-muted-foreground text-xs">Initiate outreach</span>
                    </div>
                    <div className="p-3 rounded-lg border border-border bg-card">
                        <span className="font-bold block text-foreground">3. Qualified</span>
                        <span className="text-muted-foreground text-xs">Verify intent & budget</span>
                    </div>
                    <div className="p-3 rounded-lg border border-border bg-card">
                        <span className="font-bold block text-foreground">4. Proposal</span>
                        <span className="text-muted-foreground text-xs">Send custom quotes</span>
                    </div>
                    <div className="p-3 rounded-lg border border-border bg-card col-span-2 sm:col-span-1">
                        <span className="font-bold block text-foreground">5. Won</span>
                        <span className="text-muted-foreground text-xs">Close & convert deal</span>
                    </div>
                </div>
            </section>

            {/* Features Grid Section */}
            <section className="flex flex-col items-center text-center space-y-10">
                <div className="max-w-2xl space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-4xl text-foreground">
                        Built to Keep Your Pipeline Moving
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Powerful features packaged in a clean, minimalist experience.
                    </p>
                </div>

                <div className="w-full">
                    <CardFeatures />
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-4">
                <HowItWorksCard />
            </section>

            {/* Final CTA Section */}
            <section className="text-center space-y-6 py-12 px-6 rounded-2xl border border-border bg-card shadow-sm">
                <h2 className="text-2xl font-bold tracking-tight sm:text-4xl text-foreground">
                    Ready to take control of your leads?
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                    Stop losing opportunities in spreadsheets and scattered notes. Start managing your pipeline in one simple place.
                </p>
                <div className="pt-2">
                    <Link to="/register">
                        <InteractiveHoverButton>Get Started Free</InteractiveHoverButton>
                    </Link>
                </div>
            </section>
        </article>
    );
};


      
      



