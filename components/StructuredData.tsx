export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kwabena Kwayisi Kissiedu',
    url: 'https://kkkissiedu.com',
    image: 'https://kkkissiedu.com/og-image.png',
    jobTitle: 'Structural Engineer & ML Researcher',
    description:
      'First Class Civil Engineer applying Physics-Informed AI, structural analysis, and 3D design to infrastructure challenges in Ghana.',
    email: 'kissiedukwabena4@gmail.com',
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Kwame Nkrumah University of Science and Technology (KNUST)',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kumasi',
      addressRegion: 'Ashanti',
      addressCountry: 'GH',
    },
    sameAs: [
      'https://github.com/kkkissiedu',
      'http://www.youtube.com/@kkkissiedu',
    ],
    knowsAbout: [
      'Structural Engineering',
      'Machine Learning',
      'Physics-Informed Neural Networks',
      'Computer Vision',
      '3D Design',
      'Blender',
      'Unreal Engine',
      'Python',
      'PyTorch',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kwabena Kissiedu — Portfolio',
    url: 'https://kkkissiedu.com',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
