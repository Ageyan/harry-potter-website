let firstBtn = document.querySelector(".hero-section__button");
let charSection = document.querySelector(".all-char-section");
firstBtn.addEventListener("click", () => {
    charSection.classList.toggle("visually-hidden");
    // window.scrollTo({top: 630 , left: 0,behavior: 'smooth' });
    const target = document.querySelector('#target'); // замените на нужный селектор
    target.scrollIntoView({ behavior: 'smooth' });
});

const studentsPage = () => window.location.href = 'pages/students.html';
const staffPage = () => window.location.href = 'pages/staff.html';
const charactersPage = () => window.location.href = 'pages/characters.html';
