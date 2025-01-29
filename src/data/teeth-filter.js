function uns(tooth) {
  return {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
    17: 17,
    18: 18,
    19: 19,
    20: 20,
    21: 21,
    22: 22,
    23: 23,
    24: 24,
    25: 25,
    26: 26,
    27: 27,
    28: 28,
    29: 29,
    30: 30,
    31: 31,
    32: 32,
  }[tooth];
}

function palmer(tooth) {
  return {
    1: "8┘",
    2: "7┘",
    3: "6┘",
    4: "5┘",
    5: "4┘",
    6: "3┘",
    7: "2┘",
    8: "1┘",
    9: "└1",
    10: "└2",
    11: "└3",
    12: "└4",
    13: "└5",
    14: "└6",
    15: "└7",
    16: "└8",
    17: "┌8",
    18: "┌7",
    19: "┌6",
    20: "┌5",
    21: "┌4",
    22: "┌3",
    23: "┌2",
    24: "┌1",
    25: "1┐",
    26: "2┐",
    27: "3┐",
    28: "4┐",
    29: "5┐",
    30: "6┐",
    31: "7┐",
    32: "8┐",
  }[tooth];
}

function combinedPalmer(set) {
  let palmerArray = Array.from(set).map((tooth) => palmer(tooth));
  let combinedStr = "";
  // noinspection NonAsciiCharacters
  let combinedObject = {
    "┘": palmerArray
      .filter((item) => item.includes("┘"))
      .map((item) => item.replace("┘", "")),
    "└": palmerArray
      .filter((item) => item.includes("└"))
      .map((item) => item.replace("└", "")),
    "┐": palmerArray
      .filter((item) => item.includes("┐"))
      .map((item) => item.replace("┐", "")),
    "┌": palmerArray
      .filter((item) => item.includes("┌"))
      .map((item) => item.replace("┌", "")),
  };

  if (combinedObject["┘"].length) {
    combinedStr += combinedObject["┘"].sort().reverse().join("") + "┘";
  }
  if (combinedObject["└"].length) {
    combinedStr += "└" + combinedObject["└"].sort().join("");
  }

  if (combinedObject["┐"].length + combinedObject["┌"].length > 0) {
    combinedStr += " ";
  }

  if (combinedObject["┐"].length) {
    combinedStr += combinedObject["┐"].sort().reverse().join("") + "┐";
  }
  if (combinedObject["┌"].length) {
    combinedStr += "┌" + combinedObject["┌"].sort().join("");
  }

  return combinedStr;
}

function iso3950(tooth) {
  return {
    1: 18,
    2: 17,
    3: 16,
    4: 15,
    5: 14,
    6: 13,
    7: 12,
    8: 11,
    9: 21,
    10: 22,
    11: 23,
    12: 24,
    13: 25,
    14: 26,
    15: 27,
    16: 28,
    17: 38,
    18: 37,
    19: 36,
    20: 35,
    21: 34,
    22: 33,
    23: 32,
    24: 31,
    25: 41,
    26: 42,
    27: 43,
    28: 44,
    29: 45,
    30: 46,
    31: 47,
    32: 48,
  }[tooth];
}

function alphanumerical(tooth) {
  return {
    1: "UR8",
    2: "UR7",
    3: "UR6",
    4: "UR5",
    5: "UR4",
    6: "UR3",
    7: "UR2",
    8: "UR1",
    9: "UL1",
    10: "UL2",
    11: "UL3",
    12: "UL4",
    13: "UL5",
    14: "UL6",
    15: "UL7",
    16: "UL8",
    17: "LL8",
    18: "LL7",
    19: "LL6",
    20: "LL5",
    21: "LL4",
    22: "LL3",
    23: "LL2",
    24: "LL1",
    25: "LR1",
    26: "LR2",
    27: "LR3",
    28: "LR4",
    29: "LR5",
    30: "LR6",
    31: "LR7",
    32: "LR8",
  }[tooth];
}

