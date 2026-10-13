/* ==========================================================================
   COACH KAL — EDITABLE CONTENT
   Packages, clinics, intro video and Instagram live here, separate from the
   page code, so the admin dashboard (phase 4) can own this data without
   touching main.js. Only confirmed facts go in; anything pending stays a
   visible placeholder (price: null, empty sessions, handle: '').
   ========================================================================== */
window.COACH_CONTENT = {
  currency: 'USD',   // PLACEHOLDER: confirm with Coach Kal before prices go live

  intro: {
    src: 'assets/media/video/coach-kal-intro.mp4',
    poster: 'assets/media/video/coach-kal-intro-poster.webp',
    duration: '0:22',
    // PLACEHOLDER: stand-in footage until Coach Kal's own 15–30s intro arrives.
    // Set to false once the real intro replaces the file above.
    standIn: true
  },

  /* Lesson packages. sports: [] = offered for every sport.
     price: number (USD) or null while pending. enabled: false hides a card. */
  packages: [
    {
      id: 'single',
      name: 'Single private lesson',
      sessions: 1,
      sports: [],
      price: null,
      summary: 'One-on-one session built around your sport and goals.',
      enabled: true
    },
    {
      id: 'pack-5',
      name: '5-session package',
      sessions: 5,
      sports: [],
      price: null,
      summary: 'A short block to work on specific parts of your game.',
      enabled: true
    },
    {
      id: 'pack-10',
      name: '10-session package',
      sessions: 10,
      sports: [],
      price: null,
      summary: 'A longer block for steady development across your game.',
      enabled: true
    }
  ],

  /* Coaching formats shown next to the packages.
     booking: 'request' = visitor sends preferred times; 'schedule' = fixed dates below. */
  formats: [
    { id: 'private', name: 'Private lessons', level: 'All levels', booking: 'request', summary: 'Pick your sport, share when you’re free, and Coach Kal confirms a time.' },
    { id: 'clinic-beginner', name: 'Beginner clinic', level: 'Beginner', booking: 'schedule', summary: 'Group sessions covering the fundamentals.' },
    { id: 'clinic-advanced', name: 'Advanced clinic', level: 'Advanced', booking: 'schedule', summary: 'Group sessions for experienced players.' }
  ],

  /* Scheduled clinic dates. Empty until Coach Kal confirms the schedule.
     Shape: { format: 'clinic-beginner', sport: 'pickleball', date: '2026-11-07',
              start: '09:00', end: '10:30', capacity: 8, booked: 3 } */
  sessions: [],

  instagram: {
    handle: '',   // PLACEHOLDER: e.g. 'coachkal' (no @) once confirmed
    // Curated posts. url: link to the real post/reel; media: a key from the site media library.
    posts: [
      { media: 'rbMedal', url: '', kind: 'post' },
      { media: 'singles', url: '', kind: 'reel' },
      { media: 'bdTeam', url: '', kind: 'post' },
      { media: 'rbBreak', url: '', kind: 'reel' },
      { media: 'pointing', url: '', kind: 'post' },
      { media: 'rbAward', url: '', kind: 'post' }
    ]
  }
};
