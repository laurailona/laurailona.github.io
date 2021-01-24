// class SectionInfo {
//   constructor(title, image, description, colour) {
//     this.title = title;
//     this.image = image;
//     this.description = description;
//     this.colour = colour;
//   }
// }
//
// let aboutSection = [];
// aboutSection.push(new SectionInfo("MSc Computer Science", "images/about-msc.svg", "After studying part-time by distance learning, I graduated with an MSc Computer Science with distinction from the University of Hertefordshire. Modules included Advanced Database, Secure Systems Programming, Interaction Design and E-Learning Application Development, among others.", "#ffcf57"));
// aboutSection.push(new SectionInfo("Instructional Design Experience", "images/about-freelance.svg", "After studying part-time by distance learning, I graduated with an MSc Computer Science with distinction from the University of Hertefordshire. Modules included Advanced Database, Secure Systems Programming, Interaction Design and E-Learning Application Development, among others.", "#ffcf57"));
// aboutSection.push(new SectionInfo("Frontend skills and design", "images/about-design.svg", "After studying part-time by distance learning, I graduated with an MSc Computer Science with distinction from the University of Hertefordshire. Modules included Advanced Database, Secure Systems Programming, Interaction Design and E-Learning Application Development, among others.", "#ffcf57"));
// aboutSection.push(new SectionInfo("Backend and database skills", "images/about-backend.svg", "After studying part-time by distance learning, I graduated with an MSc Computer Science with distinction from the University of Hertefordshire. Modules included Advanced Database, Secure Systems Programming, Interaction Design and E-Learning Application Development, among others.", "#ffcf57"));
// aboutSection.push(new SectionInfo("Efficient work flow", "images/about-workflow.svg", "After studying part-time by distance learning, I graduated with an MSc Computer Science with distinction from the University of Hertefordshire. Modules included Advanced Database, Secure Systems Programming, Interaction Design and E-Learning Application Development, among others.", "#ffcf57"));
//
//
// // let mscSection = {};
// //
// //
// const ABOUT_IMAGE = document.querySelector("#about-image");
// const ABOUT_TEXT = document.querySelector("#about-text");
// const ABOUT_TITLE = document.querySelector("#about-title");
// const ABOUT_LIST = document.querySelectorAll(".about-list li");
//
// function hoverAbout(i) {
//   // Set image url
//   ABOUT_IMAGE.setAttribute("src", aboutSection[i].image);
//   // Set title
//   ABOUT_TITLE.textContent = aboutSection[i].title;
//   // Set text
//   ABOUT_TEXT.textContent = aboutSection[i].description;
// }
//
// ABOUT_LIST.forEach((x, i) => {
//   x.addEventListener("mouseover", function() { hoverAbout(i); });
// })
