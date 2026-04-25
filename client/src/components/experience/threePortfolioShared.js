export const sectionOrder = ["home", "about", "skills", "projects", "experience", "education", "contact"];

export const sectionLabels = {
  home: "Home",
  about: "About",
  skills: "Skills",
  projects: "Projects",
  experience: "Experience",
  education: "Education",
  contact: "Contact"
};

export function emitSectionChange(section) {
  window.dispatchEvent(new CustomEvent("portfolio-section-change", { detail: section }));
}

export function isValidPortfolioSection(section) {
  return sectionOrder.includes(section);
}

export function getThreePortfolioDesign(design) {
  return design === "design2" ? "design2" : "design1";
}
