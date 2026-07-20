export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizSubject {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  categoryNames: string[];
}

export const QUIZ_SUBJECTS: QuizSubject[] = [
  {
    id: 'lgbtq_quiz',
    title: 'LGBTQ+ Knowledge & Safety Interview',
    description: 'Required for all LGBTQ+ assistance and peer guidance tracks. Covers inclusive terminology, safe environments, non-clinical active listening, and global safety considerations.',
    categoryNames: [
      'LGBTQ+ Relocation Assistant',
      'Coming-Out Support Peer (non-clinical)',
      'Pride Event Guide',
      'LGBTQ+ Travel Safety Consultant'
    ],
    questions: [
      {
        id: 'lgbtq_1',
        question: 'What is the primary role of an LGBTQ+ Relocation Assistant?',
        options: [
          'Sourcing high-risk commercial real estate for corporate trade.',
          'Evaluating neighborhood safety, identifying local inclusive hubs, and connecting clients to supportive communities.',
          'Conducting mandatory clinical psychometric evaluations.'
        ],
        correctAnswer: 'Evaluating neighborhood safety, identifying local inclusive hubs, and connecting clients to supportive communities.'
      },
      {
        id: 'lgbtq_2',
        question: 'When acting as a Coming-Out Support Peer, what is the best non-clinical active listening practice?',
        options: [
          'Providing a safe, confidential, deeply empathetic, and completely non-judgmental space to share experiences.',
          'Formally diagnosing psychological conditions and recommending drug prescriptions.',
          'Instructing the client to suppress their feelings to avoid social conflict.'
        ],
        correctAnswer: 'Providing a safe, confidential, deeply empathetic, and completely non-judgmental space to share experiences.'
      },
      {
        id: 'lgbtq_3',
        question: 'For an LGBTQ+ Travel Safety Consultant, what is the top priority before advising on an international itinerary?',
        options: [
          'Assessing local country laws, human rights rankings, and socio-cultural climates to ensure client security.',
          'Booking discount economy flight vouchers with third-party carriers.',
          'Insisting that clients stay inside their hotel rooms at all times.'
        ],
        correctAnswer: 'Assessing local country laws, human rights rankings, and socio-cultural climates to ensure client security.'
      }
    ]
  },
  {
    id: 'etiquette_quiz',
    title: 'High Society Etiquette & Companionship Quiz',
    description: 'Required for all social accompany, guest appearances, and companion tracks. Focuses on poise, elite etiquette, active conversation, and client representation.',
    categoryNames: [
      'Event Companion',
      'Wedding Guest',
      'Gala or Charity Event Guest',
      'Conference Networking Partner',
      'VIP Guest Appearance',
      'Museum or Cultural Companion',
      'Concert Companion',
      'Dining Companion',
      'Senior Companion',
      'Accessibility Companion',
      'Community Volunteer Partner',
      'Vacation Companion'
    ],
    questions: [
      {
        id: 'etiq_1',
        question: 'If you are representing a client at a formal charity gala, what is the most appropriate behavior?',
        options: [
          'Pitching your own secondary business services to all high-net-worth guests you meet.',
          'Maintaining superb posture, engaging in positive, sophisticated conversation, and representing your client with absolute grace.',
          'Indulging in excessive alcohol and initiating debate on political affairs.'
        ],
        correctAnswer: 'Maintaining superb posture, engaging in positive, sophisticated conversation, and representing your client with absolute grace.'
      },
      {
        id: 'etiq_2',
        question: 'How should an Accessibility Companion handle a client who faces a physical barrier at an event?',
        options: [
          'Tell the client to wait outside while you enjoy the event.',
          'Proactively plan the route, verify elevator access in advance, and adapt to the client\'s pace with empathy and patience.',
          'Insist on picking up the client physically without their permission.'
        ],
        correctAnswer: 'Proactively plan the route, verify elevator access in advance, and adapt to the client\'s pace with empathy and patience.'
      }
    ]
  },
  {
    id: 'admin_quiz',
    title: 'Elite Professional & Administration Interview',
    description: 'Required for all consulting, advising, and administrative assistant tracks. Covers business communications, schedule gating, client confidentiality, and focus coaching.',
    categoryNames: [
      'Financial Mentor',
      'Career Coach',
      'Resume & LinkedIn Consultant',
      'Business Consultant',
      'Startup Advisor',
      'Accountability Coach',
      'Personal Assistant',
      'Executive Assistant',
      'Research Assistant',
      'Virtual Assistant',
      'Remote Administrative Support'
    ],
    questions: [
      {
        id: 'adm_1',
        question: 'When handling highly sensitive corporate emails as an Executive Assistant, how do you guarantee confidentiality?',
        options: [
          'Cc\'ing your close friends so they can double-check the email quality.',
          'Enforcing secure inbox access protocols, never sharing credentials, and verifying sender/recipient authentications.',
          'Sharing screenshots of important briefs on private social media accounts.'
        ],
        correctAnswer: 'Enforcing secure inbox access protocols, never sharing credentials, and verifying sender/recipient authentications.'
      },
      {
        id: 'adm_2',
        question: 'What is the primary methodology of an Accountability Coach?',
        options: [
          'Executing the tasks for the client so they don\'t have to work.',
          'Establishing clear habit-tracking, conducting regular goal audits, and providing motivating support to build consistency.',
          'Fining the client financially whenever they fail to complete a daily target.'
        ],
        correctAnswer: 'Establishing clear habit-tracking, conducting regular goal audits, and providing motivating support to build consistency.'
      }
    ]
  },
  {
    id: 'travel_quiz',
    title: 'Global Luxury Travel & Local Guiding Interview',
    description: 'Required for all guides, translation, airport concierge, and travel planning specialties. Covers flight delays, bespoke local curation, and luxury travel service standards.',
    categoryNames: [
      'Travel Assistant',
      'Travel Planner',
      'Local City Guide',
      'Airport Concierge',
      'Language Partner',
      'Museum or Historical Tour Guide',
      'Nightlife Guide'
    ],
    questions: [
      {
        id: 'trav_1',
        question: 'As a Local City Guide, how do you curate an unforgettable local tour for an elite visitor?',
        options: [
          'Taking them to generic souvenir traps and reciting scripted online articles.',
          'Designing a customized route based on their artistic, culinary, or historic preferences, highlighting exclusive local gems.',
          'Allowing them to wander alone while you wait in your personal car.'
        ],
        correctAnswer: 'Designing a customized route based on their artistic, culinary, or historic preferences, highlighting exclusive local gems.'
      },
      {
        id: 'trav_2',
        question: 'What should an Airport Concierge do if a client\'s luxury flight is delayed by several hours?',
        options: [
          'Inform the client and tell them to wait in the terminal lobby seating area.',
          'Promptly coordinate private VIP lounge access, check for alternative routing options, and handle airport luggage transfer details.',
          'Advise the client to cancel their entire trip and book a train.'
        ],
        correctAnswer: 'Promptly coordinate private VIP lounge access, check for alternative routing options, and handle airport luggage transfer details.'
      }
    ]
  },
  {
    id: 'navigation_quiz',
    title: 'Safe Navigation & Luxury Transportation Quiz',
    description: 'Required for all driving, chauffeuring, errand, and grocery logistics specialties. Covers defensive driving, estate errand dispatch, and client safety.',
    categoryNames: [
      'Personal Transportation Manager',
      'Designated Driver (where permitted)',
      'Chauffeur Service',
      'Errand Runner',
      'Grocery Shopper'
    ],
    questions: [
      {
        id: 'nav_1',
        question: 'When operating as an elite Chauffeur, what is your most important operational protocol?',
        options: [
          'Pristine defensive driving, advanced route mapping, vehicle cleanliness, and maintaining supreme safety at all times.',
          'Reaching the destination in record speed by neglecting local traffic signals.',
          'Chatting about personal politics with the client to pass the driving time.'
        ],
        correctAnswer: 'Pristine defensive driving, advanced route mapping, vehicle cleanliness, and maintaining supreme safety at all times.'
      },
      {
        id: 'nav_2',
        question: 'When executing complex grocery or errand runs for an estate, how should you organize the logistics?',
        options: [
          'Just pick the cheapest generic brands and deliver them whenever you have free time.',
          'Check dietary specifications carefully, pick pristine organic produce, and coordinate fresh delivery times with the household manager.',
          'Drop the grocery bags in the estate driveway without letting anyone know.'
        ],
        correctAnswer: 'Check dietary specifications carefully, pick pristine organic produce, and coordinate fresh delivery times with the household manager.'
      }
    ]
  },
  {
    id: 'estate_quiz',
    title: 'Estate Management & Interior Organization Quiz',
    description: 'Required for all decluttering, wardrobe, styling, and home organization specialties. Covers client space etiquette, organizing standards, and cleaning team management.',
    categoryNames: [
      'Home Organization Specialist',
      'Decluttering Consultant',
      'Moving Assistant',
      'Cleaning Manager',
      'Laundry & Wardrobe Organizer',
      'Closet Stylist',
      'Interior Decorating Assistant',
      'House Sitter'
    ],
    questions: [
      {
        id: 'est_1',
        question: 'What is the most respectful and effective way to guide a client through a decluttering process?',
        options: [
          'Discarding all old items when the client is out of the room to speed up space-clearing.',
          'Evaluating items collaboratively, honoring sentimental memories, and establishing logical aesthetic storage systems.',
          'Telling the client they have poor taste in clothing and home accessories.'
        ],
        correctAnswer: 'Evaluating items collaboratively, honoring sentimental memories, and establishing logical aesthetic storage systems.'
      },
      {
        id: 'est_2',
        question: 'As a Cleaning Manager responsible for an elite property, how do you verify housekeeping quality?',
        options: [
          'Relying on the staff\'s verbal word that the cleaning is done.',
          'Establishing a comprehensive, checklist-based quality standard and inspecting high-visibility zones regularly.',
          'Asking the client to inspect the estate and report any dusty spots.'
        ],
        correctAnswer: 'Establishing a comprehensive, checklist-based quality standard and inspecting high-visibility zones regularly.'
      }
    ]
  },
  {
    id: 'pet_quiz',
    title: 'Premium Pet Care & Botanical Husbandry Quiz',
    description: 'Required for pet-sitting, dog walking, pet exercise, and plant care. Covers safety, botanical moisture metrics, and animal behavioral standards.',
    categoryNames: [
      'Pet Sitter',
      'Dog Walker',
      'Pet Transportation',
      'Pet Exercise Provider',
      'Plant Care Provider'
    ],
    questions: [
      {
        id: 'pet_1',
        question: 'When dog walking in an active public space, how do you manage animal interaction safety?',
        options: [
          'Letting the pet wander off-leash to socialise with all passing dogs.',
          'Keeping the pet on a secure leash, observing body language closely, and following the client\'s precise guidelines.',
          'Allowing strangers to feed your client\'s pet unchecked treats.'
        ],
        correctAnswer: 'Keeping the pet on a secure leash, observing body language closely, and following the client\'s precise guidelines.'
      },
      {
        id: 'pet_2',
        question: 'While house sitting and looking after exotic botanical specimens, what should guide your watering schedule?',
        options: [
          'Watering all plants with equal amounts of heavy water daily regardless of species.',
          'Testing the soil moisture levels, reviewing specific species instructions, and adhering to the bespoke botanical schedule.',
          'Ignoring the plants until they show signs of wilting.'
        ],
        correctAnswer: 'Testing the soil moisture levels, reviewing specific species instructions, and adhering to the bespoke botanical schedule.'
      }
    ]
  },
  {
    id: 'digital_quiz',
    title: 'Digital Arts, Technology & Fashion Styling Quiz',
    description: 'Required for all styling, personal shopping, photography, and social media tracks. Covers lighting setups, client privacy during photos, smart home security, and styled combinations.',
    categoryNames: [
      'Technology Tutor',
      'Computer Setup & Support',
      'Smartphone Coach',
      'Smart Home Setup',
      'Photography Assistant',
      'Social Media Consultant',
      'Content Creator',
      'Video Editor',
      'Personal Photographer',
      'Fashion Stylist',
      'Personal Shopper',
      'Grooming Consultant'
    ],
    questions: [
      {
        id: 'dig_1',
        question: 'When providing Personal Photography for an elite client at a private location, how do you manage client privacy?',
        options: [
          'Uploading the raw, candid files to public cloud directories without explicit signing.',
          'Securing file storage, asking before taking candid photos, and never publishing or sharing media without absolute written consent.',
          'Sending the best photos to media reporters to help the client gain visibility.'
        ],
        correctAnswer: 'Securing file storage, asking before taking candid photos, and never publishing or sharing media without absolute written consent.'
      },
      {
        id: 'dig_2',
        question: 'What is the primary safety measure when configuring a Smart Home Setup for an executive residence?',
        options: [
          'Leaving the default router passwords unchanged for quick, hassle-free remote logins.',
          'Implementing highly secure WPA3 encryption, setting up dedicated IoT networks, and creating unique, complex admin credentials.',
          'Disabling local firewalls to allow smart speakers to connect faster.'
        ],
        correctAnswer: 'Implementing highly secure WPA3 encryption, setting up dedicated IoT networks, and creating unique, complex admin credentials.'
      }
    ]
  },
  {
    id: 'wellness_quiz',
    title: 'Holistic Wellness, Meditation & Culinary Quiz',
    description: 'Required for cooking, meal prep, yoga, meditation, and massage coordination. Covers safety guidelines, nutritional metrics, and breathing loops.',
    categoryNames: [
      'Meal Prep Assistant',
      'Cooking Lessons',
      'Wellness Coach',
      'Meditation Guide',
      'Yoga Instructor',
      'Massage Referral Coordinator (booking only, not treatment unless licensed)'
    ],
    questions: [
      {
        id: 'wel_1',
        question: 'What is the legal and operational limit for a Massage Referral Coordinator on our platform?',
        options: [
          'They can provide full therapeutic deep-tissue physical massage treatments without any license.',
          'They act strictly as an administrative booking partner to source certified local licensed massage therapists; they do not perform physical therapy themselves.',
          'They only offer physical massage treatment inside the client\'s private moving vehicles.'
        ],
        correctAnswer: 'They act strictly as an administrative booking partner to source certified local licensed massage therapists; they do not perform physical therapy themselves.'
      },
      {
        id: 'wel_2',
        question: 'When leading an anxious client through their first Meditation session, what is the best technique to start with?',
        options: [
          'Commanding them to empty their mind instantly under penalty of session cancellation.',
          'Guiding them through gentle, slow diaphragmatic breathing loops and non-judgmental observation of drifting thoughts.',
          'Playing high-decibel heavy metal music to distract them from their stress.'
        ],
        correctAnswer: 'Guiding them through gentle, slow diaphragmatic breathing loops and non-judgmental observation of drifting thoughts.'
      }
    ]
  },
  {
    id: 'concierge_quiz',
    title: 'Compassionate Care & Elite Concierge Quiz',
    description: 'Required for personal concierge, virtual assistant, senior and accessibility assistance. Covers high-touch concierge booking, active empathy, and administrative discretion.',
    categoryNames: [
      'Personal Concierge',
      'Virtual Assistant',
      'Remote Administrative Support',
      'Senior Companion',
      'Accessibility Companion',
      'Community Volunteer Partner'
    ],
    questions: [
      {
        id: 'con_1',
        question: 'As a Personal Concierge tasked with reserving a highly sought-after restaurant table, what is the best practice?',
        options: [
          'Waiting until the last minute and hoping for a walk-in opportunity.',
          'Leveraging certified elite booking networks, calling reservation directors politely, and setting clear timing flags.',
          'Telling the client to call the restaurant themselves to verify seating.'
        ],
        correctAnswer: 'Leveraging certified elite booking networks, calling reservation directors politely, and setting clear timing flags.'
      },
      {
        id: 'con_2',
        question: 'When hired as a Senior Companion, what is your most important social and safety standard?',
        options: [
          'Leaving the senior client unattended while you complete personal errands.',
          'Maintaining rich, patient, and deeply empathetic conversation, monitoring safety hazards, and escorting them with absolute care.',
          'Forcing the senior client to participate in high-intensity exercise drills.'
        ],
        correctAnswer: 'Maintaining rich, patient, and deeply empathetic conversation, monitoring safety hazards, and escorting them with absolute care.'
      }
    ]
  }
];

export function getRequiredQuizzes(selectedCategoryNames: string[]): QuizSubject[] {
  if (!selectedCategoryNames || selectedCategoryNames.length === 0) return [];
  
  return QUIZ_SUBJECTS.filter(subject => 
    subject.categoryNames.some(catName => selectedCategoryNames.includes(catName))
  );
}
