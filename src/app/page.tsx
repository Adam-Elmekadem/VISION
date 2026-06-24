import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedDrop from "@/components/FeaturedDrop";
import Philosophy from "@/components/Philosophy";
import NewArrivals from "@/components/NewArrivals";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedDrop />
        <Philosophy />
        <NewArrivals />
      </main>
      <Footer />
    </>
  );
}
