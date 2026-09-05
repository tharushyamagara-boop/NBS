'use client';

import React, { useState } from 'react';

interface CivicStoryCardsProps {
  locale: 'en' | 'rw';
}

interface Story {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  quote: string;
  quoteAuthor: string;
  fullBody: string[];
}

export default function CivicStoryCards({ locale }: CivicStoryCardsProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const isRw = locale === 'rw';

  const stories: Story[] = [
    {
      id: 'mpazi-flood',
      tag: isRw ? 'Kurwanya Imyuzure' : 'Flood Resilience',
      tagColor: '#0284c7',
      title: isRw
        ? 'Gusana Umukoki wa Mpazi: Kurinda Nyabugogo Imyuzure y\'Inkukuma'
        : 'Bio-Engineering the Mpazi Ravine: Protecting Nyabugogo from Flash Flooding',
      date: isRw ? 'Gashyantare 2025' : 'February 2025',
      author: isRw ? 'Ubunyamabanga bwa SUNCASA Kigali' : 'SUNCASA Kigali Field Mission',
      summary: isRw
        ? 'Uburyo ingomero z\'ibiti, imigano ku nkombe, n\'ibyobo bifata amazi mu misozi yo hejuru birinda amazu n\'amasoko y\'i Nyabugogo kurengerwa n\'amazi.'
        : 'How vegetative check-dams, bamboo riparian buffers, and contour infiltration swales in upper basins delay torrential runoff, protecting informal settlements and markets downstream.',
      quote: isRw
        ? '"Mbere imvura yagwaga tukikanga ko ibicuruzwa byacu byi Nyabugogo bitwarwa n\'amazi. None ubu amazi yagabanutseho hejuru ya 28% kubera ibiti n\'ingomero byakozwe hejuru mu mukoki."'
        : '"Before SUNCASA restored the upper ravine, a two-hour rainstorm meant total market closure in Nyabugogo. The vegetative check-dams have delayed peak storm crests by over 45 minutes, saving thousands of livelihoods."',
      quoteAuthor: isRw ? 'Jean-Damascène H., Umucuruzi i Nyabugogo' : 'Jean-Damascène H., Nyabugogo Traders Association',
      fullBody: isRw
        ? [
            'Umukoki wa Mpazi unyura mu mirenge ituwe cyane mu Karere ka Nyarugenge. Mu myaka yashize, imvura y\'inkukuma yamanukaga ifite umuvuduko ukabije, ikangiza ibiraro, amazu, n\'isoko rikuru rya Nyabugogo.',
            'Binyuze mu mushinga SUNCASA ku bufatanye n\'Umujyi wa Kigali na RFA, hakozwe imirimo y\'ubuhanga bwa kamere: haterwa imigano irenga ibihumbi 45 ku nkombe, hacibwa amaterasi ku misozi ihanamiye, hanashyirwaho ingomero zikoze mu biti (live check-dams) zigabanya umuvuduko w\'amazi.',
            'Ubu ibipimo bya tekiniki byerekana ko amazi y\'imyuzure yagabanutseho 28.5%, bikarinda ibikorwa remezo bya leta bifite agaciro ka miliyari z\'amafaranga y\'u Rwanda.'
          ]
        : [
            'The Mpazi drainage corridor cuts through steep informal settlements in Nyarugenge district before discharging directly into the Nyabugogo commercial basin. Historical downpours generated devastating torrents carrying thousands of tons of sediment, regularly drowning businesses and severing vital transit routes.',
            'Under the SUNCASA initiative led by IISD and WRI with the City of Kigali and RFA, bio-engineering solutions replaced concrete channelization. Over 45,000 native bamboo culms were established alongside live willow-type check-dams and progressive hillside terraces across upper sectors.',
            'Real-time hydrometric gauges have registered a 28.5% drop in peak stormwater velocity during extreme precipitation events, significantly lowering insurance loss risks and municipal culvert clearance expenditures.'
          ],
    },
    {
      id: 'women-nurseries',
      tag: isRw ? 'Uburinganire n\'Iterambere' : 'Gender & Inclusion',
      tagColor: '#8b5cf6',
      title: isRw
        ? 'Abagore ku Rhembo: Amakoperative y\'Abagore Ayoboye Ubuhumbikiro bw\'Ibiti'
        : 'Women at the Helm: Female-Led Nursery Cooperatives Powering Reforestation',
      date: isRw ? 'Mutarama 2025' : 'January 2025',
      author: isRw ? 'Ishami rishinzwe Uburinganire (GESI)' : 'SUNCASA GESI Working Group',
      summary: isRw
        ? 'Hafi 61.5% by\'ubuhumbikiro bw\'ingemwe i Kigali buyobowe n\'amakoperative y\'abagore, bigatuma amafaranga yinjira mu mibereho myiza y\'ingo zabo.'
        : 'Over 61% of community seedling nurseries in Kigali are now operated by women cooperatives, transforming climate finance into sustainable household income and nutrition.',
      quote: isRw
        ? '"Kugurisha ingemwe byatumye tubasha kwishyura mituweli ku gihe no kurihira abana amashuri yisumbuye. Amashyamba ntabwo akiri umushinga w\'abagabo gusa."'
        : '"Through the cooperative nursery grant, our women\'s group supplied 180,000 native Markhamia lutea seedlings. For the first time, our members hold their own bank savings accounts and health insurance policies."',
      quoteAuthor: isRw ? 'Chantal Mukamana, Umuyobozi wa Koperative Abahuje i Yanze' : 'Chantal Mukamana, President of Abahuje Nursery Cooperative, Yanze',
      fullBody: isRw
        ? [
            'Ubusanzwe imirimo yo gutera amashyamba n\'ubucuruzi bwayo yakunze kwiharirwa n\'abagabo. SUNCASA yashyizeho politiki ihamye y\'uko nibura 50% by\'abafata ibyemezo n\'abagenerwabikorwa b\'ubuhumbikiro bagomba kuba abagore.',
            'Kugeza ubu, amakoperative 14 y\'abagore yarahawe imbuto z\'indobanure, imashini zihumbika zikoresha imirasire y\'izuba, n\'amasezerano yo kugura ingemwe zose batubuye ku giciro cyiza.',
            'Ibi byatumye amakoperative yinjiza amafaranga arenga miliyoni 48 RWF, bikomeza kuzamura ubukungu bw\'ingo z\'abaturage mu nkengero za Kigali.'
          ]
        : [
            'Traditionally, commercial forestry and nursery operations were heavily male-dominated. SUNCASA enacted mandatory gender quotas and tailored capacity building to break financial barriers for peri-urban women in Kigali.',
            'Fourteen women-led cooperatives received solar-powered irrigation sets, high-germination seed banks of native species (Markhamia lutea, Polyscias fulva), and guaranteed forward-purchase agreements directly from RFA and municipal contractors.',
            'Cooperative revenue records show over 48.6 million RWF paid directly to female-led enterprises, with audited household surveys demonstrating a 73% reinvestment rate into family health, child education, and household food security.'
          ],
    },
    {
      id: 'youth-gis',
      tag: isRw ? 'Imirimo n\'Ikoranabuhanga' : 'Green Jobs & Tech',
      tagColor: '#10b981',
      title: isRw
        ? 'Urubyiruko n\'Ikoranabuhanga rya GIS: Gukurikirana Amashyamba hakoreshejwe Drone'
        : 'Youth GIS Environmental Stewards: Digital Telemetry for Forest Tracking',
      date: isRw ? 'Ukuboza 2024' : 'December 2024',
      author: isRw ? 'Ikipe ya GIS n\'Ikoranabuhanga' : 'Spatial Informatics Unit, WRI & RFA',
      summary: isRw
        ? 'Guha urubyiruko rwa Kigali ubushobozi n\'ibikoresho byo gupima amashyamba no kureba niba ibiti byatewe bikura neza muri sisitemu ya RFA.'
        : 'Empowering young Rwandan technicians with mobile geospatial tools and drone mapping to verify seedling survival rates and compartment boundaries in real time.',
      quote: isRw
        ? '"Koresha drone na porogaramu za telefoni mu kureba imikurire y\'ibiti byaduhaye akazi keza k\'umwuga. Ubu dufatanya n\'inzego za RFA mu kubika amakuru nyayo."'
        : '"Mapping hill compartments with RTK drones and mobile forms opened professional career doors for us. We ensure every dollar invested in Kigali\'s trees is accounted for with GPS coordinates."',
      quoteAuthor: isRw ? 'Aimé Nshuti, Umugenzuzi w\'Amashyamba wa GIS' : 'Aimé Nshuti, Lead Youth Drone Pilot, Mount Kigali Sector',
      fullBody: isRw
        ? [
            'Kugira ngo amashyamba yatewe arambe, bisaba gukurikirana imikurire yayo no kumenya niba atangirika. SUNCASA yahuguye urubyiruko 380 mu gukoresha ikoranabuhanga rya GIS, za drone, na porogaramu za ODK.',
            'Uru rubyiruko rukora amakarita agaragaza ibiti byatewe, rugapima uburebure bwabyo, rukandika amakuru muri sisitemu ya FMES ya RFA, bityo leta ikamenya neza aho amashyamba ageze.',
            'Uru rubyiruko ruhemberwa akazi ko mu murima, bikanabafasha kubona impamyabumenyi zibinjiza mu mirimo yo kurengera ibidukikije mu buryo bw\'umwuga.'
          ]
        : [
            'Sustainable nature-based solutions require verifiable telemetry rather than optimistic estimates. SUNCASA partnered with the Rwanda Forestry Authority to train and certify 380 youth in open-source GIS, drone flight operations, and mobile ground-truthing tools.',
            'Operating in teams across Yanze and Mount Kigali, youth stewards survey 20m x 20m permanent sample plots every quarter, recording individual seedling health, height increments, and canopy density on digital tablets.',
            'Their verified datasets sync directly into RFA’s national FMES database, ensuring unprecedented transparency and donor accountability for Canada\'s climate adaptation investment.'
          ],
    },
  ];

  return (
    <section className="civic-stories-section" id="stories-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">{isRw ? 'Inkuru z\'Umusaruro' : 'Civic Narratives & Reports'}</div>
          <h2 className="section-title">
            {isRw ? 'Inkuru z\'Ibibaya n\'Ibyavuye mu Mirimo ya SUNCASA' : 'Latest Watershed Stories & Peg-Style Impact Reports'}
          </h2>
          <p className="section-subtitle">
            {isRw
              ? 'Inkuru zifatika zihuza imirimo yo gusana imisozi n\'imibereho y\'abaturage bo mu Mujyi wa Kigali.'
              : 'Indicator-driven narratives demonstrating how ecological bio-engineering, female leadership, and youth technology deliver tangible community well-being in Kigali.'}
          </p>
        </div>

        <div className="civic-stories-grid">
          {stories.map((story) => (
            <article key={story.id} className="story-card">
              <div className="story-card-top">
                <span
                  className="story-pill"
                  style={{ backgroundColor: `${story.tagColor}22`, color: story.tagColor, borderColor: `${story.tagColor}55` }}
                >
                  {story.tag}
                </span>
                <span className="story-date">{story.date}</span>
              </div>

              <h3 className="story-title">{story.title}</h3>
              <p className="story-summary">{story.summary}</p>

              <div className="story-quote-box">
                <p className="quote-text">{story.quote}</p>
                <span className="quote-author">&mdash; {story.quoteAuthor}</span>
              </div>

              <div className="story-footer">
                <span className="story-author-tag">🏛️ {story.author}</span>
                <button
                  type="button"
                  className="btn-read-story"
                  onClick={() => setSelectedStory(story)}
                >
                  {isRw ? 'Soma Inkuru Yose' : 'Read Full Narrative'} &rarr;
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Story Modal */}
      {selectedStory && (
        <div className="modal-overlay open" onClick={() => setSelectedStory(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <div className="modal-header">
              <div className="modal-header-text">
                <span
                  className="story-pill"
                  style={{
                    backgroundColor: `${selectedStory.tagColor}22`,
                    color: selectedStory.tagColor,
                    borderColor: `${selectedStory.tagColor}55`,
                    marginBottom: '8px',
                    display: 'inline-block',
                  }}
                >
                  {selectedStory.tag} &bull; {selectedStory.date}
                </span>
                <h3>{selectedStory.title}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedStory(null)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="story-modal-quote">
                <p>{selectedStory.quote}</p>
                <div className="story-modal-quote-author">&mdash; {selectedStory.quoteAuthor}</div>
              </div>

              <div className="story-modal-paragraphs">
                {selectedStory.fullBody.map((p, idx) => (
                  <p key={idx} style={{ marginBottom: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                    {p}
                  </p>
                ))}
              </div>

              <div className="story-modal-partner-box">
                <strong>{isRw ? 'Ubufatanye bw\'Abafatanyabikorwa:' : 'Project Delivery Partners:'}</strong>
                <p>Global Affairs Canada &bull; IISD &bull; WRI &bull; City of Kigali &bull; Rwanda Forestry Authority</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
