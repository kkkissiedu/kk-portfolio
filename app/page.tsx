export const revalidate = 60;

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Publications from "./components/Publications";
import Toolkit from "./components/Toolkit";
import Channel from "./components/Channel";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import {
  getSiteSettings,
  getFeaturedProjects,
  getPublications,
  getTestimonials,
} from "@/lib/sanity";

export default async function Home() {
  const [settings, featuredProjects, publications, testimonials] =
    await Promise.all([
      getSiteSettings(),
      getFeaturedProjects(),
      getPublications(),
      getTestimonials(),
    ]);

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* 1. Hero */}
        <Hero
          heroOverline={settings?.heroOverline}
          heroTagline={settings?.heroTagline}
          heroAccentWord={settings?.heroAccentWord}
          heroSubtitle={settings?.heroSubtitle}
          heroCtaPrimary={settings?.heroCtaPrimary}
          heroCtaSecondary={settings?.heroCtaSecondary}
        />

        {/* 2. About */}
        <About
          aboutLabel={settings?.aboutLabel}
          aboutHeading={settings?.aboutHeading}
          aboutHeadingAccentWords={settings?.aboutHeadingAccentWords}
          aboutBodyPara1={settings?.aboutBodyPara1}
          aboutBodyPara2={settings?.aboutBodyPara2}
          aboutPhotoUrl={settings?.aboutPhoto?.asset?.url}
          anthraciteUrl={settings?.anthraciteUrl}
          academicCvUrl={settings?.academicCv?.asset?.url}
          professionalCvUrl={settings?.professionalCv?.asset?.url}
          statOneValue={settings?.statOneValue}
          statOneLabel={settings?.statOneLabel}
          statTwoValue={settings?.statTwoValue}
          statTwoLabel={settings?.statTwoLabel}
          statThreeValue={settings?.statThreeValue}
          statThreeLabel={settings?.statThreeLabel}
        />

        {/* 3. What I Do */}
        <Services
          whatIDoLabel={settings?.whatIDoLabel}
          whatIDoHeading={settings?.whatIDoHeading}
          whatIDoAccentWord={settings?.whatIDoAccentWord}
          card1Title={settings?.card1Title}
          card1Subtitle={settings?.card1Subtitle}
          card1Description={settings?.card1Description}
          card2Title={settings?.card2Title}
          card2Subtitle={settings?.card2Subtitle}
          card2Description={settings?.card2Description}
          card3Title={settings?.card3Title}
          card3Subtitle={settings?.card3Subtitle}
          card3Description={settings?.card3Description}
          anthraciteStructuralUrl={settings?.anthraciteStructuralUrl}
          anthracite3dUrl={settings?.anthracite3dUrl}
        />

        {/* 4. Featured Projects */}
        <Projects projects={featuredProjects} />

        {/* 5. Publications */}
        <Publications publications={publications} sectionNumber="05" />

        {/* 6. My Toolkit */}
        <Toolkit
          toolkitLabel={settings?.toolkitLabel}
          toolkitHeading={settings?.toolkitHeading}
          toolkitAccentWord={settings?.toolkitAccentWord}
          toolkitIntro={settings?.toolkitIntro}
          column1Title={settings?.toolkitColumn1Title}
          column1Items={settings?.toolkitColumn1Items ?? []}
          column2Title={settings?.toolkitColumn2Title}
          column2Items={settings?.toolkitColumn2Items ?? []}
          column3Title={settings?.toolkitColumn3Title}
          column3Items={settings?.toolkitColumn3Items ?? []}
        />

        {/* 7. From the Channel */}
        <Channel
          channelLabel={settings?.channelLabel}
          channelHeading={settings?.channelHeading}
          channelAccentWord={settings?.channelAccentWord}
          channelIntro={settings?.channelIntro}
          videoUrl={settings?.channelVideoUrl}
          channelUrl={settings?.channelChannelUrl}
          ctaLabel={settings?.channelCtaLabel}
        />

        {/* 8. Testimonials */}
        <Testimonials testimonials={testimonials ?? []} />

        {/* 9. Contact */}
        <Contact
          contactLabel={settings?.contactLabel}
          contactHeading={settings?.contactHeading}
          contactHeadingGoldWord={settings?.contactAccentWord}
          contactSubtext={settings?.contactSubtext}
          contactEmail={settings?.contactEmail}
          contactLocation={settings?.contactLocation}
        />
      </main>

      <Footer
        footerCopyright={settings?.footerCopyright}
        footerTagline={settings?.footerTagline}
      />
    </>
  );
}
