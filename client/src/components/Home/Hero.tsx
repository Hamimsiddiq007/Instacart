import { heroSectionData } from "../../assets/assets"


const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-135 mb-10 rounded-3xl flex items-center ">
      <img src={heroSectionData.hero_image} alt="Hero" className="absolute inset-0 object-cover w-full h-full" />
      <div className="absolute inset-0 bg-linear-to-r from-app-green via-app-green/65 to-transparent" />
    </section>
  )
}

export default Hero
