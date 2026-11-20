/**
 * Free-to-use photography from Unsplash (https://unsplash.com/license).
 * Free for commercial and personal use, no attribution required.
 * Credit is kept here as good practice, not a legal requirement.
 *
 * All URLs use `auto=format` (WebP where supported) and explicit width/quality
 * so the templates stay fast. Swap the host here if you self-host the assets.
 */

const u = (id: string, w = 800, extra = '') =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=78${extra}`

export const PHOTOS = {
  // interiors / hero
  livingRoom: u('photo-1586023492125-27b2c045efd7', 1200),
  brightInterior: u('photo-1616486338812-3dadae4b4ace', 1200),
  sofa: u('photo-1555041469-a586c61ea9bc', 1000),
  modernLiving: u('photo-1600210492486-724fe5c67fb0', 1200),
  minimalInterior: u('photo-1618221195710-dd6b41faaea6', 1200),
  warmRoom: u('photo-1600585154340-be6161a56a0c', 1200),
  bedroom: u('photo-1505693416388-ac5ce068fe85', 1000),
  office: u('photo-1497366754035-f200968a6e72', 1200),
  officeAlt: u('photo-1497366811353-6870744d04b2', 1000),
  workspace: u('photo-1524758631624-e2822e304c36', 1000),
  studio: u('photo-1497366216548-37526070297c', 1000),

  // furniture / products
  chair: u('photo-1567538096630-e0c55bd6374c', 700),
  armchair: u('photo-1598300042247-d088f8ab3a91', 700),
  loungeChair: u('photo-1615874959474-d609969a20ed', 700),
  table: u('photo-1513506003901-1e6a229e2d15', 700),
  dining: u('photo-1615529182904-14819c35db37', 700),
  lamp: u('photo-1507473885765-e6ed057f782c', 700),
  pendant: u('photo-1540574163026-643ea20ade25', 700),
  shelf: u('photo-1594620302200-9a762244a156', 700),
  bookcase: u('photo-1578749556568-bc2c40e68b61', 700),
  mirror: u('photo-1616594039964-ae9021a400a0', 700),
  rug: u('photo-1600210491892-03d54c0aaf87', 700),
  textile: u('photo-1522708323590-d24dbb6b0267', 700),
  ceramics: u('photo-1567016432779-094069958ea5', 700),
  plant: u('photo-1538688423619-a81d3f23454b', 700),
  livingDetail: u('photo-1583845112203-29329902332e', 700),
  loft: u('photo-1600607687939-ce8a6c25118c', 1000),

  // portraits
  face1: u('photo-1560250097-0b93528c311a', 200),
  face2: u('photo-1573496359142-b8d87734a5a2', 200),
  face3: u('photo-1519085360753-af0119f7cbe7', 200),
  face4: u('photo-1580489944761-15a19d654956', 200),
  face5: u('photo-1500648767791-00dcc994a43e', 200),
  face6: u('photo-1534528741775-53994a69daeb', 200),
} as const

export type PhotoKey = keyof typeof PHOTOS
