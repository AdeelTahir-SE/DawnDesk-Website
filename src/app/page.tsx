import { HeroSection } from "@/components/sections/hero-section";
import { Ticker } from "@/components/sections/ticker";
import { ProjectManagerShowcase } from "@/components/sections/showcase-project-manager";
import { PhotoEditorShowcase } from "@/components/sections/showcase-photo-editor";
import { VideoEditorShowcase } from "@/components/sections/showcase-video-editor";
import { TodoShowcase } from "@/components/sections/showcase-todo";
import { DevToolsShowcase } from "@/components/sections/showcase-dev-tools";
import { GridBackground } from "@/components/ui/grid-background";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CTASection } from "@/components/sections/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Ticker />
      
      {/* App Showcase Section */}
      <section className="py-24 md:py-32 overflow-hidden relative">
        <GridBackground className="py-12">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1280px]">
            
            <div className="flex flex-col items-center mb-16 md:mb-24 text-center max-w-[800px] mx-auto relative z-20">
              <h2 className="font-display font-semibold text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] text-brand-white tracking-[-0.02em] mb-6">
                A workspace that works <span className="text-brand-yellow">for you.</span>
              </h2>
              <p className="text-[1.125rem] leading-[1.7] text-brand-muted">
                Stop switching contexts. DawnDesk integrates all your essential tools into one uncompromisingly fast interface.
              </p>
            </div>

            <div className="flex flex-col relative z-20">
              <ProjectManagerShowcase />
              <PhotoEditorShowcase />
              <VideoEditorShowcase />
              <TodoShowcase />
              <DevToolsShowcase />
            </div>
            
          </div>
        </GridBackground>
      </section>

      <TestimonialsSection />
      <CTASection />
    </>
  );
}
