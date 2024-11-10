const colorPalette = [
  "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF",
  "#FFC3A0", "#E2F0CB", "#C8D8E4", "#D1C2C2", "#FFB7B2"
];

export function getColorFromId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}
