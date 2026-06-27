import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedDrop from "@/components/FeaturedDrop";
import ScaleReveal from "@/components/ScaleReveal";
import Philosophy from "@/components/Philosophy";
import HorizontalScroll from "@/components/HorizontalScroll";
import NewArrivals from "@/components/NewArrivals";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedDrop />
        <ScaleReveal />
        <Philosophy />
        <HorizontalScroll />
        <NewArrivals />
      </main>
      <Footer />
    </>
  );
}