function paleoanthropology(tooth) {
  return {
    1: "RM³",
    2: "RM²",
    3: "RM¹",
    4: "RP⁴",
    5: "RP³",
    6: "RC⁻",
    7: "RI²",
    8: "RI¹",
    9: "LI¹",
    10: "LI²",
    11: "LC⁻",
    12: "LP³",
    13: "LP⁴",
    14: "LM¹",
    15: "LM²",
    16: "LM³",
    17: "LM₃",
    18: "LM₂",
    19: "LM₁",
    20: "LP₄",
    21: "LP₃",
    22: "LC₋",
    23: "LI₂",
    24: "LI₁",
    25: "RI₁",
    26: "RI₂",
    27: "RC₋",
    28: "RP₃",
    29: "RP₄",
    30: "RM₁",
    31: "RM₂",
    32: "RM₃",
  }[tooth];
}

/**
 * American Dental Association (ada.org)
 * Source: https://www.news-medical.net/health/Universal-Numbering-System-for-Teeth.aspx
 */
function ada(tooth) {
  return {
    1: "3rd Molar commonly known as wisdom tooth",
    2: "2nd Molar",
    3: "1st Molar",
    4: "2nd Bicuspid also known as 2nd premolar",
    5: "1st Bicuspid or 1st premolar",
    6: "Cuspid or canine",
    7: "Lateral incisor (upper right)",
    8: "Central incisor (upper right)",
    9: "Central incisor (upper left)",
    10: "Lateral incisor (upper left)",
    11: "Cuspid (canine/eye tooth)",
    12: "1st Bicuspid or 1st premolar",
    13: "2nd Bicuspid or 2nd premolar",
    14: "1st Molar",
    15: "2nd Molar",
    16: "3rd Molar or wisdom tooth",
    17: "3rd Molar or wisdom tooth (lower left )",
    18: "2nd Molar",
    19: "1st Molar",
    20: "2nd Bicuspid or 2nd premolar",
    21: "1st Bicuspid or 1st premolar",
    22: "Cuspid or canine",
    23: "Lateral incisor",
    24: "Central incisor",
    25: "Central incisor",
    26: "Lateral incisor",
    27: "Cuspid or canine",
    28: "1st Bicuspid or 1st premolar",
    29: "2nd Bicuspid or 2nd premolar",
    30: "1st Molar",
    31: "2nd Molar",
    32: "3rd Molar (lower right wisdom tooth)",
  }[tooth];
}

function type(tooth) {
  return {
    1: "Molar",
    2: "Molar",
    3: "Molar",
    4: "Premolar",
    5: "Premolar",
    6: "Canine",
    7: "Incisor",
    8: "Incisor",
    9: "Incisor",
    10: "Incisor",
    11: "Canine",
    12: "Premolar",
    13: "Premolar",
    14: "Molar",
    15: "Molar",
    16: "Molar",
    17: "Molar",
    18: "Molar",
    19: "Molar",
    20: "Premolar",
    21: "Premolar",
    22: "Canine",
    23: "Incisor",
    24: "Incisor",
    25: "Incisor",
    26: "Incisor",
    27: "Canine",
    28: "Premolar",
    29: "Premolar",
    30: "Molar",
    31: "Molar",
    32: "Molar",
  }[tooth];
}

function region(tooth) {
  return {
    1: "Upper Right",
    2: "Upper Right",
    3: "Upper Right",
    4: "Upper Right",
    5: "Upper Right",
    6: "Upper Right",
    7: "Upper Right",
    8: "Upper Right",
    9: "Upper Left",
    10: "Upper Left",
    11: "Upper Left",
    12: "Upper Left",
    13: "Upper Left",
    14: "Upper Left",
    15: "Upper Left",
    16: "Upper Left",
    17: "Lower Left",
    18: "Lower Left",
    19: "Lower Left",
    20: "Lower Left",
    21: "Lower Left",
    22: "Lower Left",
    23: "Lower Left",
    24: "Lower Left",
    25: "Lower Right",
    26: "Lower Right",
    27: "Lower Right",
    28: "Lower Right",
    29: "Lower Right",
    30: "Lower Right",
    31: "Lower Right",
    32: "Lower Right",
  }[tooth];
}

export default {
  uns: uns,
  palmer: palmer,
  combinedPalmer: combinedPalmer,
  fdi: iso3950,
  alphanum: alphanumerical,
  paleoanthropology: paleoanthropology,
  ada: ada,
  type: type,
  region: region,
};
