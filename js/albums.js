/* ==========================================================
   Honey Star Resources Limited — gallery albums
   This is the only file to edit when adding albums or pictures.

   Each album has:
     id          a short name for the web address: lowercase letters,
                 numbers and dashes only, and different for every album
     title       the album name shown on the cover and the album page
     description one optional line shown under the album title
     cover       the picture shown on the gallery cover
     images      the pictures inside the album, in the order they appear
                   src      path to the picture file
                   alt      a short description of what the picture shows
                   caption  optional text shown on the picture

   To add a picture: put the file in that album's folder inside
   assets/gallery/, then add a line to that album's "images" list.

   An apostrophe inside any text needs a backslash before it,
   for example: 'HoneyStar\'s Engagement'.

   To add an album: copy one whole { ... } block below, paste it after
   the last one (keep the comma between blocks) and change its details.
   ========================================================== */

window.HONEYSTAR_ALBUMS = [
  {
    id: 'nigerian-army-engagement',
    title: 'HoneyStar\'s Engagement with the Leadership of the Nigerian Army to Upgrade their Medical Facilities and Equipment',
    description: '',
    cover: 'assets/gallery/nigerian-army-engagement/cover.jpg',
    images: [
      { src: 'assets/gallery/nigerian-army-engagement/photo-01.jpg', alt: 'A guest in a tan kaftan and maroon cap gestures while standing beside an army officer in green uniform', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-02.jpg', alt: 'An army officer shakes hands with a guest in a blue suit while presenting a boxed medallion', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-03.jpg', alt: 'Four members of the delegation seated at a conference table with microphones', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-04.jpg', alt: 'An army officer shakes hands with a guest in a white kaftan and patterned cap while presenting a boxed medallion', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-05.jpg', alt: 'A meeting around a conference table, with an officer in camouflage at the head, guests on the left and officers on the right', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-06.jpg', alt: 'An army officer in camouflage and two guests in grey kaftans seated at the conference table', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-07.jpg', alt: 'Two guests in grey kaftans and caps at the conference table, one speaking into a microphone', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-08.jpg', alt: 'An army officer shakes hands with a smiling guest in a dark suit while presenting a boxed medallion', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-09.jpg', alt: 'A guest in a grey kaftan and cap looks down at his notes during the meeting', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-10.jpg', alt: 'Five members of the delegation seated in a row at the conference table', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-11.jpg', alt: 'An army officer in green uniform smiles as a guest in a tan kaftan and maroon cap signs a book', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-12.jpg', alt: 'Guests and an army officer seated along a table taking notes, with model aircraft and vehicles on display', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-13.jpg', alt: 'An army officer shakes hands with a guest in a tan kaftan and maroon cap, holding a wooden plaque between them', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-14.jpg', alt: 'An army officer at the head of the table speaks to four seated guests', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-15.jpg', alt: 'An army officer in green uniform speaks during the meeting, hands together', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-16.jpg', alt: 'Wide view of the meeting, with officers and guests seated around a long table in an office', caption: '' },
      { src: 'assets/gallery/nigerian-army-engagement/photo-17.jpg', alt: 'An army officer hands a wooden plaque to a guest in a tan kaftan and maroon cap', caption: '' }
    ]
  },
  {
    id: 'benin-republic-engagement',
    title: 'Strategic Business Development Between Honeystar Resources and The Government of Benin Republic',
    description: '',
    cover: 'assets/gallery/benin-republic-engagement/cover.jpg',
    images: [
      { src: 'assets/gallery/benin-republic-engagement/photo-01.jpg', alt: 'Two men standing together on dark marble steps outside a white colonnaded building, one in a tan kaftan and one in a dark suit', caption: '' },
      { src: 'assets/gallery/benin-republic-engagement/photo-02.jpg', alt: 'Twelve members of the delegation standing in a row on dark marble steps outside a white colonnaded building', caption: '' }
    ]
  }
];
