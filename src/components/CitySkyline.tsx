import React from 'react';

interface CitySkylineProps {
  city: 'New York' | 'Los Angeles' | 'Miami' | 'London' | 'Paris';
  color?: string;
}

export const CitySkyline: React.FC<CitySkylineProps> = ({ 
  city, 
  color = 'stroke-primary/15' 
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[240px] pointer-events-none z-0 overflow-hidden select-none select-none transition-all duration-700 ease-in-out opacity-25 md:opacity-35">
      <svg
        className={`w-full h-full ${color}`}
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          {city === 'New York' && (
            <>
              {/* Backing Distant Hills/Water Lines */}
              <path d="M0,230 L1440,230" strokeWidth="0.5" className="stroke-primary/5" />
              <path d="M0,225 C300,224 600,226 900,224 C1200,226 1400,225 1440,225" strokeWidth="0.5" className="stroke-primary/5" />
              
              {/* New York Skyline Outline Draft */}
              {/* Left Side: Jersey City Heights */}
              <path d="M0,225 L30,225 L30,210 L50,210 L50,225 L80,225 L80,195 L110,195 L110,225 L140,225" />
              
              {/* Hudson River Empty Space with subtle water ripples */}
              <path d="M150,228 L170,228" strokeWidth="0.5" />
              <path d="M210,227 L240,227" strokeWidth="0.5" />

              {/* Lower Manhattan Block / One World Trade Center */}
              <path d="M280,225 L290,225 L290,160 L310,140 L330,160 L330,225" />
              {/* One World Trade Spire */}
              <path d="M310,140 L310,80" strokeWidth="0.8" className="stroke-primary/25" />
              {/* Surrounding Wall Street Buildings */}
              <path d="M330,225 L350,225 L350,150 L375,150 L375,225 L390,225 L390,135 L415,135 L415,225" />
              <path d="M415,225 L430,225 L430,170 L455,170 L455,225" />
              
              {/* Midtown Manhattan - Empire State Building */}
              <path d="M520,225 L550,225 L550,140 L570,140 L570,110 L585,110 L585,60 L590,60 L590,40 L595,40 Q597.5,15 600,5 Q602.5,15 605,40 L610,40 L610,60 L615,60 L615,110 L630,110 L630,140 L650,140 L655,225" strokeWidth="1.2" />
              {/* Empire State Spire antenna detailing */}
              <line x1="600" y1="5" x2="600" y2="40" strokeWidth="1.5" />
              <line x1="597" y1="18" x2="603" y2="18" strokeWidth="0.5" />
              <line x1="598" y1="28" x2="602" y2="28" strokeWidth="0.5" />

              {/* Chrysler Building */}
              <path d="M680,225 L700,225 L700,150 L715,150 L715,120 L730,90 Q735,70 735,50 Q735,70 740,90 L755,120 L755,150 L770,150 L770,225" />
              {/* Chrysler spire and sunburst arches lines sketch */}
              <line x1="735" y1="50" x2="735" y2="110" strokeWidth="0.5" />
              <path d="M725,105 C730,98 740,98 745,105" strokeWidth="0.7" />
              <path d="M728,95 C731,90 739,90 742,95" strokeWidth="0.7" />

              {/* Citigroup, Rockefeller, and Billionaires' Row Thin Silhouettes */}
              <path d="M800,225 L820,225 L820,110 L845,95 L845,225" />
              <path d="M860,225 L875,225 L875,30 L895,30 L895,225" strokeWidth="0.8" /> {/* Ultra supertall */}
              <path d="M915,225 L930,225 L930,75 L950,75 L950,225" />
              <path d="M965,225 L985,225 L985,130 L1010,130 L1010,225" />
              
              {/* Queensboro Bridge Bridge Link to East side */}
              <path d="M1040,225 L1050,205 L1065,205 L1070,225 C1090,215 1110,215 1130,225 L1135,205 L1150,205 L1160,225" strokeWidth="0.7" />
              <path d="M1050,205 L1150,205" strokeWidth="0.5" />
              <path d="M1030,215 L1170,215" strokeWidth="0.5" className="stroke-primary/10" />

              {/* Brooklyn Waterfront Heights */}
              <path d="M1200,225 L1220,225 L1220,180 L1250,180 L1250,225 L1270,225 M1270,225 L1290,225 L1290,165 L1320,165 L1320,225" />
              <path d="M1340,225 L1370,225 L1370,190 L1400,195 L1410,225" />
              
              {/* Subtle architectural vertical lines for glass windows */}
              <line x1="585" y1="140" x2="585" y2="210" strokeWidth="0.5" className="stroke-primary/5" />
              <line x1="615" y1="140" x2="615" y2="210" strokeWidth="0.5" className="stroke-primary/5" />
              <line x1="310" y1="160" x2="310" y2="220" strokeWidth="0.5" className="stroke-primary/5" />
              <line x1="885" y1="60" x2="885" y2="200" strokeWidth="0.5" className="stroke-primary/5" />
            </>
          )}

          {city === 'Los Angeles' && (
            <>
              {/* Rolling Hollywood Hills Outline backdrop */}
              <path d="M0,210 Q200,170 450,195 T900,160 T1440,200" strokeWidth="0.6" className="stroke-primary/10" />
              <path d="M500,225 L1440,225" strokeWidth="0.5" className="stroke-primary/5" />
              
              {/* Classic LA palm tree accents (Sleek minimalist strokes) */}
              {/* Palm Tree Left */}
              <path d="M80,225 Q95,150 90,95" strokeWidth="1.2" className="stroke-primary/30" />
              <path d="M90,95 Q70,90 55,100 M90,95 Q110,88 125,98 M90,95 Q80,75 75,60 M90,95 Q100,75 110,62 M90,95 Q115,100 125,115 M90,95 Q65,105 50,120" strokeWidth="0.8" />
              
              {/* Palm Tree Left-Center */}
              <path d="M120,225 Q130,165 125,120" strokeWidth="1" className="stroke-primary/20" />
              <path d="M125,120 Q110,118 100,125 M125,120 Q140,115 150,122 M125,120 Q120,105 115,95 M125,120 Q130,105 138,96" strokeWidth="0.8" />

              {/* Downtown Los Angeles Skylines */}
              {/* US Bank Tower (Oversized Cylinder Tower with crown crown) */}
              <path d="M500,225 L525,225 L525,130 L540,115 L540,65 L548,65 L548,50 L572,50 L572,65 L580,65 L580,115 L595,130 L595,225" strokeWidth="1.2" />
              {/* US Bank Tower details, crown lights ring and curves */}
              <path d="M548,55 C552,51 568,51 572,55" strokeWidth="1" />
              <path d="M540,80 C550,75 570,75 580,80" strokeWidth="0.6" />
              <path d="M540,100 C550,95 570,95 580,100" strokeWidth="0.6" />
              
              {/* Wilshire Grand Center with iconic sail tip and spire */}
              <path d="M630,225 L650,225 L650,110 L680,60 L683,60 Q685,25 685,3 L685,60 L695,70 L695,225" />
              
              {/* Aon Center blocky structural monolith */}
              <path d="M430,225 L470,225 L470,90 L430,90 Z" />
              <line x1="440" y1="90" x2="440" y2="225" strokeWidth="0.5" className="stroke-primary/10" />
              <line x1="450" y1="90" x2="450" y2="225" strokeWidth="0.5" className="stroke-primary/10" />
              <line x1="460" y1="90" x2="460" y2="225" strokeWidth="0.5" className="stroke-primary/10" />

              {/* Ritz-Carlton Downtown & modern dynamic buildings */}
              <path d="M720,225 L755,225 L755,100 L720,130 Z" />
              <path d="M770,225 L805,225 L805,120 L770,120 Z" />
              <path d="M820,225 L860,225 L860,140 L840,150 L820,140 Z" />

              {/* LA City Hall (Iconic stepped pyramid top) */}
              <path d="M910,225 L930,225 L930,170 L940,170 L940,140 L948,140 L948,110 L952,110 L952,100 L956,100 L960,85 L964,100 L968,100 L968,110 L972,110 L972,140 L980,140 L980,170 L990,170 L990,225" />
              
              {/* Century City Westside distant towers */}
              <path d="M1100,225 L1120,225 L1120,165 L1140,165 L1140,225" />
              <path d="M1150,225 L1175,225 L1175,150 L1150,150 Z" />
              
              {/* Palm Tree Group Right */}
              <path d="M1300,225 Q1290,160 1295,110" strokeWidth="1" className="stroke-primary/20" />
              <path d="M1295,110 Q1280,105 1270,115 M1295,110 Q1310,105 1320,112 M1295,110 Q1290,95 1285,85" strokeWidth="0.8" />
              
              <path d="M1340,225 Q1355,145 1350,85" strokeWidth="1.3" className="stroke-primary/30" />
              <path d="M1350,85 Q1330,80 1315,90 M1350,85 Q1370,78 1385,88 M1350,85 Q1340,65 1335,50 M1350,85 Q1360,65 1370,52 M1350,85 Q1375,90 1385,105 M1350,85 Q1325,95 1310,110" strokeWidth="0.8" />
            </>
          )}

          {city === 'Miami' && (
            <>
              {/* Wave ripples underlay for ocean front shore */}
              <path d="M0,230 C300,226 600,233 900,227 C1200,231 1380,225 1440,230" strokeWidth="0.8" className="stroke-primary/10" />
              <path d="M0,235 C200,232 500,238 800,233 C1100,237 1300,231 1440,236" strokeWidth="0.5" className="stroke-primary/5" />
              
              {/* Cruise Ship Draft in the far background bay */}
              <path d="M80,225 L180,225 L190,215 L160,215 L160,205 L130,205 L130,215 L70,215 Z" strokeWidth="0.6" className="stroke-primary/10" />
              
              {/* Miami Beach Palm Tree cluster foreground */}
              <path d="M250,225 Q240,140 248,70" strokeWidth="1.4" className="stroke-primary/25" />
              <path d="M248,70 Q225,65 210,75 M248,70 Q270,62 285,72 M248,70 Q240,50 232,35 M248,70 Q252,50 262,37 M248,70 Q272,75 282,90 M248,70 Q222,80 205,95" strokeWidth="0.8" />
              
              <path d="M290,225 Q295,150 292,100" strokeWidth="1" className="stroke-primary/20" />
              <path d="M292,100 Q275,95 265,105 M292,100 Q310,95 320,102 M292,100 Q285,85 280,75 M292,100 Q298,85 305,76" strokeWidth="0.8" />

              {/* Miami Brickell Skyline (Curvy, modern luxury condo skyscrapers) */}
              <path d="M430,225 C450,220 450,180 440,140 C440,110 450,90 465,90 C480,90 490,110 490,140 C480,180 480,220 500,225" strokeWidth="1" />
              {/* Window columns for luxurious condos */}
              <line x1="465" y1="95" x2="465" y2="225" strokeWidth="0.5" className="stroke-primary/10" />

              {/* Panorama Tower (Blocky, giant building with high geometric grid and diagonal slash) */}
              <path d="M540,225 L580,225 L580,50 L555,50 L540,65 Z" strokeWidth="1.2" />
              <line x1="550" y1="65" x2="580" y2="65" strokeWidth="0.5" />
              <line x1="540" y1="100" x2="580" y2="100" strokeWidth="0.5" className="stroke-primary/10" />
              <line x1="540" y1="140" x2="580" y2="140" strokeWidth="0.5" className="stroke-primary/10" />
              <line x1="540" y1="180" x2="580" y2="180" strokeWidth="0.5" className="stroke-primary/10" />

              {/* Southeast Financial Center (Stepped cube columns top) */}
              <path d="M620,225 L660,225 L660,110 L645,95 L645,80 L635,80 L635,95 L620,110 Z" />
              <path d="M628,110 L628,225" strokeWidth="0.5" className="stroke-primary/10" />
              <path d="M652,110 L652,225" strokeWidth="0.5" className="stroke-primary/10" />

              {/* Sleek Oval-topped Beach Towers */}
              <path d="M700,225 L730,225 L730,135 Q715,115 700,135 Z" />
              <line x1="715" y1="125" x2="715" y2="225" strokeWidth="0.3" className="stroke-primary/5" />
              
              <path d="M750,225 L785,225 L785,125 Q767,105 750,125 Z" />
              
              <path d="M810,225 L845,225 L845,150 L810,155 Z" />

              {/* Iconic Miami Cruise Ship Terminal Structure (Sharp triangular sails) */}
              <path d="M900,225 L930,190 L960,225 M940,225 L970,185 L1000,225 M980,225 L1010,180 L1040,225" strokeWidth="0.8" />
              
              {/* Marina yacht docks details */}
              <line x1="1060" y1="225" x2="1065" y2="210" strokeWidth="1" />
              <line x1="1075" y1="225" x2="1080" y2="210" strokeWidth="1" />
              <line x1="1090" y1="225" x2="1095" y2="210" strokeWidth="1" />
              <path d="M1050,220 L1150,220" strokeWidth="0.7" />

              {/* Right Side Palm Trees to frame the background */}
              <path d="M1250,225 Q1265,150 1260,95" strokeWidth="1.2" className="stroke-primary/25" />
              <path d="M1260,95 Q1240,90 1225,100 M1260,95 Q1280,88 1295,98 M1260,95 Q1250,75 1245,60" strokeWidth="0.8" />
              
              <path d="M1300,225 Q1290,165 1295,120" strokeWidth="1" className="stroke-primary/20" />
            </>
          )}

          {city === 'London' && (
            <>
              {/* River Thames backdrop lines */}
              <path d="M0,228 L1440,228" strokeWidth="0.5" className="stroke-primary/10" />
              <path d="M0,233 L1440,233" strokeWidth="0.5" className="stroke-primary/5" />

              {/* Big Ben / Elizabeth Tower (Iconic Neo-Gothic clock tower) */}
              <path d="M300,227 L335,227 L335,90 L345,90 L345,75 L335,75 L335,60 L328,60 L328,45 L322,45 L322,60 L315,60 L315,75 M305,75 M315,75 M305,75 M305,90 L315,90 L315,227" strokeWidth="1.2" />
              <path d="M315,60 L320,40 L325,60 Z" fill="none" /> {/* Spire roof */}
              <line x1="320" y1="40" x2="320" y2="15" strokeWidth="0.8" /> {/* Spire needle */}
              <circle cx="320" cy="73" r="5" className="stroke-primary/40 text-primary" strokeWidth="0.6" /> {/* Clock Face */}
              {/* Architectural pillar lines */}
              <line x1="311" y1="90" x2="311" y2="227" strokeWidth="0.5" className="stroke-primary/10" />
              <line x1="329" y1="90" x2="329" y2="227" strokeWidth="0.5" className="stroke-primary/10" />

              {/* Westminster Halls backdrop beside Big Ben */}
              <path d="M335,227 L480,227 L480,160 L465,145 L465,160 L430,160 L415,145 L415,160 L380,160 L365,145 L365,160 L335,160 Z" />

              {/* The London Eye (Giant Ferris Wheel with spokes) */}
              <circle cx="590" cy="120" r="75" strokeWidth="0.8" className="stroke-primary/15" />
              <circle cx="590" cy="120" r="70" strokeWidth="0.4" className="stroke-primary/5" />
              {/* Wheel supports spokes */}
              <line x1="590" y1="120" x2="520" y2="227" strokeWidth="1" className="stroke-primary/20" />
              <line x1="590" y1="120" x2="660" y2="227" strokeWidth="1" className="stroke-primary/20" />
              <circle cx="590" cy="120" r="4" fill="none" strokeWidth="1" />
              {/* Mini passenger pods around the eye */}
              <circle cx="590" cy="45" r="2.5" fill="none" />
              <circle cx="590" cy="195" r="2.5" fill="none" />
              <circle cx="515" cy="120" r="2.5" fill="none" />
              <circle cx="665" cy="120" r="2.5" fill="none" />
              <circle cx="537" cy="72" r="2.5" fill="none" />
              <circle cx="643" cy="72" r="2.5" fill="none" />
              <circle cx="537" cy="168" r="2.5" fill="none" />
              <circle cx="643" cy="168" r="2.5" fill="none" />

              {/* The Gherkin (Famous curved egg-shaped skyscraper) */}
              <path d="M780,227 C770,170 780,100 810,75 C840,100 850,170 840,227" strokeWidth="1.2" />
              {/* Spiral stripes characteristic of Gherkin */}
              <path d="M785,190 C800,160 820,130 825,76" strokeWidth="0.5" className="stroke-primary/10" />
              <path d="M835,190 C820,160 800,130 795,76" strokeWidth="0.5" className="stroke-primary/10" />
              <path d="M790,220 C810,180 830,140 835,76" strokeWidth="0.5" className="stroke-primary/10" />
              <path d="M830,220 C810,180 790,140 785,76" strokeWidth="0.5" className="stroke-primary/10" />

              {/* The Shard (Tallest pointed spire skyscraper) */}
              <path d="M900,227 L950,227 L922,25 L916,25 L913,50 Z" strokeWidth="1.4" />
              {/* Shard fractured glass layers lines */}
              <line x1="922" y1="25" x2="940" y2="227" strokeWidth="0.5" className="stroke-primary/20" />
              <line x1="913" y1="50" x2="910" y2="227" strokeWidth="0.5" className="stroke-primary/25" />
              <line x1="917" y1="120" x2="930" y2="120" strokeWidth="0.5" className="stroke-primary/20" />

              {/* Tower Bridge (Iconic double suspension bridge towers) */}
              <path d="M1100,227 L1100,140 L1115,120 L1135,120 L1150,140 L1150,227" strokeWidth="1" />
              <path d="M1210,227 L1210,140 L1225,120 L1245,120 L1260,140 L1260,227" strokeWidth="1" />
              {/* Cross connection walkway */}
              <line x1="1125" y1="135" x2="1235" y2="135" strokeWidth="0.8" />
              <line x1="1125" y1="140" x2="1235" y2="140" strokeWidth="0.5" />
              {/* Suspension cables curves */}
              <path d="M1030,210 Q1070,180 1100,170" strokeWidth="0.8" className="stroke-primary/10" />
              <path d="M1150,170 Q1180,185 1210,170" strokeWidth="0.8" className="stroke-primary/10" />
              <path d="M1260,170 Q1290,180 1330,210" strokeWidth="0.8" className="stroke-primary/10" />
              {/* Drawbridge baseline */}
              <line x1="1080" y1="205" x2="1280" y2="205" strokeWidth="0.8" />
            </>
          )}

          {city === 'Paris' && (
            <>
              {/* Seine River subtle water horizontal lines */}
              <path d="M0,226 L1440,226" strokeWidth="0.5" className="stroke-primary/10" />
              <path d="M0,231 L1440,231" strokeWidth="0.5" className="stroke-primary/5" />

              {/* Arc de Triomphe (Classic square arch monument) */}
              <path d="M220,225 L220,165 L275,165 L275,225 L260,225 L260,185 C260,175 235,175 235,185 L235,225 Z" strokeWidth="1.2" />
              <line x1="220" y1="172" x2="275" y2="172" strokeWidth="0.8" />
              <line x1="230" y1="165" x2="230" y2="225" strokeWidth="0.4" className="stroke-primary/10" />
              <line x1="265" y1="165" x2="265" y2="225" strokeWidth="0.4" className="stroke-primary/10" />

              {/* Eiffel Tower (World-famous structural lattice tower) */}
              {/* Leg bases arch */}
              <path d="M520,225 Q560,180 600,225" strokeWidth="1.5" />
              {/* Tower outer curved columns structural frame */}
              <path d="M510,225 Q545,180 575,100 T595,10 Q600,0 Q605,0 605,10 T625,100 T690,225" strokeWidth="1.5" />
              
              {/* First platform level plate */}
              <path d="M532,180 L668,180" strokeWidth="1.8" />
              {/* Second platform level plate */}
              <path d="M555,130 L645,130" strokeWidth="1.8" />
              {/* Dome lookout level */}
              <path d="M580,70 L620,70" strokeWidth="1.5" />
              {/* Center vertical beam wireframe */}
              <line x1="600" y1="10" x2="600" y2="225" strokeWidth="0.6" className="stroke-primary/40" />

              {/* Eiffel architectural lattice cross details (Draft lines) */}
              <line x1="535" y1="225" x2="555" y2="180" strokeWidth="0.5" className="stroke-primary/10" />
              <line x1="665" y1="225" x2="645" y2="180" strokeWidth="0.5" className="stroke-primary/10" />
              <line x1="550" y1="180" x2="570" y2="130" strokeWidth="0.5" className="stroke-primary/15" />
              <line x1="650" y1="180" x2="630" y2="130" strokeWidth="0.5" className="stroke-primary/15" />
              <line x1="575" y1="130" x2="590" y2="70" strokeWidth="0.5" className="stroke-primary/15" />
              <line x1="625" y1="130" x2="610" y2="70" strokeWidth="0.5" className="stroke-primary/15" />
              {/* Subtle light beacon rays radiating from Eiffel Tower tip */}
              <line x1="600" y1="0" x2="400" y2="50" strokeWidth="0.5" strokeDasharray="3,3" className="stroke-primary/10" />
              <line x1="600" y1="0" x2="800" y2="50" strokeWidth="0.5" strokeDasharray="3,3" className="stroke-primary/10" />

              {/* Notre-Dame Cathedral Cathedral (Double towers, Gothic rose window) */}
              <path d="M840,225 L840,140 L865,140 L865,225 M865,210 L915,210 M915,140 L915,225 L940,225 L940,140 L915,140" strokeWidth="1.2" />
              <path d="M865,140 L865,170 L915,170 L915,140 Z" />
              {/* Rose window circle in the center facade block */}
              <circle cx="890" cy="190" r="8" strokeWidth="0.8" className="stroke-primary/30" />
              {/* Spire behind cathedral */}
              <path d="M890,170 L890,110" strokeWidth="0.8" />

              {/* Sacre-Coeur Basilica atop Montmartre Hill (Stepped rounded domes) */}
              <path d="M1060,225 Q1110,195 1160,210" strokeWidth="0.7" className="stroke-primary/10" /> {/* Montmartre Hill */}
              <path d="M1080,212 L1140,212 L1140,185 Q1130,180 1130,165 Q1130,180 1110,185 L1110,160 Q1110,145 1110,135 Q1100,145 1095,160 L1095,185 Z" strokeWidth="1" />
              {/* Domes curves */}
              <path d="M1090,165 Q1100,150 1110,165" strokeWidth="0.8" />
              <path d="M1120,175 Q1130,160 1140,175" strokeWidth="0.8" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export default CitySkyline;
