import Header from "@/components/header";
import Hero from "@/components/hero";
import Services from "@/components/services";
import Whychoose from "@/components/whychoose";
import Footer from "@/components/footer";
import TestimonialSection from "@/components/testimonial";
import About from "@/components/about";
import Lower from "@/components/lower-footer";
export default function Main() {
  return (
    <main>
      <Header />
       <Hero />
      <About />
      <Whychoose />
      <Services />
      <TestimonialSection />
      <Lower />
      <Footer />
    </main>
  );
}